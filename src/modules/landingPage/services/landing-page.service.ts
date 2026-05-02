import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LandingPageService {
  private readonly langs = ['pt', 'en', 'de'];

  constructor(private prisma: PrismaService) {}

  async findAll(lang: string) {
    if (!this.langs.includes(lang)) {
      throw new BadRequestException('Idioma inválido.');
    }

    const landingPage = await this.prisma.landingPage.findFirst();

    if (!landingPage) {
      throw new NotFoundException('Dados da landing page não encontrado.');
    }

    return {
      id: landingPage.id,
      mainTitle: this.translate(landingPage.mainTitle, lang),
      subtitle: this.translate(landingPage.subtitle, lang),
      architectSection: this.translate(landingPage.architectSection, lang),
      immigrationSection: this.translate(landingPage.immigrationSection, lang),
      institutionsSection: this.translate(landingPage.institutionsSection, lang),
      updated_at: landingPage.updatedAt,
    };
  }

  private translate(value: any, lang: string): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.translate(item, lang));
    }

    if (value && typeof value === 'object') {
      if (this.langs.some((key) => key in value)) {
        return value[lang] ?? value.pt;
      }

      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, this.translate(item, lang)]),
      );
    }

    return value;
  }
}
