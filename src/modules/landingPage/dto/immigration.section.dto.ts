import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MultilingualTextDto } from './multilingual-text.dto';

export class ImmigrationSectionDto {
  @ApiPropertyOptional({ description: 'URL da imagem da seção' })
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional({ description: 'Título multilíngue da seção' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title?: MultilingualTextDto;

  @ApiPropertyOptional({ description: 'Conteúdo multilíngue da seção (RichText)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  content?: MultilingualTextDto;
}
