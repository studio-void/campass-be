import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateCheckDto } from './create-check.dto';
import { CheckRequestStatus } from '@prisma/client';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {
  @ApiProperty({
    description: '점검 상태',
    enum: CheckRequestStatus,
    example: 'PASS',
    required: true,
  })
  @IsEnum(CheckRequestStatus)
  status: CheckRequestStatus;
}
