import { IsString, IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @ApiProperty({ description: 'Longitude' })
  lng: number;
}

export class CreateBuildingDto {
  @ApiProperty({ description: 'Título da edificação' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição da edificação (RichText / HTML)' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Autor / responsável pela edificação' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Lista de URLs das imagens da edificação',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: 'Slug único (URL-friendly)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Chave do QR Code (única)' })
  @IsString()
  qrCodeKey: string;

  @ApiProperty({ description: 'ID do arquiteto (ObjectId)' })
  @IsString()
  architectId: string;

  @ApiProperty({ description: 'Endereço / localização da edificação' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Coordenadas geográficas { lat, lng }', type: CoordinatesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ description: 'Período de construção' })
  @IsString()
  constructionPeriod: string;

  @ApiProperty({ description: 'Histórico da edificação (RichText / HTML)' })
  @IsString()
  history: string;

  @ApiProperty({ description: 'ID do admin que criou (ObjectId)' })
  @IsString()
  createdById: string;

  @ApiProperty({ description: 'ID do admin que atualizou (ObjectId)' })
  @IsString()
  updatedById: string;

  @ApiPropertyOptional({ description: 'Nome histórico / original da edificação' })
  @IsString()
  @IsOptional()
  originalName?: string;

  @ApiPropertyOptional({ description: 'Autor dos ornamentos' })
  @IsString()
  @IsOptional()
  ornamentsAuthor?: string;

  @ApiPropertyOptional({ description: 'Área construída' })
  @IsString()
  @IsOptional()
  builtArea?: string;

  @ApiPropertyOptional({ description: 'Ocupação atual' })
  @IsString()
  @IsOptional()
  currentOccupation?: string;

  @ApiPropertyOptional({ description: 'Restauração e patrimônio' })
  @IsString()
  @IsOptional()
  restorationAndHeritage?: string;

  @ApiPropertyOptional({ type: [String], description: 'Lista de fontes / bibliografia' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sources?: string[];

  @ApiPropertyOptional({
    type: 'array',
    description: 'Características da edificação (array de { title, description, icon_url })',
  })
  @IsArray()
  @IsOptional()
  features?: Record<string, unknown>[];
}
