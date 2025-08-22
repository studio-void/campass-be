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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('equipment')
  async readAllEquipment(@UserId() userId: number) {
    return await this.researchService.readAllEquipment(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('equipment/:id')
  async readEquipmentById(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.readEquipmentById(userId, id);
  }

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

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('equipment/use/:id')
  async useEquipment(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.useEquipment(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('equipment/use/:id')
  async stopUsingEquipment(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.stopUsingEquipment(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async readAllNotes(@UserId() userId: number) {
    return await this.researchService.readAllNotes(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async readNoteById(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.readNoteById(userId, id);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(
    @UserId() userId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return await this.researchService.createNote(userId, createNoteDto);
  }

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

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('notes/:id')
  async deleteNote(@UserId() userId: number, @Param('id') id: number) {
    return await this.researchService.deleteNote(userId, id);
  }
}
