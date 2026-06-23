import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AdminRole } from '../constants/admin-role';

export class RegisterDto {
  @ApiProperty({ example: 'Administrador Principal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'admin@poaalema.com' })
  @IsEmail()
  @MaxLength(160)
  email: string;

  @ApiProperty({ minLength: 6, example: 'admin123' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.CONTENT_MANAGER })
  @IsEnum(AdminRole)
  role: AdminRole;
}
