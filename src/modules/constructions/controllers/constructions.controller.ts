import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ConstructionsService } from '../services/constructions.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';
import { UpdateConstructionDto } from '../dto/update-construction.dto';
import { RemoveImagesDto } from '../dto/remove-images.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('constructions')
@Controller('constructions')
export class ConstructionsController {
  constructor(private readonly constructionsService: ConstructionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as edificações' })
  findAll() {
    return this.constructionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar uma edificação por ID' })
  findOne(@Param('id') id: string) {
    return this.constructionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova edificação' })
  create(@Body() createConstructionDto: CreateConstructionDto) {
    return this.constructionsService.create(createConstructionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar uma edificação' })
  update(@Param('id') id: string, @Body() updateConstructionDto: UpdateConstructionDto) {
    return this.constructionsService.update(id, updateConstructionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma edificação' })
  remove(@Param('id') id: string) {
    return this.constructionsService.remove(id);
  }

  @Post(':id/remove-images')
  @ApiOperation({ summary: 'Remover imagens individualmente por categoria' })
  removeImages(@Param('id') id: string, @Body() removeImagesDto: RemoveImagesDto) {
    return this.constructionsService.removeImages(id, removeImagesDto);
  }
}
