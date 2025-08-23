import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description:
      'User email (try: admin@example.com, user@example.com, user2@example.com)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'user1234',
    minLength: 8,
    maxLength: 32,
    description: 'Password (admin: admin1234, users: user1234)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
