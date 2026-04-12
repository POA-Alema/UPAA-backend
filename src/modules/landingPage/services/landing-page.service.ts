import { Injectable } from '@nestjs/common';
import { LandingPageDto } from '../dto/landing-page.dto';

@Injectable()
export class LandingPageService {
  private getMockData() {
    return {
      pt: {
        mainTitle: 'O Legado',
        subtitle: 'Explorando...',
      },
      en: {
        mainTitle: 'The Legacy',
        subtitle: 'Exploring...',
      },
      de: {
        mainTitle: 'Das Erbe',
        subtitle: 'Erkunden...',
      },
    };
  }

  find(lang: string = 'pt') {
    const data = this.getMockData();

    const normalizedLang = (lang || 'pt').toLowerCase();

    return data[normalizedLang] || data['pt'];
  }

  create(data: LandingPageDto) {
    return data;
  }
}
