import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MultilingualTextDto {
  @ApiProperty({ description: 'Texto em português (obrigatório)' })
  @IsString()
  pt: string;

  @ApiPropertyOptional({ description: 'Texto em inglês' })
  @IsOptional()
  @IsString()
  en?: string;

  @ApiPropertyOptional({ description: 'Texto em alemão' })
  @IsOptional()
  @IsString()
  de?: string;
}