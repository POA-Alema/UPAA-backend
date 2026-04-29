import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ImmigrationSectionDto {
  @ApiProperty()
  @IsString()
  imageURL: string;

  @ApiProperty()
  @IsString()
  imgSubtitle: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}
