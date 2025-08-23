import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: '노트 제목',
    example: '실험 결과 정리',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '노트 내용',
    example: '오늘 실험에서 얻은 결과를 정리한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
