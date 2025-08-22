import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    example: 'https://example.com/verify-images/student-card.jpg',
    description: '인증용 이미지 URL (학생증, 재학증명서, 합격증명서 등)',
    type: String,
  })
  @IsNotEmpty()
  @IsUrl()
  verifyImageUrl: string;
}
