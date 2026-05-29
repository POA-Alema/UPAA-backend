import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArchitectsService } from '../services/architects.service';

@ApiTags('architects')
@Controller('architects')
export class ArchitectsController {
    constructor(private readonly architectsService: ArchitectsService) {}

    @Get()
    @ApiOperation({ summary: 'Listar arquitetos (id, slug, nome) para seleção' })
    findAll() {
        return this.architectsService.findAll();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Buscar biografia de um arquiteto por slug' })
    @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de). Padrão: pt' })
    findBySlug(@Param('slug') slug: string, @Query('lang') lang = 'pt') {
        return this.architectsService.findBySlug(slug, lang);
    }
}