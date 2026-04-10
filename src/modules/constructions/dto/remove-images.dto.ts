import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveImagesDto {
  @ApiProperty({ description: 'Categoria da imagem (ex: floorPlans, facades, externalPhotos, internalPhotos)' })
  @IsString()
  category: string;

  @ApiProperty({ type: [String], description: 'Lista de URLs das imagens a serem removidas' })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
