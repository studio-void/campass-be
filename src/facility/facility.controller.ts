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
import { FacilityService } from './facility.service';
import { UserId } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { UseFacilityDto } from './dto/use-facility.dto';

@ApiTags('Facility')
@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @ApiOperation({
    summary: '시설 목록 조회',
    description: '사용자 학교의 모든 시설을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시설 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          name: '체육관',
          school: '한국대학교',
          description: '농구, 배드민턴 등을 할 수 있는 체육관입니다.',
          location: '학생회관 3층',
          openTime: '2024-01-01T09:00:00.000Z',
          closeTime: '2024-01-01T22:00:00.000Z',
          isAvailable: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async readAll(@UserId() userId: number) {
    return await this.facilityService.readAll(userId);
  }

  @ApiOperation({
    summary: '시설 상세 조회',
    description: 'ID로 특정 시설을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시설 조회 성공',
    schema: {
      example: {
        id: 1,
        name: '체육관',
        school: '한국대학교',
        description: '농구, 배드민턴 등을 할 수 있는 체육관입니다.',
        location: '학생회관 3층',
        openTime: '2024-01-01T09:00:00.000Z',
        closeTime: '2024-01-01T22:00:00.000Z',
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: '시설을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    return await this.facilityService.readById(userId, id);
  }

  @ApiOperation({
    summary: '시설 생성',
    description: '새로운 시설을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '시설 생성 성공',
    schema: {
      example: {
        id: 3,
        name: '강의실 A101',
        school: '한국대학교',
        description: '소규모 강의나 스터디 그룹을 위한 공간입니다.',
        location: '공학관 1층',
        openTime: '2024-01-01T08:00:00.000Z',
        closeTime: '2024-01-01T20:00:00.000Z',
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserId() userId: number,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    return await this.facilityService.create(userId, createFacilityDto);
  }

  @ApiOperation({
    summary: '시설 정보 수정',
    description: '시설 정보를 수정합니다. 관리자만 수정할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시설 수정 성공',
    schema: {
      example: {
        id: 1,
        name: '체육관 A',
        location: '학생회관 3층',
        description: '농구, 배드민턴 가능',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
        user: {
          id: 1,
          name: '관리자',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '시설을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    return await this.facilityService.update(userId, id, updateFacilityDto);
  }

  @ApiOperation({
    summary: '시설 삭제',
    description: '시설을 삭제합니다. 관리자만 삭제할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시설 삭제 성공',
    schema: {
      example: {
        message: '시설이 성공적으로 삭제되었습니다.',
        deletedFacility: {
          id: 1,
          name: '체육관',
          location: '학생회관 3층',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 404, description: '시설을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    return await this.facilityService.delete(userId, id);
  }

  @ApiOperation({
    summary: '시설 예약하기',
    description:
      '지정된 시간에 시설을 예약합니다. 기존 예약과 겹치면 예약할 수 없습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '시설 예약 성공',
    schema: {
      example: {
        id: 1,
        facilityId: 1,
        userId: 2,
        startTime: '2024-01-15T14:00:00.000Z',
        endTime: '2024-01-15T16:00:00.000Z',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
        facility: {
          id: 1,
          name: '체육관',
          location: '학생회관 3층',
        },
        user: {
          id: 2,
          name: '김학생',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '예약 시간 겹침 또는 시설 이용 불가',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('use/:id')
  async use(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() useFacilityDto: UseFacilityDto,
  ) {
    return await this.facilityService.use(userId, id, useFacilityDto);
  }
}
