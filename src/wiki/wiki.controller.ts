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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async readBySchool(@UserId() userId: number) {
    // TODO: get wiki by school
    return await this.wikiService.readBySchool(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get wiki by id
    return await this.wikiService.readById(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@UserId() userId: number, @Body() createWikiDto: CreateWikiDto) {
    // TODO: create wiki
    return await this.wikiService.create(userId, createWikiDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateWikiDto: UpdateWikiDto,
  ) {
    // TODO: update wiki
    return await this.wikiService.update(userId, id, updateWikiDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete wiki
    return await this.wikiService.delete(userId, id);
  }
}
