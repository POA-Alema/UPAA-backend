import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type SupportedLanguage = 'pt' | 'en' | 'de';

@Injectable()
export class ArchitectsService {
  private readonly supportedLanguages: SupportedLanguage[] = ['pt', 'en', 'de'];

  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string, lang: string = 'pt') {
    const selectedLanguage = this.validateLanguage(lang);

    const architect = await this.prisma.architect.findUnique({
      where: {
        slug,
      },
      include: {
        buildings: true,
      },
    });

    if (!architect) {
      throw new NotFoundException('Arquiteto não encontrado.');
    }

    return {
      id: architect.id,
      slug: architect.slug,
      name: this.translateObject(architect.name, selectedLanguage),
      media: this.translateObject(architect.media, selectedLanguage),
      birth: this.translateObject(architect.birth, selectedLanguage),
      death: architect.death ? this.translateObject(architect.death, selectedLanguage) : null,
      citizenship: this.translateObject(architect.citizenship, selectedLanguage),
      occupation: this.translateObject(architect.occupation, selectedLanguage),
      about: this.translateObject(architect.about, selectedLanguage),
      characteristics: this.translateObject(architect.characteristics, selectedLanguage),
      notable_works: architect.buildings.map((building) => building.id),
      updated_at: architect.updatedAt,
    };
  }

  private validateLanguage(lang: string): SupportedLanguage {
    const normalizedLanguage = lang.trim().toLowerCase();

    if (!this.supportedLanguages.includes(normalizedLanguage as SupportedLanguage)) {
      throw new BadRequestException('Idioma inválido. Use pt, en ou de.');
    }

    return normalizedLanguage as SupportedLanguage;
  }

  private translateObject(value: unknown, lang: SupportedLanguage): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.translateObject(item, lang));
    }

    if (this.isObject(value)) {
      if (this.isMultilingualField(value)) {
        return value[lang] ?? value.pt;
      }

      return Object.fromEntries(
        Object.entries(value).map(([key, fieldValue]) => [
          key,
          this.translateObject(fieldValue, lang),
        ]),
      );
    }

    return value;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isMultilingualField(value: Record<string, unknown>) {
    return this.supportedLanguages.some((language) => language in value);
  }
}
