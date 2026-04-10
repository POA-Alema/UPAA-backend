import { Controller, Get, Query } from '@nestjs/common';
import {
  BiographyResponse,
  BiographyService,
} from '../services/biography.service';

@Controller('biografia')
export class BiographyController {
  constructor(private readonly biographyService: BiographyService) {}

  @Get()
  getBiography(@Query('lang') lang?: string): BiographyResponse {
    return this.biographyService.getBiography(lang);
  }
}