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

  async readEquipmentHistory(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        school: true,
        description: true,
        isAvailable: true,
        isOccupied: true,
      },
    });

    if (!equipment) throw new NotFoundException('Equipment not found');
    if (equipment.school !== user.school)
      throw new ForbiddenException('Access denied');

    const histories = await this.prisma.equipmentHistory.findMany({
      where: { equipmentId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 사용 통계 계산
    const completedUsages = histories.filter(
      (h) => h.createdAt.getTime() !== h.updatedAt.getTime(),
    );
    const currentUsage = histories.find(
      (h) => h.createdAt.getTime() === h.updatedAt.getTime(),
    );
    const isCurrentUserUsing = currentUsage?.userId === userId;

    // 총 사용 시간 계산 (완료된 사용만)
    const totalUsageMinutes = completedUsages.reduce((total, history) => {
      const duration =
        history.updatedAt.getTime() - history.createdAt.getTime();
      return total + Math.floor(duration / (1000 * 60)); // 분 단위
    }, 0);

    return {
      equipment,
      histories,
      statistics: {
        totalUsages: histories.length,
        completedUsages: completedUsages.length,
        totalUsageMinutes,
        totalUsageHours: Math.floor(totalUsageMinutes / 60),
        isCurrentlyInUse: !!currentUsage,
        currentUser: currentUsage
          ? {
              id: currentUsage.userId,
              name: currentUsage.user.name,
              nickname: currentUsage.user.nickname,
              startTime: currentUsage.createdAt,
            }
          : null,
        isCurrentUserUsing,
      },
    };
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
    if (equipment.isOccupied)
      throw new BadRequestException('Equipment is already in use');

    // Transaction을 사용하여 장비 상태 변경과 히스토리 생성을 동시에 처리
    return await this.prisma.$transaction(async (prisma) => {
      // 장비를 사용 중으로 설정
      await prisma.equipment.update({
        where: { id },
        data: { isOccupied: true },
      });

      // 장비 사용 히스토리 생성
      return await prisma.equipmentHistory.create({
        data: {
          userId,
          equipmentId: id,
        },
        include: {
          equipment: {
            select: { name: true, isOccupied: true },
          },
          user: {
            select: { name: true, nickname: true },
          },
        },
      });
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

    if (!equipment.isOccupied)
      throw new BadRequestException('Equipment is not currently in use');

    // 현재 사용 중인 히스토리 찾기 (최근 히스토리 중에서 createdAt = updatedAt인 경우)
    const recentHistories = await this.prisma.equipmentHistory.findMany({
      where: {
        equipmentId: id,
        userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const activeHistory = recentHistories.find(
      (history) => history.createdAt.getTime() === history.updatedAt.getTime(),
    );

    if (!activeHistory) {
      throw new BadRequestException('No active usage found for this user');
    }

    // Transaction을 사용하여 장비 상태 변경과 히스토리 업데이트를 동시에 처리
    return await this.prisma.$transaction(async (prisma) => {
      // 장비를 사용 가능으로 설정
      await prisma.equipment.update({
        where: { id },
        data: { isOccupied: false },
      });

      // 장비 사용 종료 시간 업데이트
      return await prisma.equipmentHistory.update({
        where: { id: activeHistory.id },
        data: { updatedAt: new Date() },
        include: {
          equipment: {
            select: { name: true, isOccupied: true },
          },
          user: {
            select: { name: true, nickname: true },
          },
        },
      });
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
