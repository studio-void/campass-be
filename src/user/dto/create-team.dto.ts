import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: '팀', description: '팀 이름' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: '팀 멤버의 사용자 ID 배열',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  memberIds: number[];
}
