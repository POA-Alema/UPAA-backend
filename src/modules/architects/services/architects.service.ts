import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  SupportedLanguage,
  isSupportedLanguage,
  translateLocalizedValue,
} from '../../../common/i18n';

@Injectable()
export class ArchitectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const architects = await this.prisma.architect.findMany({
      orderBy: { createdAt: 'desc' },
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
    if (!isSupportedLanguage(lang)) {
      throw new BadRequestException('Idioma inválido. Use pt, en ou de.');
    }
  }

  private translateObject(value: unknown, lang: SupportedLanguage): unknown {
    return translateLocalizedValue(value, lang);
  }
}
