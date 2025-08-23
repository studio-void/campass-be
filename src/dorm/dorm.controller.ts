import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DormService } from './dorm.service';
import { UserId } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@ApiTags('Dormitory')
@Controller('dorm')
export class DormController {
  constructor(private readonly dormService: DormService) {}

  @ApiOperation({
    summary: '기숙사 검사 요청 목록 조회 (관리자)',
    description: '모든 기숙사 검사 요청을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검사 요청 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          userId: 2,
          dorm: 'A동 101호',
          notes: '퇴사 검사',
          type: 'DOUBLE_EXIT',
          status: 'FIRST_CHECK',
          checkAt: '2024-01-20T10:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('check')
  async readAllCheck(@UserId() userId: number) {
    return await this.dormService.readAllCheck(userId);
  }

  @ApiOperation({
    summary: '기숙사 검사 요청 상세 조회 (관리자)',
    description: 'ID로 특정 기숙사 검사 요청을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검사 요청 조회 성공',
    schema: {
      example: {
        id: 1,
        userId: 2,
        dorm: 'A동 101호',
        notes: '퇴사 검사',
        type: 'DOUBLE_EXIT',
        status: 'FIRST_CHECK',
        checkAt: '2024-01-20T10:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        user: {
          id: 2,
          name: '김학생',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '검사 요청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('check/:id')
  async readCheckById(@UserId() userId: number, @Param('id') id: number) {
    return await this.dormService.readCheckById(userId, id);
  }

  @ApiOperation({
    summary: '기숙사 검사 요청 생성',
    description: '새로운 기숙사 검사 요청을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '검사 요청 생성 성공',
    schema: {
      example: {
        id: 3,
        userId: 2,
        dorm: 'C동 301호',
        notes: '퇴사 검사',
        type: 'DOUBLE_EXIT',
        status: 'FIRST_CHECK',
        checkAt: '2024-01-25T14:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('check')
  async createCheck(
    @UserId() userId: number,
    @Body() createCheckDto: CreateCheckDto,
  ) {
    return await this.dormService.createCheck(userId, createCheckDto);
  }

  @ApiOperation({
    summary: '기숙사 검사 요청 수정 (관리자)',
    description: '관리자가 기숙사 검사 요청의 상태를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검사 요청 수정 성공',
    schema: {
      example: {
        status: 'PASS',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '검사 요청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('check/:id')
  async updateCheck(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateCheckDto: UpdateCheckDto,
  ) {
    return await this.dormService.updateCheck(userId, id, updateCheckDto);
  }

  @ApiOperation({
    summary: '기숙사 검사 요청 삭제',
    description: '기숙사 검사 요청을 삭제합니다. (본인 요청만 삭제 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '검사 요청 삭제 성공',
    schema: {
      example: {
        id: 1,
        userId: 2,
        dorm: 'A동 101호',
        notes: '퇴사 검사',
        type: 'DOUBLE_EXIT',
        status: 'FIRST_CHECK',
        checkAt: '2024-01-20T10:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (본인 요청만 삭제 가능)',
  })
  @ApiResponse({ status: 404, description: '검사 요청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('check/:id')
  async deleteCheck(@UserId() userId: number, @Param('id') id: number) {
    return await this.dormService.deleteCheck(userId, id);
  }

  @ApiOperation({
    summary: '기숙사 창고 보관 신청 목록 조회 (관리자)',
    description: '모든 기숙사 창고 보관 신청을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '창고 보관 신청 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          userId: 2,
          storage: 'A동 지하 보관창고',
          items: '겨울 이불, 코트',
          isStored: false,
          storeAt: '2024-01-25T14:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('storage')
  async readAllStorage(@UserId() userId: number) {
    return await this.dormService.readAllStorage(userId);
  }

  @ApiOperation({
    summary: '기숙사 창고 보관 신청 상세 조회 (관리자)',
    description: 'ID로 특정 기숙사 창고 보관 신청을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '창고 보관 신청 조회 성공',
    schema: {
      example: {
        id: 1,
        userId: 2,
        storage: 'A동 지하 보관창고',
        items: '겨울 이불, 코트',
        isStored: true,
        storeAt: '2024-01-25T14:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-25T14:00:00.000Z',
        user: {
          id: 2,
          name: '김학생',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '보관 신청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('storage/:id')
  async readStorageById(@UserId() userId: number, @Param('id') id: number) {
    return await this.dormService.readStorageById(userId, id);
  }

  @ApiOperation({
    summary: '기숙사 창고 보관 신청 생성',
    description: '새로운 기숙사 창고 보관 신청을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '창고 보관 신청 생성 성공',
    schema: {
      example: {
        id: 3,
        userId: 3,
        storage: '개인 사물함 B동',
        items: '여름 옷, 신발',
        isStored: false,
        storeAt: '2024-02-01T10:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('storage')
  async createStorage(
    @UserId() userId: number,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    return await this.dormService.createStorage(userId, createStorageDto);
  }

  @ApiOperation({
    summary: '기숙사 창고 보관 신청 수정 (관리자)',
    description: '관리자가 기숙사 창고 보관 신청의 상태를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '창고 보관 신청 수정 성공',
    schema: {
      example: {
        id: 1,
        userId: 2,
        storage: 'A동 지하 보관창고',
        items: '겨울 이불, 코트',
        isStored: true,
        storeAt: '2024-01-25T14:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-25T14:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '보관 신청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('storage/:id')
  async updateStorage(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    return await this.dormService.updateStorage(userId, id, updateStorageDto);
  }

  @ApiOperation({
    summary: '기숙사 창고 보관 신청 삭제',
    description: '기숙사 창고 보관 신청을 삭제합니다. (본인 신청만 삭제 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '창고 보관 신청 삭제 성공',
    schema: {
      example: {
        id: 2,
        userId: 3,
        storage: '개인 사물함 B동',
        items: '여름 옷, 신발',
        isStored: false,
        storeAt: '2024-02-01T10:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (본인 신청만 삭제 가능)',
  })
  @ApiResponse({ status: 404, description: '보관 신청을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('storage/:id')
  async deleteStorage(@UserId() userId: number, @Param('id') id: number) {
    return await this.dormService.deleteStorage(userId, id);
  }
}
