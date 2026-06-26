import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LandingPageService } from '../services/landing-page.service';
import { UpsertLandingPageDto } from '../dto/upsert-landing-page.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminRole } from '../../auth/constants/admin-role';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

const SEED_ADMIN_ID = '000000000000000000000000';

@ApiTags('landing-page')
@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna o conteúdo público da landing page',
    description:
      'Inclui immigrationSection. Retorna null se não houver ou se estiver inválida.',
  })
  @ApiQuery({ name: 'lang', required: false, description: 'Idioma (pt, en, de) ou all para edição. Padrão: pt' })
  @ApiResponse({ status: 200, description: 'Conteúdo da landing page' })
  getLandingPage(@Query('lang') lang = 'pt') {
    return this.landingPageService.findPublic(lang);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  @ApiOperation({ summary: 'Cria um registro de landing page' })
  @ApiResponse({ status: 201, description: 'Landing page criada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: UpsertLandingPageDto) {
    return this.landingPageService.create(dto, SEED_ADMIN_ID);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  @ApiOperation({ summary: 'Atualiza um registro de landing page pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do registro da landing page' })
  @ApiResponse({ status: 200, description: 'Landing page atualizada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Landing page não encontrada' })
  update(@Param('id') id: string, @Body() dto: UpsertLandingPageDto) {
    return this.landingPageService.update(id, dto, SEED_ADMIN_ID);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um registro de landing page pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do registro da landing page' })
  @ApiResponse({ status: 204, description: 'Landing page removida' })
  @ApiResponse({ status: 404, description: 'Landing page não encontrada' })
  remove(@Param('id') id: string) {
    return this.landingPageService.remove(id);
  }
}
