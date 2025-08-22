import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class ResearchService {
  constructor(private prisma: PrismaService) {}

  async readAllEquipment(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.equipment.findMany({
      where: { school: user.school },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            user: {
              select: { name: true, nickname: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readEquipmentById(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, nickname: true },
            },
          },
        },
      },
    });

    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');

    return equipment;
  }

  async createEquipment(
    userId: number,
    createEquipmentDto: CreateEquipmentDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    return await this.prisma.equipment.create({
      data: {
        ...createEquipmentDto,
        school: user.school,
      },
    });
  }

  async updateEquipment(
    userId: number,
    id: number,
    updateEquipmentDto: UpdateEquipmentDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');

    return await this.prisma.equipment.update({
      where: { id },
      data: updateEquipmentDto,
    });
  }

  async deleteEquipment(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');

    return await this.prisma.equipment.delete({ where: { id } });
  }

  async useEquipment(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');
    if (!equipment.isAvailable)
      throw new BadRequestException('Equipment is not available');

    const activeHistory = await this.prisma.equipmentHistory.findFirst({
      where: {
        equipmentId: id,
        userId,
        updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (activeHistory && activeHistory.createdAt === activeHistory.updatedAt) {
      throw new BadRequestException('Equipment is already in use by you');
    }

    return await this.prisma.equipmentHistory.create({
      data: {
        userId,
        equipmentId: id,
      },
    });
  }

  async stopUsingEquipment(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');

    const activeHistory = await this.prisma.equipmentHistory.findFirst({
      where: {
        equipmentId: id,
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeHistory) {
      throw new BadRequestException('No active usage found');
    }

    return await this.prisma.equipmentHistory.update({
      where: { id: activeHistory.id },
      data: { updatedAt: new Date() },
    });
  }

  async readAllNotes(userId: number) {
    return await this.prisma.note.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readNoteById(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, nickname: true },
        },
      },
    });

    if (!note) throw new NotFoundException('Note not found');
    if (note.authorId !== userId)
      throw new ForbiddenException('Only author can view this note');

    return note;
  }

  async createNote(userId: number, createNoteDto: CreateNoteDto) {
    return await this.prisma.note.create({
      data: {
        ...createNoteDto,
        authorId: userId,
      },
    });
  }

  async updateNote(userId: number, id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.authorId !== userId)
      throw new ForbiddenException('Only author can update this note');

    return await this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async deleteNote(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.authorId !== userId)
      throw new ForbiddenException('Only author can delete this note');

    return await this.prisma.note.delete({ where: { id } });
  }
}
