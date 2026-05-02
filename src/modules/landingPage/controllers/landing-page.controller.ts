import { Controller, Get, Query } from '@nestjs/common';
import { LandingPageService } from '../services/landing-page.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('landingPage')
@Controller('landingPage')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @ApiOperation({ summary: 'Buscar conteúdo da landing page' })
  @ApiQuery({
    name: 'lang',
    required: true,
    enum: ['pt', 'en', 'de'],
    description: 'Idioma do conteúdo da landing page',
  })
  @Get()
  findAll(@Query('lang') lang: string) {
    return this.landingPageService.findAll(lang);
  }
}
