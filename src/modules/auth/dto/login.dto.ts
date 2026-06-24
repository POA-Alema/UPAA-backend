import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@poaalema.com' })
  @IsEmail()
  @MaxLength(160)
  email: string;

  @ApiProperty({ minLength: 6, example: 'admin123' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
