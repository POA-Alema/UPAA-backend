import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CtaDto } from './cta.dto';


class InstitutionItemDto {
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
