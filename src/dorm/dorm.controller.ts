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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('dorm')
export class DormController {
  constructor(private readonly dormService: DormService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('check')
  async readAllCheck(@UserId() userId: number) {
    // TODO: check dorm status
    return await this.dormService.readAllCheck(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('check/:id')
  async readCheckById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: check dorm status by id
    return await this.dormService.readCheckById(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('check')
  async createCheck(
    @UserId() userId: number,
    @Body() createCheckDto: CreateCheckDto,
  ) {
    // TODO: create dorm
    return await this.dormService.createCheck(userId, createCheckDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('check/:id')
  async updateCheck(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateCheckDto: UpdateCheckDto,
  ) {
    // TODO: update dorm
    return await this.dormService.updateCheck(userId, id, updateCheckDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('check/:id')
  async deleteCheck(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete dorm
    return await this.dormService.deleteCheck(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('storage')
  async readAllStorage(@UserId() userId: number) {
    // TODO: check dorm storage
    return await this.dormService.readAllStorage(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('storage/:id')
  async readStorageById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: check dorm storage by id
    return await this.dormService.readStorageById(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('storage')
  async createStorage(
    @UserId() userId: number,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    // TODO: create dorm storage
    return await this.dormService.createStorage(userId, createStorageDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('storage/:id')
  async updateStorage(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    // TODO: update dorm storage
    return await this.dormService.updateStorage(userId, id, updateStorageDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('storage/:id')
  async deleteStorage(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete dorm storage
    return await this.dormService.deleteStorage(userId, id);
  }
}
