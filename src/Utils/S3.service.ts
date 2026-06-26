import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  static readonly UPLOADS_PREFIX = 'images/uploads/';

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
    )!;
    this.region = this.configService.get<string>('AWS_REGION')!;
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const credentials =
      accessKeyId && secretAccessKey
        ? {
            accessKeyId,
            secretAccessKey,
          }
        : undefined;

    this.s3Client = new S3Client({
      region: this.region,
      ...(credentials ? { credentials } : {}),
    });
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const key = this.sanitizeKey(fileName);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );

    return this.publicUrl(key);
  }

  /**
   * Remove do bucket o objeto apontado pela URL, se (e somente se) for um
   * upload feito pela aplicação (prefixo images/uploads/ deste bucket).
   * Best-effort: falhas são logadas e não interrompem o fluxo chamador.
   */
  async deleteUploadedFileByUrl(url: string): Promise<boolean> {
    const key = this.keyFromUrl(url);
    if (!key || !key.startsWith(S3Service.UPLOADS_PREFIX)) {
      return false;
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
      );
      this.logger.log(`Objeto removido do S3: ${key}`);
      return true;
    } catch (error) {
      this.logger.warn(
        `Falha ao remover objeto do S3 (${key}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  /** Extrai a key se a URL pertencer a este bucket; senão retorna null. */
  private keyFromUrl(url: string): string | null {
    const prefixes = [
      `https://${this.bucketName}.s3.${this.region}.amazonaws.com/`,
      `https://${this.bucketName}.s3.amazonaws.com/`,
      `https://s3.${this.region}.amazonaws.com/${this.bucketName}/`,
    ];

    for (const prefix of prefixes) {
      if (url.startsWith(prefix)) {
        const rawKey = url.slice(prefix.length).split('?')[0];
        try {
          return decodeURIComponent(rawKey);
        } catch {
          return rawKey;
        }
      }
    }

    return null;
  }

  // Normaliza cada segmento da key (acentos e espaços viram '-') para que a
  // URL pública resultante seja válida sem encoding adicional.
  private sanitizeKey(fileName: string): string {
    return fileName
      .split('/')
      .map((segment) =>
        segment
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-zA-Z0-9._-]+/g, '-'),
      )
      .filter(Boolean)
      .join('/');
  }

  private publicUrl(key: string): string {
    const encodedKey = key.split('/').map(encodeURIComponent).join('/');
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${encodedKey}`;
  }
}
