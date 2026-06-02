import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

type SupportedLanguage = 'pt' | 'en' | 'de';

@Injectable()
export class ArchitectsService {
  private readonly supportedLanguages: SupportedLanguage[] = ['pt', 'en', 'de'];

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const architects = await this.prisma.architect.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, status: true, name: true },
    });

    return architects.map((architect) => {
      const nameObj = architect.name as { first?: string; last?: string; full?: string };
      return {
        id: architect.id,
        slug: architect.slug,
        status: architect.status,
        name: nameObj.full ?? `${nameObj.first ?? ''} ${nameObj.last ?? ''}`.trim(),
      };
    });
  }

  async findBySlug(slug: string, lang: string) {
    this.validateLanguage(lang);

    const selectedLanguage = lang as SupportedLanguage;

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
      name: this.translateObject(architect.name, selectedLanguage),
      media: this.translateObject(architect.media, selectedLanguage),
      birth: this.translateObject(architect.birth, selectedLanguage),
      death: architect.death ? this.translateObject(architect.death, selectedLanguage) : null,
      citizenship: this.translateObject(architect.citizenship, selectedLanguage),
      occupation: this.translateObject(architect.occupation, selectedLanguage),
      about: this.translateObject(architect.about, selectedLanguage),
      characteristics: this.translateObject(architect.characteristics, selectedLanguage),
      notable_works: buildings.map((building) => building.id),
      updated_at: architect.updatedAt,
    };
  }

  private validateLanguage(lang: string) {
    if (!this.supportedLanguages.includes(lang as SupportedLanguage)) {
      throw new BadRequestException('Idioma inválido. Use pt, en ou de.');
    }
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
