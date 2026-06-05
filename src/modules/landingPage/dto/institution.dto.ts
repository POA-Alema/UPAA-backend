import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CtaDto } from './cta.dto';

class InstitutionItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: CtaDto })
  @ValidateNested()
  @Type(() => CtaDto)
  CTA: CtaDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class InstitutionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [InstitutionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstitutionItemDto)
  institutions: InstitutionItemDto[];
}
