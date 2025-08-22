import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateCheckDto } from './create-check.dto';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {
  @ApiProperty({
    description: '점검 상태',
    enum: ['PASS', 'FIRST_CHECK', 'SECOND_CHECK', 'THIRD_CHECK', 'FAIL'],
    example: 'PASS',
    required: false,
  })
  @IsEnum(['PASS', 'FIRST_CHECK', 'SECOND_CHECK', 'THIRD_CHECK', 'FAIL'])
  @IsOptional()
  status?: 'PASS' | 'FIRST_CHECK' | 'SECOND_CHECK' | 'THIRD_CHECK' | 'FAIL';
}
