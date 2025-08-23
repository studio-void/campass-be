import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UseFacilityDto {
  @ApiProperty({
    description: '시설 이용 시작 시간',
    example: '2024-01-01T14:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: '시설 이용 종료 시간',
    example: '2024-01-01T16:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
