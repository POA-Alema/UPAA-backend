import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LandingPageService } from '../services/landing-page.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LandingPageDto } from '../dto/landing-page.dto';

@ApiTags('landingPage')
@Controller('landingPage')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar conteúdo da landing page' })
  @Get()
  find(@Query('lang') lang: string) {
    return this.landingPageService.find(lang);
  }

  @Post()
  @ApiOperation({ summary: 'Criar/atualizar conteúdo da landing page' })
  create(@Body() dto: LandingPageDto) {
    return this.landingPageService.create(dto);
  }
}
