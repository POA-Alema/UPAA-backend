import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as edificações' })
  findAll() {
    return this.buildingsService.findAll();
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
