import { IsString, IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @ApiProperty({ description: 'Latitude' })
  lat: number;

  @ApiProperty({ description: 'Longitude' })
  lng: number;
}


export class BuildingImageDto {
  @ApiProperty({ description: 'URL pública da imagem (ex: retornada pelo upload no S3)' })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Categoria da imagem',
    enum: ['planta_baixa', 'fachada', 'externa', 'interna'],
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Legenda da imagem' })
  @IsString()
  @IsOptional()
  caption?: string;
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
    type: [BuildingImageDto],
    description: 'Imagens da edificação, categorizadas por tipo (planta_baixa, fachada, externa, interna)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuildingImageDto)
  @IsOptional()
  images?: BuildingImageDto[];

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

  @ApiPropertyOptional({
    description: 'ID do admin que criou (ObjectId). Se omitido, usa o admin padrão (seed).',
  })
  @IsString()
  @IsOptional()
  createdById?: string;

  @ApiPropertyOptional({
    description: 'ID do admin que atualizou (ObjectId). Se omitido, usa o admin padrão (seed).',
  })
  @IsString()
  @IsOptional()
  updatedById?: string;

  @ApiPropertyOptional({ description: 'Nome histórico / original da edificação' })
  @IsString()
  @IsOptional()
  originalName?: string;

  @ApiPropertyOptional({ description: 'Autor dos ornamentos' })
  @IsString()
  @IsOptional()
  ornamentsAuthor?: string;

  @ApiPropertyOptional({ description: 'Ýrea construída' })
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
