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
import { ResearchService } from './research.service';
import { UserId } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @ApiOperation({
    summary: '연구 장비 목록 조회',
    description: '사용자 학교의 모든 연구 장비를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '장비 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          name: '현미경',
          school: '한국대학교',
          description: '연구용 고성능 현미경',
          isAvailable: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('equipment')
  async readAllEquipment(@UserId() userId: number) {
    return await this.researchService.readAllEquipment(userId);
  }

  @ApiOperation({
    summary: '연구 장비 상세 조회',
    description: 'ID로 특정 연구 장비를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '장비 조회 성공',
    schema: {
      example: {
        id: 1,
        name: '현미경',
        school: '한국대학교',
        description: '연구용 고성능 현미경',
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: '장비를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('equipment/:id')
  async readEquipmentById(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.readEquipmentById(userId, id);
  }

  @ApiOperation({
    summary: '연구 장비 생성',
    description: '새로운 연구 장비를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '장비 생성 성공',
    schema: {
      example: {
        id: 3,
        name: '분광분석기',
        school: '한국대학교',
        description: '화학 성분 분석을 위한 장비',
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('equipment')
  async createEquipment(
    @UserId() userId: number,
    @Body() createEquipmentDto: CreateEquipmentDto,
  ) {
    return await this.researchService.createEquipment(
      userId,
      createEquipmentDto,
    );
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('equipment/:id')
  async updateEquipment(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return await this.researchService.updateEquipment(
      userId,
      id,
      updateEquipmentDto,
    );
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('equipment/:id')
  async deleteEquipment(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.deleteEquipment(userId, id);
  }

  @ApiOperation({
    summary: '장비 사용 시작',
    description:
      '연구 장비 사용을 시작합니다. 현재 사용 중이 아닌 장비만 사용할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '장비 사용 시작 성공',
    schema: {
      example: {
        id: 1,
        equipmentId: 1,
        userId: 2,
        startTime: '2024-01-15T09:00:00.000Z',
        endTime: null,
        purpose: '연구용',
        createdAt: '2024-01-15T09:00:00.000Z',
        updatedAt: '2024-01-15T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '장비가 이미 사용 중이거나 사용할 수 없음',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('equipment/use/:id')
  async useEquipment(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.useEquipment(userId, id);
  }

  @ApiOperation({
    summary: '장비 사용 종료',
    description: '연구 장비 사용을 종료합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '장비 사용 종료 성공',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('equipment/use/:id')
  async stopUsingEquipment(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.stopUsingEquipment(userId, id);
  }

  @ApiOperation({
    summary: '연구 노트 목록 조회',
    description: '현재 사용자의 모든 연구 노트를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '노트 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          authorId: 2,
          title: '실험 결과 정리',
          content: '오늘 진행한 화학 실험의 결과를 정리한 내용입니다.',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async readAllNotes(@UserId() userId: number) {
    return await this.researchService.readAllNotes(userId);
  }

  @ApiOperation({
    summary: '연구 노트 상세 조회',
    description: '특정 연구 노트의 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '노트 조회 성공',
    schema: {
      example: {
        id: 1,
        authorId: 2,
        title: '실험 결과 정리',
        content: '오늘 진행한 화학 실험의 결과를 정리한 내용입니다.',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        author: {
          id: 2,
          name: '김연구',
          studentId: '20201234',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '노트를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '접근 권한 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async readNoteById(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.readNoteById(userId, id);
  }

  @ApiOperation({
    summary: '연구 노트 생성',
    description: '새로운 연구 노트를 작성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '노트 생성 성공',
    schema: {
      example: {
        id: 3,
        authorId: 3,
        title: '새로운 실험 계획',
        content: '다음 실험에 대한 계획을 세웠습니다.',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(
    @UserId() userId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return await this.researchService.createNote(userId, createNoteDto);
  }

  @ApiOperation({
    summary: '연구 노트 수정',
    description: '기존 연구 노트를 수정합니다. 작성자만 수정할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '노트 수정 성공',
    schema: {
      example: {
        id: 1,
        authorId: 2,
        title: '수정된 실험 결과',
        content: '실험 결과를 보완하여 재작성한 내용입니다.',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: '노트를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '수정 권한 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('notes/:id')
  async updateNote(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return await this.researchService.updateNote(userId, id, updateNoteDto);
  }

  @ApiOperation({
    summary: '연구 노트 삭제',
    description: '연구 노트를 삭제합니다. 작성자만 삭제할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '노트 삭제 성공',
    schema: {
      example: {
        message: '연구 노트가 성공적으로 삭제되었습니다.',
        deletedNote: {
          id: 1,
          title: '실험 결과 정리',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '노트를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '삭제 권한 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('notes/:id')
  async deleteNote(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.deleteNote(userId, id);
  }
}
