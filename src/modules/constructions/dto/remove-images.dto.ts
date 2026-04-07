import { IsArray, IsString } from 'class-validator';

export class RemoveImagesDto {
  @IsString()
  category: string;

  @IsArray()
  images: string[];
}