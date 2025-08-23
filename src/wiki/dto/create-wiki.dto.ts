import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWikiDto {
  @ApiProperty({
    description: '위키 제목',
    example: '기숙사 생활 가이드',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '위키 내용',
    example: '기숙사 생활에 필요한 정보들을 정리한 위키입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
