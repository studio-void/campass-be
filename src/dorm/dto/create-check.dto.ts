import { ApiProperty } from '@nestjs/swagger';
import { CheckRequestType } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateCheckDto {
  @ApiProperty({
    description: '기숙사 호실',
    example: 'A동 101호',
  })
  @IsString()
  @IsNotEmpty()
  dorm: string;

  @ApiProperty({
    description: '점검 노트',
    example: '누수 발견',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: '점검 유형',
    enum: CheckRequestType,
    example: 'SINGLE_EXIT',
  })
  @IsEnum(CheckRequestType)
  type: CheckRequestType;

  @ApiProperty({
    description: '점검 예정 시간',
    example: '2024-01-01T10:00:00Z',
  })
  @IsDateString()
  checkAt: string;
}
