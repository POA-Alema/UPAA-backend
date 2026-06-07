import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArchitectsService } from '../services/architects.service';

@ApiTags('architects')
@Controller('architects')
export class ArchitectsController {
    constructor(private readonly architectsService: ArchitectsService) {}

    @Get(':slug')
    @ApiOperation({ summary: 'Buscar biografia de um arquiteto por slug' })
    findBySlug(@Param('slug') slug: string, @Query('lang') lang = 'pt') {
        return this.architectsService.findBySlug(slug, lang);
    }
}