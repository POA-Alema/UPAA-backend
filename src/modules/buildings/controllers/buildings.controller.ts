import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as edificações' })
  findAll() {
    return this.buildingsService.findAll();
  }

  @Get('map')
  @ApiOperation({ summary: 'Listar edificações publicadas para exibição no mapa' })
  @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de). Padrão: pt' })
  findAllForMap(@Query('lang') lang?: string) {
    return this.buildingsService.findAllForMap(lang);
  }

  @Get('map/config')
  @ApiOperation({ summary: 'Buscar configuração inicial do mapa' })
  getInitialMapConfig() {
    return this.buildingsService.getInitialMapConfig();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar uma edificação por ID' })
  findOne(@Param('id') id: string) {
    return this.buildingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova edificação' })
  create(@Body() createBuildingDto: CreateBuildingDto) {
    return this.buildingsService.create(createBuildingDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar uma edificação' })
  update(@Param('id') id: string, @Body() updateBuildingDto: UpdateBuildingDto) {
    return this.buildingsService.update(id, updateBuildingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma edificação' })
  remove(@Param('id') id: string) {
    return this.buildingsService.remove(id);
  }

}
