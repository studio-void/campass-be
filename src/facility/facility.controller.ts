import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { UserId } from 'src/user/user.decorator';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get()
  async readAll(@UserId() userId: number) {
    // TODO: get all facilities
    return await this.facilityService.readAll(userId);
  }

  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get facility by id
    return await this.facilityService.readById(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: number,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    // TODO: create facility
    return await this.facilityService.create(userId, createFacilityDto);
  }

  @Patch(':id')
  async update(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    // TODO: update facility
    return await this.facilityService.update(userId, id, updateFacilityDto);
  }

  @Delete(':id')
  async delete(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete facility
    return await this.facilityService.delete(userId, id);
  }

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
