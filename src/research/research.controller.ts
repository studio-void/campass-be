import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResearchService } from './research.service';
import { UserId } from 'src/user/user.decorator';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get('equipment')
  async readAllEquipment(@UserId() userId: number) {
    // TODO: get all equipment
    return await this.researchService.readAllEquipment(userId);
  }

  @Get('equipment/:id')
  async readEquipmentById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get equipment by id
    return await this.researchService.readEquipmentById(userId, id);
  }

  @Post('equipment')
  async createEquipment(
    @UserId() userId: number,
    @Body() createEquipmentDto: CreateEquipmentDto,
  ) {
    // TODO: create equipment
    return await this.researchService.createEquipment(
      userId,
      createEquipmentDto,
    );
  }

  @Patch('equipment/:id')
  async updateEquipment(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    // TODO: update equipment
    return await this.researchService.updateEquipment(
      userId,
      id,
      updateEquipmentDto,
    );
  }

  @Delete('equipment/:id')
  async deleteEquipment(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete equipment
    return await this.researchService.deleteEquipment(userId, id);
  }

  @Patch('equipment/use/:id')
  async useEquipment(@UserId() userId: number, @Param('id') id: number) {
    // TODO: use equipment
    return await this.researchService.useEquipment(userId, id);
  }

  @Delete('equipment/use/:id')
  async stopUsingEquipment(@UserId() userId: number, @Param('id') id: number) {
    // TODO: stop using equipment
    return await this.researchService.stopUsingEquipment(userId, id);
  }

  @Get('notes')
  async readAllNotes(@UserId() userId: number) {
    // TODO: get all notes
    return await this.researchService.readAllNotes(userId);
  }

  @Get('notes/:id')
  async readNoteById(@UserId() userId: number, @Param('id') id: number) {
    // TODO: get note by id
    return await this.researchService.readNoteById(userId, id);
  }

  @Post('notes')
  async createNote(
    @UserId() userId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    // TODO: create note
    return await this.researchService.createNote(userId, createNoteDto);
  }

  @Patch('notes/:id')
  async updateNote(
    @UserId() userId: number,
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    // TODO: update note
    return await this.researchService.updateNote(userId, id, updateNoteDto);
  }

  @Delete('notes/:id')
  async deleteNote(@UserId() userId: number, @Param('id') id: number) {
    // TODO: delete note
    return await this.researchService.deleteNote(userId, id);
  }
}
