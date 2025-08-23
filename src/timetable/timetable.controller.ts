import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from '../user/user.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @ApiOperation({
    summary: '시간표 조회',
    description: '현재 사용자의 모든 일정을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시간표 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          name: '데이터베이스 시스템',
          description: '데이터베이스 설계 및 구현 수업',
          location: 'GIST 대학원 1동 101호',
          startTime: '2024-08-26T09:00:00.000Z',
          endTime: '2024-08-26T10:30:00.000Z',
          userId: 2,
        },
        {
          id: 2,
          name: '머신러닝',
          description: '인공지능 기초 수업',
          location: 'GIST 대학원 1동 201호',
          startTime: '2024-08-28T14:00:00.000Z',
          endTime: '2024-08-28T15:30:00.000Z',
          userId: 2,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async readAll(@UserId() userId: number) {
    return await this.timetableService.readAll(userId);
  }

  @ApiOperation({
    summary: '일정 상세 조회',
    description: 'ID로 특정 일정을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일정 조회 성공',
    schema: {
      example: {
        id: 1,
        name: '데이터베이스 시스템',
        description: '데이터베이스 설계 및 구현 수업',
        location: 'GIST 대학원 1동 101호',
        startTime: '2024-08-26T09:00:00.000Z',
        endTime: '2024-08-26T10:30:00.000Z',
        userId: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (본인 일정만 조회 가능)',
  })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId) || !isFinite(numericId)) {
      throw new Error(`Invalid ID parameter: ${id}`);
    }
    return await this.timetableService.readById(userId, numericId);
  }

  @ApiOperation({
    summary: '일정 생성',
    description: '새로운 일정을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '일정 생성 성공',
    schema: {
      example: {
        id: 3,
        name: '소프트웨어 공학',
        description: '소프트웨어 개발 방법론 수업',
        location: 'GIST 대학원 2동 301호',
        startTime: '2024-08-27T11:00:00.000Z',
        endTime: '2024-08-27T12:30:00.000Z',
        userId: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserId() userId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return await this.timetableService.create(userId, createScheduleDto);
  }

  @ApiOperation({
    summary: '일정 수정',
    description: '기존 일정을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일정 수정 성공',
    schema: {
      example: {
        id: 1,
        name: '데이터베이스 시스템 (수정됨)',
        description: '데이터베이스 설계 및 구현 수업 - 고급',
        location: 'GIST 대학원 1동 102호',
        startTime: '2024-08-26T09:30:00.000Z',
        endTime: '2024-08-26T11:00:00.000Z',
        userId: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (본인 일정만 수정 가능)',
  })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const numericId = Number(id);
    if (isNaN(numericId) || !isFinite(numericId)) {
      throw new Error(`Invalid ID parameter: ${id}`);
    }
    return await this.timetableService.update(
      userId,
      numericId,
      updateScheduleDto,
    );
  }

  @ApiOperation({
    summary: '일정 삭제',
    description: '기존 일정을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일정 삭제 성공',
    schema: {
      example: {
        id: 1,
        name: '데이터베이스 시스템',
        description: '데이터베이스 설계 및 구현 수업',
        location: 'GIST 대학원 1동 101호',
        startTime: '2024-08-26T09:00:00.000Z',
        endTime: '2024-08-26T10:30:00.000Z',
        userId: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 403,
    description: '권한 없음 (본인 일정만 삭제 가능)',
  })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid id parameter');
    }
    return await this.timetableService.delete(userId, numericId);
  }

  @Get('day/:dayOfWeek')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '특정 요일의 모든 일정 조회',
    description:
      '이번 주의 특정 요일에 해당하는 모든 일정을 조회합니다. startTime 기준으로 해당 요일의 일정을 필터링합니다.',
  })
  @ApiParam({
    name: 'dayOfWeek',
    description: '요일 (0=일요일, 1=월요일, ..., 6=토요일)',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '특정 요일의 일정 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '컴퓨터 과학 개론' },
          description: {
            type: 'string',
            example: '컴퓨터 과학의 기초 개념 학습',
            nullable: true,
          },
          location: { type: 'string', example: 'GIST 대학원 1동 101호' },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-08-26T09:00:00.000Z',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-08-26T10:30:00.000Z',
          },
          userId: { type: 'number', example: 1 },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (요일 값이 0-6 범위를 벗어남)',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async readByDay(
    @UserId() userId: number,
    @Param('dayOfWeek') dayOfWeek: string,
  ) {
    const numericDayOfWeek = Number(dayOfWeek);
    if (
      isNaN(numericDayOfWeek) ||
      numericDayOfWeek < 0 ||
      numericDayOfWeek > 6
    ) {
      throw new Error('Invalid dayOfWeek parameter');
    }
    return await this.timetableService.readByDay(userId, numericDayOfWeek);
  }

  @Get('range')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '특정 시간 범위의 모든 일정 조회' })
  @ApiQuery({
    name: 'startTime',
    description: '시작 시간',
    type: 'string',
    format: 'date-time',
    example: '2024-08-26T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endTime',
    description: '종료 시간',
    type: 'string',
    format: 'date-time',
    example: '2024-08-30T23:59:59.000Z',
  })
  @ApiResponse({
    status: 200,
    description: '시간 범위 내 일정 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '컴퓨터 과학 개론' },
          description: {
            type: 'string',
            example: '컴퓨터 과학의 기초 개념 학습',
            nullable: true,
          },
          location: { type: 'string', example: 'GIST 대학원 1동 101호' },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-08-26T09:00:00.000Z',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-08-26T10:30:00.000Z',
          },
          userId: { type: 'number', example: 1 },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (시작 시간이 종료 시간보다 늦음)',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async readByTimeRange(
    @UserId() userId: number,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    if (!startTime || !endTime) {
      throw new Error('startTime and endTime are required');
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }

    if (startDate >= endDate) {
      throw new Error('startTime must be before endTime');
    }

    return await this.timetableService.readByTimeRange(
      userId,
      startDate,
      endDate,
    );
  }
}
