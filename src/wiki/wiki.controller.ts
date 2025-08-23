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
    summary: '위키 생성',
    description: '새로운 위키를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '위키 생성 성공',
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
    description: '기존 위키를 수정합니다. (작성자만 수정 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '위키 수정 성공',
  })
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
