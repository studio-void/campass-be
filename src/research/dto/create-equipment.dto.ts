import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({
    description: '장비 이름',
    example: '현미경',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '장비 설명',
    example: '연구용 고성능 현미경입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '장비 이미지 URL',
    example: 'https://example.com/microscope.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: '장비 이용 가능 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
