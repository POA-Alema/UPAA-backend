import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConstructionsService } from '../services/constructions.service';

@ApiTags('edificacao')
@Controller('edificacao')
export class EdificacaoController {
  constructor(private readonly constructionsService: ConstructionsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar dados completos de uma edificacao por id' })
  @ApiParam({ name: 'id', description: 'ID da edificacao' })
  @ApiQuery({
    name: 'lang',
    required: false,
    enum: ['pt', 'en', 'de'],
    description: 'Idioma de retorno com fallback para pt',
  })
  findById(
    @Param('id') id: string,
    @Query('lang') lang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const resolvedLang = lang || acceptLanguage?.split(',')[0]?.trim().slice(0, 2);

    return this.constructionsService.findEdificacaoById(id, resolvedLang);
  }
}