import { PartialType } from '@nestjs/swagger';
import { CreateWikiDto } from './create-wiki.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWikiDto extends PartialType(CreateWikiDto) {
  @ApiProperty({
    description: '수정 코멘트',
    example: '오타 수정 및 내용 보완',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
