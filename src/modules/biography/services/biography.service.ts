import { Injectable } from '@nestjs/common';

type BiographyLanguage = 'pt' | 'en' | 'de';

interface BiographyContent {
  nome: string;
  biografia: string;
}

export interface BiographyResponse {
  imagem: string;
  nome: string;
  biografia: string;
}

@Injectable()
export class BiographyService {
  private static readonly DEFAULT_LANGUAGE: BiographyLanguage = 'pt';

  private static readonly IMAGE_URL =
    'https://picsum.photos/seed/theodor-wiederspahn/600/800';

  private static readonly CONTENT: Record<BiographyLanguage, BiographyContent> = {
    pt: {
      nome: 'Theodor Wiederspahn',
      biografia: 'Frase da biografia do arquiteto',
    },
    en: {
      nome: 'Theodor Wiederspahn',
      biografia: 'Architect biography sentence',
    },
    de: {
      nome: 'Theodor Wiederspahn',
      biografia: 'Biografiesatz des Architekten',
    },
  };

  getBiography(lang?: string): BiographyResponse {
    const language = this.resolveLanguage(lang);
    const content = BiographyService.CONTENT[language];

    return {
      imagem: BiographyService.IMAGE_URL,
      nome: content.nome,
      biografia: content.biografia,
    };
  }

  private resolveLanguage(lang?: string): BiographyLanguage {
    if (lang === 'en' || lang === 'de' || lang === 'pt') {
      return lang;
    }

    return BiographyService.DEFAULT_LANGUAGE;
  }
}