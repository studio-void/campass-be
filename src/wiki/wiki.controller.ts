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
import { WikiService } from './wiki.service';
import { UserId } from '../user/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';

@ApiTags('Wiki')
@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @ApiOperation({
    summary: '학교별 위키 목록 조회',
    description: '현재 사용자 학교의 모든 위키를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '위키 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          title: '기숙사 생활 가이드',
          content:
            '기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다.',
          authorId: 1,
          school: '한국대학교',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async readBySchool(@UserId() userId: number) {
    return await this.wikiService.readBySchool(userId);
  }

  @ApiOperation({
    summary: '위키 상세 조회',
    description: 'ID로 특정 위키를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '위키 조회 성공',
    schema: {
      example: {
        id: 1,
        title: '기숙사 생활 가이드',
        content:
          '기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다.',
        authorId: 1,
        school: '한국대학교',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        author: {
          id: 1,
          name: '관리자',
        },
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    return await this.wikiService.readById(userId, id);
  }

  @ApiOperation({
    summary: '위키 히스토리 조회',
    description: '특정 위키의 편집 히스토리를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '위키 히스토리 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          wikiId: 1,
          editorId: 1,
          content:
            '기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다.',
          comment: '초기 버전 작성',
          editedAt: '2024-01-01T00:00:00.000Z',
          editor: {
            id: 1,
            name: '관리자',
            nickname: 'admin',
          },
        },
        {
          id: 2,
          wikiId: 1,
          editorId: 2,
          content:
            '기숙사에서 생활할 때 알아야 할 기본적인 정보들과 규칙을 정리한 위키입니다.',
          comment: '규칙 관련 내용 추가',
          editedAt: '2024-01-02T10:30:00.000Z',
          editor: {
            id: 2,
            name: '김학생',
            nickname: 'student1',
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: '위키를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  async readHistoryById(@UserId() userId: number, @Param('id') id: number) {
    return await this.wikiService.readHistoryById(userId, id);
  }

  @ApiOperation({
    summary: '위키 생성',
    description:
      '새로운 위키를 생성합니다. 생성 시 초기 버전 히스토리가 자동으로 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '위키 생성 성공 (초기 히스토리 자동 생성)',
    schema: {
      example: {
        id: 3,
        title: '새로운 위키',
        content: '새로운 위키 내용입니다.',
        authorId: 2,
        school: '한국대학교',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@UserId() userId: number, @Body() createWikiDto: CreateWikiDto) {
    return await this.wikiService.create(userId, createWikiDto);
  }

  @ApiOperation({
    summary: '위키 수정',
    description:
      '기존 위키를 수정합니다. 작성자만 수정 가능하며, 수정 시 히스토리가 자동으로 생성됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '위키 수정 성공 (히스토리 자동 생성)',
    schema: {
      example: {
        id: 1,
        title: '기숙사 생활 가이드 (수정됨)',
        content:
          '기숙사에서 생활할 때 알아야 할 기본적인 정보들과 새로운 규칙을 정리한 위키입니다.',
        authorId: 1,
        school: '한국대학교',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '수정 권한 없음 (작성자 아님)' })
  @ApiResponse({ status: 404, description: '위키를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateWikiDto: UpdateWikiDto,
  ) {
    return await this.wikiService.update(userId, id, updateWikiDto);
  }

  @ApiOperation({
    summary: '위키 삭제',
    description: '위키를 삭제합니다. (작성자만 삭제 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '위키 삭제 성공',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    return await this.wikiService.delete(userId, id);
  }
}
