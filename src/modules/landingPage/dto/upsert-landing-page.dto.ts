import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ImmigrationSectionDto } from './immigration-section.dto';

export class UpsertLandingPageDto {
  @ApiPropertyOptional({ description: 'Seção de imigração alemã' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImmigrationSectionDto)
  immigrationSection?: ImmigrationSectionDto;

  [key: string]: unknown;
}