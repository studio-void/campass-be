import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    example: '데이터베이스 시스템',
    description: '일정 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '데이터베이스 설계 및 구현 수업',
    description: '일정 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'GIST 대학원 1동 101호',
    description: '장소',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: '2024-01-01T09:00:00.000Z',
    description: '시작 날짜 및 시간',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2024-01-01T10:30:00.000Z',
    description: '종료 날짜 및 시간',
  })
  @IsDateString()
  endTime: string;
}
