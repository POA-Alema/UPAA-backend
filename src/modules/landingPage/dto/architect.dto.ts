import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CtaDto } from './cta.dto';
import { Type } from 'class-transformer';

export class ArchitectSectionDto{
  @ApiProperty()
  @IsString()
  imageURL: string;

  @ApiProperty()
  @IsString()
  imageSubtitle: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: CtaDto })
  @ValidateNested()
  @Type(() => CtaDto)
  CTA: CtaDto;

  @ApiProperty()
  @IsNumber()
  order: number;
}
