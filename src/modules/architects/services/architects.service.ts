import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  validateLanguage,
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
}
