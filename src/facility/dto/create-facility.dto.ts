import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateFacilityDto {
  @ApiProperty({
    description: '시설 이름',
    example: '체육관',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '시설 설명',
    example: '농구, 배드민턴 등을 할 수 있는 체육관입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '시설 이미지 URL',
    example: 'https://example.com/gym.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: '시설 위치',
    example: '학생회관 3층',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: '시설 이용 가능 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: '개방 시간',
    example: '2024-01-01T09:00:00Z',
  })
  @IsDateString()
  openTime: string;

  @ApiProperty({
    description: '폐장 시간',
    example: '2024-01-01T22:00:00Z',
  })
  @IsDateString()
  closeTime: string;
}
