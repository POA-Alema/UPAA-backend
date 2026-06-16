import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { S3Service } from 'src/Utils/S3.service';
import { FilesInterceptor } from '@nestjs/platform-express';

export class UploadMetadataDto {
  type: string;
  indexes: number[];
}

interface UploadedImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@ApiTags('buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService,
              private readonly s3Service: S3Service
  ) {}
  

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

  @Get(':slug')
  @ApiOperation({ summary: 'Consultar uma edificação por slug' })
  @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de). Padrão: pt' })
  findOne(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.buildingsService.findOne(slug, lang);
  }


  @Post()
  @ApiOperation({ summary: 'Criar uma nova edificação' })
  create(@Body() createBuildingDto: CreateBuildingDto) {
    return this.buildingsService.create(createBuildingDto);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: UploadedImageFile[],
    @Body('metadata') metadata: string,
  ) {
    const parsed = JSON.parse(metadata);
    const result = [];

    for (const group of parsed) {
      const urls = await Promise.all(
        group.indexes.map(async (index: number) => {
          const file = files[index];
          // Multer decodifica o filename como latin1; reinterpreta como UTF-8
          // para que acentos sobrevivam à sanitização da key no S3.
          const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

          return this.s3Service.uploadFile(
            file.buffer,
            `${S3Service.UPLOADS_PREFIX}${Date.now()}-${originalName}`,
            file.mimetype,
          );
        }),
      );
      
      result.push({
        type: group.type,
        urls,
      });
    }

    return result;
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
