import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CtaDto{
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  target: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  icon?: string;
}
