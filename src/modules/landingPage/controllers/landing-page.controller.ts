import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LandingPageService } from '../services/landing-page.service';
import { UpsertLandingPageDto } from '../dto/upsert-landing-page.dto';

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
  @ApiResponse({ status: 200, description: 'Conteúdo da landing page' })
  getLandingPage() {
    return this.landingPageService.findPublic();
  }

  @Post()
  @ApiOperation({ summary: 'Cria um registro de landing page' })
  @ApiResponse({ status: 201, description: 'Landing page criada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() dto: UpsertLandingPageDto) {
    return this.landingPageService.create(dto, SEED_ADMIN_ID);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um registro de landing page pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do registro da landing page' })
  @ApiResponse({ status: 200, description: 'Landing page atualizada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Landing page não encontrada' })
  update(@Param('id') id: string, @Body() dto: UpsertLandingPageDto) {
    return this.landingPageService.update(id, dto, SEED_ADMIN_ID);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um registro de landing page pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do registro da landing page' })
  @ApiResponse({ status: 204, description: 'Landing page removida' })
  @ApiResponse({ status: 404, description: 'Landing page não encontrada' })
  remove(@Param('id') id: string) {
    return this.landingPageService.remove(id);
  }
}