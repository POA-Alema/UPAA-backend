import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';

const SUPPORTED_LANGS = ['pt', 'en', 'de'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG: Lang = 'pt';

function resolveLang(lang?: string): Lang {
  return SUPPORTED_LANGS.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG;
}

function resolveField(i18nField: unknown, fallback: string, lang: Lang): string {
  if (i18nField && typeof i18nField === 'object') {
    const map = i18nField as Record<string, string>;
    return map[lang] ?? map[DEFAULT_LANG] ?? fallback;
  }
  return fallback;
}

@Injectable()
export class ConstructionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.construction.findMany();
  }

  async findAllForMap(lang?: string) {
    const constructions = await this.prisma.construction.findMany();

    return constructions.map((c) => ({
      id: c.id,
      nome: c.title,
      localizacao:
        c.latitude !== 0 && c.longitude !== 0
          ? { latitude: c.latitude, longitude: c.longitude, address: c.address ?? null }
          : null,
    }));
  }

  create(data: CreateConstructionDto) {
    return this.prisma.construction.create({ data });
  }
}
