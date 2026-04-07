import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConstructionDto {
  @IsString()
  title: string;

  @IsOptional() @IsString()
  location?: string;

  @IsOptional() @IsString()
  date?: string;

  @IsOptional() @IsString()
  project?: string;

  @IsOptional() @IsString()
  construction?: string;

  @IsOptional() @IsString()
  ornaments?: string;

  @IsOptional() @IsString()
  builtArea?: string;

  @IsOptional() @IsString()
  currentOccupation?: string;

  @IsOptional() @IsString()
  restorationProject?: string;

  @IsOptional() @IsString()
  heritageListing?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  author?: string;

  @IsOptional() @IsArray()
  sources?: string[];

  @IsOptional() @IsArray()
  floorPlans?: string[];

  @IsOptional() @IsArray()
  facades?: string[];

  @IsOptional() @IsArray()
  externalPhotos?: string[];

  @IsOptional() @IsArray()
  internalPhotos?: string[];
}
