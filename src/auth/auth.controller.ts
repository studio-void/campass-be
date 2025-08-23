import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '사용자 인증 후 JWT 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공, JWT 토큰 반환',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 2,
          email: 'user@example.com',
          name: '김학생',
          isAdmin: false,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '비밀번호가 틀렸음' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBody({
    type: LoginDto,
    examples: {
      gist_admin: {
        summary: 'GIST 관리자 계정',
        value: {
          email: 'admin@gist.ac.kr',
          password: 'admin1234',
        },
      },
      gist_student: {
        summary: 'GIST 학생 계정',
        value: {
          email: 'park.student@gist.ac.kr',
          password: 'user1234',
        },
      },
    },
  })
  @HttpCode(200)
  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: 'JWT 토큰을 무효화합니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete('logout')
  logout() {
    return this.authService.logout();
  }
}
