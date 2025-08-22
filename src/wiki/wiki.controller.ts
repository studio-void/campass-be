import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WikiService } from './wiki.service';
import { User, UserId } from 'src/user/user.decorator';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  async readBySchool(@UserId() userId: number) {
    // TODO: get wiki by school
    return await this.wikiService.readBySchool(userId);
  }

  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get wiki by id
    return await this.wikiService.readById(userId, id);
  }

  @Post()
  async create(@UserId() userId: number, @Body() createWikiDto: CreateWikiDto) {
    // TODO: create wiki
    return await this.wikiService.create(userId, createWikiDto);
  }

  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateWikiDto: UpdateWikiDto,
  ) {
    // TODO: update wiki
    return await this.wikiService.update(userId, id, updateWikiDto);
  }

  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete wiki
    return await this.wikiService.delete(userId, id);
  }
}
