import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DormService } from './dorm.service';
import { UserId } from 'src/user/user.decorator';

@Controller('dorm')
export class DormController {
  constructor(private readonly dormService: DormService) {}

  @Get('check')
  async readAllCheck(@UserId() userId: number) {
    // TODO: check dorm status
    return await this.dormService.readAllCheck(userId);
  }

  @Get('check/:id')
  async readCheckById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: check dorm status by id
    return await this.dormService.readCheckById(userId, id);
  }

  @Post('check')
  async createCheck(
    @UserId() userId: number,
    @Body() createCheckDto: CreateCheckDto,
  ) {
    // TODO: create dorm
    return await this.dormService.createCheck(userId, createCheckDto);
  }

  @Patch('check/:id')
  async updateCheck(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateCheckDto: UpdateCheckDto,
  ) {
    // TODO: update dorm
    return await this.dormService.updateCheck(userId, id, updateCheckDto);
  }

  @Delete('check/:id')
  async deleteCheck(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete dorm
    return await this.dormService.deleteCheck(userId, id);
  }

  @Get('storage')
  async readAllStorage(@UserId() userId: number) {
    // TODO: check dorm storage
    return await this.dormService.readAllStorage(userId);
  }

  @Get('storage/:id')
  async readStorageById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: check dorm storage by id
    return await this.dormService.readStorageById(userId, id);
  }

  @Post('storage')
  async createStorage(
    @UserId() userId: number,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    // TODO: create dorm storage
    return await this.dormService.createStorage(userId, createStorageDto);
  }

  @Patch('storage/:id')
  async updateStorage(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    // TODO: update dorm storage
    return await this.dormService.updateStorage(userId, id, updateStorageDto);
  }

  @Delete('storage/:id')
  async deleteStorage(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete dorm storage
    return await this.dormService.deleteStorage(userId, id);
  }
}
