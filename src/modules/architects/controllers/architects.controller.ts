import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArchitectsService } from '../services/architects.service';
import { CurrentAdmin } from '../../auth/decorators/current-admin.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminRole } from '../../auth/constants/admin-role';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthenticatedAdmin } from '../../auth/types/authenticated-admin';
import { CreateArchitectDto } from '../dto/create-architect.dto';
import { UpdateArchitectDto } from '../dto/update-architect.dto';

interface UploadedPortraitFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}

@ApiTags('architects')
@Controller('architects')
export class ArchitectsController {
    constructor(private readonly architectsService: ArchitectsService) {}

    @Get()
    @ApiOperation({ summary: 'Listar arquitetos (id, slug, nome) para seleção' })
    findAll() {
        return this.architectsService.findAll();
    }

    @Get('admin')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @ApiOperation({ summary: 'Listar arquitetos no painel administrativo' })
    findAllAdmin() {
        return this.architectsService.findAllAdmin();
    }

    @Get('admin/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @ApiOperation({ summary: 'Buscar arquiteto por ID no painel administrativo' })
    findOneAdmin(@Param('id') id: string) {
        return this.architectsService.findOneAdmin(id);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Buscar biografia de um arquiteto por slug' })
    @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de). Padrão: pt' })
    findBySlug(@Param('slug') slug: string, @Query('lang') lang = 'pt') {
        return this.architectsService.findBySlug(slug, lang);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @ApiOperation({ summary: 'Criar um arquiteto' })
    create(
        @Body() dto: CreateArchitectDto,
        @CurrentAdmin() currentAdmin: AuthenticatedAdmin,
    ) {
        return this.architectsService.create(dto, currentAdmin);
    }

    @Post('upload')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Enviar retrato de arquiteto para o S3' })
    uploadPortrait(@UploadedFile() file: UploadedPortraitFile) {
        return this.architectsService.uploadPortrait(file);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @ApiOperation({ summary: 'Editar um arquiteto' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateArchitectDto,
        @CurrentAdmin() currentAdmin: AuthenticatedAdmin,
    ) {
        return this.architectsService.update(id, dto, currentAdmin);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
    @ApiOperation({ summary: 'Remover um arquiteto' })
    remove(@Param('id') id: string) {
        return this.architectsService.remove(id);
    }
}
