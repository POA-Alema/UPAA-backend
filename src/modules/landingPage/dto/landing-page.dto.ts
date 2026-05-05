import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { ArchitectSectionDto } from './architect.dto';
import { Type } from 'class-transformer';
import { ImmigrationSectionDto } from './immigration.section.dto';
import { InstitutionDto } from './institution.dto';

export class LandingPageDto {
  @ApiProperty()
  @IsString()
  mainTitle: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty({ type: ArchitectSectionDto })
  @ValidateNested()
  @Type(() => ArchitectSectionDto)
  architectSection: ArchitectSectionDto;

  @ApiProperty({ type: ImmigrationSectionDto })
  @ValidateNested()
  @Type(() => ImmigrationSectionDto)
  immigrationSection: ImmigrationSectionDto;

  @ApiProperty({ type: InstitutionDto })
  @ValidateNested()
  @Type(() => InstitutionDto)
  institutionsSection: InstitutionDto;
}
