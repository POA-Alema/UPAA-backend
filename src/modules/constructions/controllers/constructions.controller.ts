import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ConstructionsService } from '../services/constructions.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('constructions')
@Controller('constructions')
export class ConstructionsController {
  constructor(private readonly constructionsService: ConstructionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as obras' })
  findAll() {
    return this.constructionsService.findAll();
  }

  @Get('map')
  @ApiOperation({ summary: 'Listar edificações ativas para exibição no mapa' })
  @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de). Padrão: pt' })
  findAllForMap(@Query('lang') lang?: string) {
    return this.constructionsService.findAllForMap(lang);
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova obra' })
  create(@Body() createConstructionDto: CreateConstructionDto) {
    return this.constructionsService.create(createConstructionDto);
  }
}