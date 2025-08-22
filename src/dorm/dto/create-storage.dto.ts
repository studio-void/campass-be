import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateStorageDto {
  @ApiProperty({
    description: '보관소 위치',
    example: '지하 보관창고',
  })
  @IsString()
  @IsNotEmpty()
  storage: string;

  @ApiProperty({
    description: '보관할 물품',
    example: '겨울 이불, 코트',
  })
  @IsString()
  @IsNotEmpty()
  items: string;

  @ApiProperty({
    description: '보관 예정 시간',
    example: '2024-01-01T14:00:00Z',
  })
  @IsDateString()
  storeAt: string;
}
