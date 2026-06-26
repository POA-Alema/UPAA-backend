import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ARCHITECT_STATUSES = ['draft', 'published', 'archived'] as const;

export class CreateArchitectDto {
  @ApiPropertyOptional({
    description: 'Ignorado no cadastro administrativo. O slug é gerado pelo backend a partir de firstName + lastName.',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Status de publicação',
    enum: ARCHITECT_STATUSES,
    default: 'published',
  })
  @IsIn(ARCHITECT_STATUSES)
  @IsOptional()
  status?: (typeof ARCHITECT_STATUSES)[number];

  @ApiProperty({ description: 'Primeiro nome do arquiteto' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Sobrenome do arquiteto' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Nome completo para exibição' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ description: 'URL pública do retrato' })
  @IsString()
  portraitUrl: string;

  @ApiProperty({ description: 'Texto alternativo do retrato' })
  @IsString()
  portraitAlt: string;

  @ApiProperty({ description: 'Dia de nascimento' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  birthDay: number;

  @ApiProperty({ description: 'Mês de nascimento' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth: number;

  @ApiProperty({ description: 'Ano de nascimento' })
  @Type(() => Number)
  @IsInt()
  birthYear: number;

  @ApiProperty({ description: 'Cidade de nascimento' })
  @IsString()
  birthCity: string;

  @ApiProperty({ description: 'País de nascimento' })
  @IsString()
  birthCountry: string;

  @ApiPropertyOptional({ description: 'Dia de falecimento' })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  deathDay?: number | null;

  @ApiPropertyOptional({ description: 'Mês de falecimento' })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  deathMonth?: number | null;

  @ApiPropertyOptional({ description: 'Ano de falecimento. Envie null para remover.' })
  @IsInt()
  @IsOptional()
  deathYear?: number | null;

  @ApiPropertyOptional({ description: 'Cidade de falecimento' })
  @IsString()
  @IsOptional()
  deathCity?: string | null;

  @ApiPropertyOptional({ description: 'País de falecimento' })
  @IsString()
  @IsOptional()
  deathCountry?: string | null;

  @ApiProperty({ description: 'Nacionalidade' })
  @IsString()
  citizenship: string;

  @ApiProperty({ description: 'Ocupação' })
  @IsString()
  occupation: string;

  @ApiProperty({ description: 'Biografia / sobre o arquiteto (RichText / HTML)' })
  @IsString()
  about: string;

  @ApiProperty({ description: 'Descrição do estilo arquitetônico' })
  @IsString()
  style: string;

  @ApiProperty({ description: 'Influências arquitetônicas' })
  @IsString()
  influences: string;

  @ApiProperty({ description: 'Legado do arquiteto' })
  @IsString()
  legacy: string;
}
