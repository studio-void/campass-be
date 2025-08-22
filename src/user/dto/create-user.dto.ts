import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsUrl,
} from 'class-validator';

export enum VerifyStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address (must be unique)',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    maxLength: 32,
    description: 'User password (8~32 characters)',
    type: String,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User real name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'nickname',
    description: 'User nickname (display name)',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    example: '010-1234-5678',
    description: 'Phone number',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  tel: string;

  @ApiProperty({
    example: 'GIST',
    description: 'School name (any school is supported)',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  school: string;

  @ApiProperty({
    example: '20231234',
    description: 'Student number (ID, 8~10 digits, must be unique)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(10)
  number?: string;

  @ApiProperty({
    example: false,
    type: Boolean,
    description: 'Is admin user',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin: boolean = false;

  @ApiProperty({
    example: 'NONE',
    enum: ['NONE', 'PENDING', 'VERIFIED'],
    description: 'Verification status',
    required: false,
    default: 'NONE',
  })
  @IsOptional()
  @IsEnum(VerifyStatus)
  verifyStatus: VerifyStatus = VerifyStatus.NONE;

  @ApiProperty({
    example: 'https://example.com/verify-images/student-card.jpg',
    description:
      'URL of verification image (student ID card, enrollment certificate, etc.)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  verifyImageUrl?: string;
}
