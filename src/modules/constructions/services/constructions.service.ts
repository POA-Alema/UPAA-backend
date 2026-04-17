import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';

type SupportedLanguage = 'pt' | 'en' | 'de';

type EdificacaoResponse = {
  nome: string;
  endereco?: string | null;
  conteudo?: string | null;
  midias?: string[] | null;
};

@Injectable()
export class ConstructionsService {
  constructor(private prisma: PrismaService) {}

  private readonly supportedLanguages: SupportedLanguage[] = ['pt', 'en', 'de'];

  findAll() {
    return this.prisma.construction.findMany();
  }

  create(data: CreateConstructionDto) {
    return this.prisma.construction.create({ data });
  }

  async findEdificacaoById(id: string, lang?: string): Promise<EdificacaoResponse> {
    let construction: Awaited<ReturnType<typeof this.prisma.construction.findUnique>>;

    try {
      construction = await this.prisma.construction.findUnique({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Edificacao nao encontrada');
    }

    if (!construction) {
      throw new NotFoundException('Edificacao nao encontrada');
    }

    const selectedLanguage = this.getLanguageWithFallback(lang);

    return {
      nome: this.resolveLocalizedString(
        construction as Record<string, unknown>,
        ['nome', 'name', 'title'],
        selectedLanguage,
      ) || construction.title,
      endereco: this.resolveLocalizedString(
        construction as Record<string, unknown>,
        ['endereco', 'address'],
        selectedLanguage,
      ),
      conteudo: this.resolveLocalizedString(
        construction as Record<string, unknown>,
        ['conteudo', 'content', 'description'],
        selectedLanguage,
      ),
      midias: this.resolveLocalizedMedia(
        construction as Record<string, unknown>,
        ['midias', 'media', 'images'],
        selectedLanguage,
      ),
    };
  }

  private getLanguageWithFallback(lang?: string): SupportedLanguage {
    if (lang && this.supportedLanguages.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage;
    }

    return 'pt';
  }

  private resolveLocalizedString(
    source: Record<string, unknown>,
    keys: string[],
    lang: SupportedLanguage,
  ): string | null {
    for (const key of keys) {
      const directValue = source[key];
      const suffixValue = source[`${key}_${lang}`];
      const fallbackSuffixValue = source[`${key}_pt`];

      const resolvedFromDirect = this.extractStringByLanguage(directValue, lang);
      if (resolvedFromDirect) {
        return resolvedFromDirect;
      }

      if (typeof suffixValue === 'string' && suffixValue.length > 0) {
        return suffixValue;
      }

      if (typeof fallbackSuffixValue === 'string' && fallbackSuffixValue.length > 0) {
        return fallbackSuffixValue;
      }
    }

    return null;
  }

  private resolveLocalizedMedia(
    source: Record<string, unknown>,
    keys: string[],
    lang: SupportedLanguage,
  ): string[] | null {
    for (const key of keys) {
      const directValue = source[key];
      const suffixValue = source[`${key}_${lang}`];
      const fallbackSuffixValue = source[`${key}_pt`];

      const resolvedFromDirect = this.extractArrayByLanguage(directValue, lang);
      if (resolvedFromDirect) {
        return resolvedFromDirect;
      }

      if (this.isStringArray(suffixValue)) {
        return suffixValue;
      }

      if (this.isStringArray(fallbackSuffixValue)) {
        return fallbackSuffixValue;
      }
    }

    return null;
  }

  private extractStringByLanguage(value: unknown, lang: SupportedLanguage): string | null {
    if (typeof value === 'string') {
      return value.length > 0 ? value : null;
    }

    if (value && typeof value === 'object') {
      const localized = value as Record<string, unknown>;
      const selected = localized[lang];
      const fallback = localized.pt;

      if (typeof selected === 'string' && selected.length > 0) {
        return selected;
      }

      if (typeof fallback === 'string' && fallback.length > 0) {
        return fallback;
      }
    }

    return null;
  }

  private extractArrayByLanguage(value: unknown, lang: SupportedLanguage): string[] | null {
    if (this.isStringArray(value)) {
      return value;
    }

    if (value && typeof value === 'object') {
      const localized = value as Record<string, unknown>;
      const selected = localized[lang];
      const fallback = localized.pt;

      if (this.isStringArray(selected)) {
        return selected;
      }

      if (this.isStringArray(fallback)) {
        return fallback;
      }
    }

    return null;
  }

  private isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }
}
