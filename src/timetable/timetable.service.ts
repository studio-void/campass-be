import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(userId: number) {
    return await this.prisma.scheduleBlock.findMany({
      where: { userId },
      orderBy: [{ startTime: 'asc' }],
    });
  }

  async readByDay(userId: number, day: number) {
    // day가 0-6 (요일)인 경우: 이번 주의 해당 요일
    // day가 날짜 형식인 경우는 별도 메서드로 분리하는 것을 권장
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilTarget = (day - currentDay + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    // 해당 날짜의 시작과 끝 시간 설정
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.scheduleBlock.findMany({
      where: {
        userId,
        AND: [
          {
            startTime: {
              gte: startOfDay,
            },
          },
          {
            startTime: {
              lt: endOfDay,
            },
          },
        ],
      },
      orderBy: { startTime: 'asc' },
    });
  }

  // 특정 날짜로 조회하는 메서드 (선택사항)
  async readByDate(userId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.scheduleBlock.findMany({
      where: {
        userId,
        AND: [
          {
            startTime: {
              gte: startOfDay,
            },
          },
          {
            startTime: {
              lt: endOfDay,
            },
          },
        ],
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async readByTimeRange(userId: number, startTime: Date, endTime: Date) {
    return this.prisma.scheduleBlock.findMany({
      where: {
        userId: userId,
        AND: [
          {
            startTime: {
              gte: startTime,
            },
          },
          {
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async readById(userId: number, id: number) {
    const schedule = await this.prisma.scheduleBlock.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Access denied to this schedule');
    }

    return schedule;
  }

  async create(userId: number, createScheduleDto: CreateScheduleDto) {
    return await this.prisma.scheduleBlock.create({
      data: {
        ...createScheduleDto,
        startTime: new Date(createScheduleDto.startTime),
        endTime: new Date(createScheduleDto.endTime),
        userId,
      },
    });
  }

  async update(
    userId: number,
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.prisma.scheduleBlock.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Only owner can update this schedule');
    }

    return await this.prisma.scheduleBlock.update({
      where: { id },
      data: {
        ...updateScheduleDto,
        ...(updateScheduleDto.startTime && {
          startTime: new Date(updateScheduleDto.startTime),
        }),
        ...(updateScheduleDto.endTime && {
          endTime: new Date(updateScheduleDto.endTime),
        }),
      },
    });
  }

  async delete(userId: number, id: number) {
    const schedule = await this.prisma.scheduleBlock.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Only owner can delete this schedule');
    }

    return await this.prisma.scheduleBlock.delete({ where: { id } });
  }
}
