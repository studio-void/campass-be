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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { UseFacilityDto } from './dto/use-facility.dto';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async readAll(@UserId() userId: number) {
    // TODO: get all facilities
    return await this.facilityService.readAll(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get facility by id
    return await this.facilityService.readById(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserId() userId: number,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    // TODO: create facility
    return await this.facilityService.create(userId, createFacilityDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    // TODO: update facility
    return await this.facilityService.update(userId, id, updateFacilityDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete facility
    return await this.facilityService.delete(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('use/:id')
  async use(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() useFacilityDto: UseFacilityDto,
  ) {
    // TODO: use facility
    return await this.facilityService.use(userId, id, useFacilityDto);
  }
}
