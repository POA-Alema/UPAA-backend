import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  validateLanguage,
  translateLocalizedValue,
} from '../../../common/i18n';
import { S3Service } from '../../../Utils/S3.service';
import { AuthenticatedAdmin } from '../../auth/types/authenticated-admin';
import { CreateArchitectDto } from '../dto/create-architect.dto';
import { UpdateArchitectDto } from '../dto/update-architect.dto';

type I18nTextValue = { pt: string; en: string; de: string };
type DatePartsValue = { day: number; month: number; year: number; iso: string };
type PlaceValue = { city: string; country: string };
type LifeEventValue = { date: DatePartsValue; place: PlaceValue };
type PersonNameValue = { first: string; last: string; full: string };
type ArchitectMediaValue = {
  portrait_url: string;
  alt_text: I18nTextValue;
};
type ArchitectCharacteristicsValue = {
  style: I18nTextValue;
  influences: I18nTextValue;
  legacy: I18nTextValue;
};

const DEFAULT_STATUS = 'published';

function trim(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toI18n(value: string | null | undefined): I18nTextValue {
  const text = trim(value);
  return { pt: text, en: text, de: text };
}

function pickI18n(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const map = value as Partial<I18nTextValue>;
  return trim(map.pt) || trim(map.en) || trim(map.de);
}

function dateParts(day: number, month: number, year: number): DatePartsValue {
  const safeDay = Number.isFinite(day) ? day : 1;
  const safeMonth = Number.isFinite(month) ? month : 1;
  const safeYear = Number.isFinite(year) ? year : 0;

  return {
    day: safeDay,
    month: safeMonth,
    year: safeYear,
    iso: `${String(safeYear).padStart(4, '0')}-${String(safeMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`,
  };
}

function toLifeEvent(
  day: number,
  month: number,
  year: number,
  city: string,
  country: string,
): LifeEventValue {
  return {
    date: dateParts(day, month, year),
    place: {
      city: trim(city),
      country: trim(country),
    },
  };
}

function fromLifeEvent(event: unknown) {
  const record = event as Partial<LifeEventValue> | null | undefined;

  return {
    day: record?.date?.day,
    month: record?.date?.month,
    year: record?.date?.year,
    city: record?.place?.city,
    country: record?.place?.country,
  };
}

function fromName(name: unknown): PersonNameValue {
  const record = name as Partial<PersonNameValue> | null | undefined;
  const first = trim(record?.first);
  const last = trim(record?.last);
  const full = trim(record?.full) || [first, last].filter(Boolean).join(' ');

  return { first, last, full };
}

function slugFromName(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .filter((part) => trim(part).length > 0)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function hasAnyKey<T extends object>(source: Partial<T>, keys: Array<keyof T>): boolean {
  return keys.some((key) => source[key] !== undefined);
}

@Injectable()
export class ArchitectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async findAll() {
    const architects = await this.prisma.architect.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    });

    return architects.map((architect) => {
      const name = architect.name as
        | { first?: string; last?: string; full?: string }
        | null;
      const fullName =
        name?.full ?? [name?.first, name?.last].filter(Boolean).join(' ');

      return {
        id: architect.id,
        slug: architect.slug,
        name: fullName,
      };
    });
  }

  async findAllAdmin() {
    const architects = await this.prisma.architect.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { buildings: true },
        },
      },
    });

    return architects.map((architect) =>
      this.toAdminArchitect(architect, architect._count?.buildings ?? 0),
    );
  }

  async findOneAdmin(id: string) {
    const architect = await this.prisma.architect.findUnique({
      where: { id },
      include: {
        _count: {
          select: { buildings: true },
        },
      },
    });

    if (!architect) {
      throw new NotFoundException('Arquiteto não encontrado.');
    }

    return this.toAdminArchitect(architect, architect._count?.buildings ?? 0);
  }

  async create(dto: CreateArchitectDto, currentAdmin: AuthenticatedAdmin) {
    try {
      const architect = await this.prisma.architect.create({
        data: {
          slug: slugFromName(dto.firstName, dto.lastName),
          status: dto.status ?? DEFAULT_STATUS,
          name: this.buildName(dto),
          media: this.buildMedia(dto),
          birth: toLifeEvent(
            dto.birthDay,
            dto.birthMonth,
            dto.birthYear,
            dto.birthCity,
            dto.birthCountry,
          ),
          death: this.buildDeath(dto),
          citizenship: trim(dto.citizenship),
          occupation: trim(dto.occupation),
          about: toI18n(dto.about),
          characteristics: this.buildCharacteristics(dto),
          createdById: currentAdmin.id,
          updatedById: currentAdmin.id,
        } as Prisma.ArchitectUncheckedCreateInput,
      });

      return this.toAdminArchitect(architect, 0);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async update(id: string, dto: UpdateArchitectDto, currentAdmin: AuthenticatedAdmin) {
    const existing = await this.ensureExists(id);
    const data: Prisma.ArchitectUncheckedUpdateInput = {
      updatedById: currentAdmin.id,
    };

    if (dto.status !== undefined) data.status = dto.status;

    if (hasAnyKey(dto, ['firstName', 'lastName', 'fullName'])) {
      const nextName = this.buildName(dto, existing.name);
      data.name = nextName;
      data.slug = slugFromName(nextName.first, nextName.last);
    }

    if (hasAnyKey(dto, ['portraitUrl', 'portraitAlt'])) {
      data.media = this.buildMedia(dto, existing.media);
    }

    if (hasAnyKey(dto, ['birthDay', 'birthMonth', 'birthYear', 'birthCity', 'birthCountry'])) {
      const birth = fromLifeEvent(existing.birth);
      data.birth = toLifeEvent(
        dto.birthDay ?? birth.day ?? 1,
        dto.birthMonth ?? birth.month ?? 1,
        dto.birthYear ?? birth.year ?? 0,
        dto.birthCity ?? birth.city ?? '',
        dto.birthCountry ?? birth.country ?? '',
      );
    }

    if (
      dto.deathYear === null ||
      hasAnyKey(dto, ['deathDay', 'deathMonth', 'deathYear', 'deathCity', 'deathCountry'])
    ) {
      data.death = dto.deathYear === null ? null : this.buildDeath(dto, existing.death);
    }

    if (dto.citizenship !== undefined) data.citizenship = trim(dto.citizenship);
    if (dto.occupation !== undefined) data.occupation = trim(dto.occupation);
    if (dto.about !== undefined) data.about = toI18n(dto.about);

    if (hasAnyKey(dto, ['style', 'influences', 'legacy'])) {
      data.characteristics = this.buildCharacteristics(dto, existing.characteristics);
    }

    try {
      const updated = await this.prisma.architect.update({
        where: { id },
        data,
      });

      if (dto.portraitUrl !== undefined && dto.portraitUrl !== this.portraitUrl(existing.media)) {
        await this.deleteUploadsFromS3([this.portraitUrl(existing.media)]);
      }

      return this.toAdminArchitect(updated);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async remove(id: string) {
    const existing = await this.ensureExists(id);
    const buildingsCount = await this.prisma.building.count({
      where: { architectId: id },
    });

    if (buildingsCount > 0) {
      throw new BadRequestException(
        'Não é possível remover um arquiteto com edificações vinculadas.',
      );
    }

    const deleted = await this.prisma.architect.delete({
      where: { id },
    });

    await this.deleteUploadsFromS3([this.portraitUrl(existing.media)]);

    return this.toAdminArchitect(deleted, 0);
  }

  async uploadPortrait(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    if (!file) {
      throw new BadRequestException('Arquivo de retrato é obrigatório.');
    }

    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const url = await this.s3Service.uploadFile(
      file.buffer,
      `${S3Service.UPLOADS_PREFIX}${Date.now()}-${originalName}`,
      file.mimetype,
    );

    return { url };
  }

  async findBySlug(slug: string, lang: string) {
    const selectedLanguage = validateLanguage(lang);

    const architect = await this.prisma.architect.findUnique({
      where: {
        slug,
      },
    });

    if (!architect) {
      throw new NotFoundException('Arquiteto não encontrado.');
    }

    const buildings = await this.prisma.building.findMany({
      where: {
        architectId: architect.id,
      },
    });

    return {
      id: architect.id,
      slug: architect.slug,
      name: translateLocalizedValue(architect.name, selectedLanguage),
      media: translateLocalizedValue(architect.media, selectedLanguage),
      birth: translateLocalizedValue(architect.birth, selectedLanguage),
      death: architect.death ? translateLocalizedValue(architect.death, selectedLanguage) : null,
      citizenship: translateLocalizedValue(architect.citizenship, selectedLanguage),
      occupation: translateLocalizedValue(architect.occupation, selectedLanguage),
      about: translateLocalizedValue(architect.about, selectedLanguage),
      characteristics: translateLocalizedValue(architect.characteristics, selectedLanguage),
      notable_works: buildings.map((building) => building.id),
      updated_at: architect.updatedAt,
    };
  }

  private async ensureExists(id: string) {
    const architect = await this.prisma.architect.findUnique({ where: { id } });

    if (!architect) {
      throw new NotFoundException('Arquiteto não encontrado.');
    }

    return architect;
  }

  private buildName(
    dto: Pick<Partial<CreateArchitectDto>, 'firstName' | 'lastName' | 'fullName'>,
    current?: unknown,
  ): PersonNameValue {
    const previous = fromName(current);
    const first = dto.firstName !== undefined ? trim(dto.firstName) : previous.first;
    const last = dto.lastName !== undefined ? trim(dto.lastName) : previous.last;
    const full =
      dto.fullName !== undefined
        ? trim(dto.fullName)
        : previous.full || [first, last].filter(Boolean).join(' ');

    return {
      first,
      last,
      full: full || [first, last].filter(Boolean).join(' '),
    };
  }

  private buildMedia(
    dto: Pick<Partial<CreateArchitectDto>, 'portraitUrl' | 'portraitAlt'>,
    current?: unknown,
  ): ArchitectMediaValue {
    const previous = current as Partial<ArchitectMediaValue> | null | undefined;

    return {
      portrait_url:
        dto.portraitUrl !== undefined ? trim(dto.portraitUrl) : trim(previous?.portrait_url),
      alt_text:
        dto.portraitAlt !== undefined ? toI18n(dto.portraitAlt) : previous?.alt_text ?? toI18n(''),
    };
  }

  private buildDeath(
    dto: Pick<
      Partial<CreateArchitectDto>,
      'deathDay' | 'deathMonth' | 'deathYear' | 'deathCity' | 'deathCountry'
    >,
    current?: unknown,
  ): LifeEventValue | null {
    const previous = fromLifeEvent(current);
    const year = dto.deathYear ?? previous.year;

    if (!year) {
      return null;
    }

    return toLifeEvent(
      dto.deathDay ?? previous.day ?? 1,
      dto.deathMonth ?? previous.month ?? 1,
      year,
      dto.deathCity ?? previous.city ?? '',
      dto.deathCountry ?? previous.country ?? '',
    );
  }

  private buildCharacteristics(
    dto: Pick<Partial<CreateArchitectDto>, 'style' | 'influences' | 'legacy'>,
    current?: unknown,
  ): ArchitectCharacteristicsValue {
    const previous = current as Partial<ArchitectCharacteristicsValue> | null | undefined;

    return {
      style: dto.style !== undefined ? toI18n(dto.style) : previous?.style ?? toI18n(''),
      influences:
        dto.influences !== undefined
          ? toI18n(dto.influences)
          : previous?.influences ?? toI18n(''),
      legacy: dto.legacy !== undefined ? toI18n(dto.legacy) : previous?.legacy ?? toI18n(''),
    };
  }

  private portraitUrl(media: unknown): string {
    const record = media as Partial<ArchitectMediaValue> | null | undefined;
    return trim(record?.portrait_url);
  }

  private toAdminArchitect(architect: Record<string, unknown>, buildingsCount?: number) {
    const name = fromName(architect.name);
    const media = architect.media as Partial<ArchitectMediaValue> | null | undefined;
    const birth = fromLifeEvent(architect.birth);
    const death = fromLifeEvent(architect.death);
    const characteristics = architect.characteristics as
      | Partial<ArchitectCharacteristicsValue>
      | null
      | undefined;

    return {
      id: architect.id,
      slug: architect.slug,
      status: architect.status,
      firstName: name.first,
      lastName: name.last,
      fullName: name.full,
      portraitUrl: media?.portrait_url ?? '',
      portraitAlt: pickI18n(media?.alt_text),
      birthDay: birth.day,
      birthMonth: birth.month,
      birthYear: birth.year,
      birthCity: birth.city ?? '',
      birthCountry: birth.country ?? '',
      deathDay: death.day,
      deathMonth: death.month,
      deathYear: death.year,
      deathCity: death.city ?? '',
      deathCountry: death.country ?? '',
      citizenship: architect.citizenship,
      occupation: architect.occupation,
      about: pickI18n(architect.about),
      style: pickI18n(characteristics?.style),
      influences: pickI18n(characteristics?.influences),
      legacy: pickI18n(characteristics?.legacy),
      buildingsCount,
      createdAt: architect.createdAt,
      updatedAt: architect.updatedAt,
    };
  }

  private handleWriteError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Slug de arquiteto já cadastrado.');
    }

    throw error;
  }

  private async deleteUploadsFromS3(urls: string[]) {
    await Promise.all(
      [...new Set(urls)]
        .filter((url) => url.length > 0)
        .map((url) => this.s3Service.deleteUploadedFileByUrl(url)),
    );
  }
}
