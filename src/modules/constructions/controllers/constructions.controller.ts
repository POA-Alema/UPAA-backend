import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConstructionsService } from '../services/constructions.service';
import { CreateConstructionDto } from '../dto/create-construction.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('constructions')
@Controller('constructions')
export class ConstructionsController {
  constructor(private readonly constructionsService: ConstructionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as obras' })
  findAll() {
    return this.constructionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova obra' })
  create(@Body() createConstructionDto: CreateConstructionDto) {
    return this.constructionsService.create(createConstructionDto);
  }
}
