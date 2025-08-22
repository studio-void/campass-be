import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) {
  @ApiProperty({
    description: '보관 완료 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isStored?: boolean;
}
