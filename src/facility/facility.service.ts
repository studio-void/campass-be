import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { UseFacilityDto } from './dto/use-facility.dto';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async readAll(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.facility.findMany({
      where: { school: user.school },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readById(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const facility = await this.prisma.facility.findUnique({
      where: { id },
      include: {
        requests: {
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!facility) throw new NotFoundException('Facility not found');
    if (facility.school !== user.school)
      throw new ForbiddenException('Access denied');

    return facility;
  }

  async create(userId: number, createFacilityDto: CreateFacilityDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    return await this.prisma.facility.create({
      data: {
        ...createFacilityDto,
        school: user.school,
        openTime: new Date(createFacilityDto.openTime),
        closeTime: new Date(createFacilityDto.closeTime),
      },
    });
  }

  async update(
    userId: number,
    id: number,
    updateFacilityDto: UpdateFacilityDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const facility = await this.prisma.facility.findUnique({ where: { id } });
    if (!facility) throw new NotFoundException('Facility not found');
    if (facility.school !== user.school)
      throw new ForbiddenException('Access denied');

    return await this.prisma.facility.update({
      where: { id },
      data: {
        ...updateFacilityDto,
        ...(updateFacilityDto.openTime && {
          openTime: new Date(updateFacilityDto.openTime),
        }),
        ...(updateFacilityDto.closeTime && {
          closeTime: new Date(updateFacilityDto.closeTime),
        }),
      },
    });
  }

  async delete(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const facility = await this.prisma.facility.findUnique({ where: { id } });
    if (!facility) throw new NotFoundException('Facility not found');
    if (facility.school !== user.school)
      throw new ForbiddenException('Access denied');

    return await this.prisma.facility.delete({ where: { id } });
  }

  async use(userId: number, id: number, useFacilityDto: UseFacilityDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const facility = await this.prisma.facility.findUnique({ where: { id } });
    if (!facility) throw new NotFoundException('Facility not found');
    if (facility.school !== user.school)
      throw new ForbiddenException('Access denied');
    if (!facility.isAvailable)
      throw new BadRequestException('Facility is not available');

    const startTime = new Date(useFacilityDto.startTime);
    const endTime = new Date(useFacilityDto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const conflictingReservation = await this.prisma.facilityRequest.findFirst({
      where: {
        facilityId: id,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingReservation) {
      throw new BadRequestException('Time slot is already reserved');
    }

    return await this.prisma.facilityRequest.create({
      data: {
        userId,
        facilityId: id,
        startTime,
        endTime,
      },
    });
  }
}
