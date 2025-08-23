import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DormService {
  constructor(private prisma: PrismaService) {}

  async readAllCheck(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    return await this.prisma.checkRequest.findMany({
      include: {
        user: {
          select: UserService.getAdminUserSelect(),
        },
      },
      orderBy: { checkAt: 'asc' },
    });
  }

  async readCheckById(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const checkRequest = await this.prisma.checkRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: UserService.getBasicUserSelect(),
        },
      },
    });

    if (!checkRequest) throw new NotFoundException('Check request not found');
    return checkRequest;
  }

  async createCheck(userId: number, createCheckDto: CreateCheckDto) {
    return await this.prisma.checkRequest.create({
      data: {
        ...createCheckDto,
        userId,
        checkAt: new Date(createCheckDto.checkAt),
      },
    });
  }

  async updateCheck(
    userId: number,
    id: number,
    updateCheckDto: UpdateCheckDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const checkRequest = await this.prisma.checkRequest.findUnique({
      where: { id },
    });
    if (!checkRequest) throw new NotFoundException('Check request not found');

    return await this.prisma.checkRequest.update({
      where: { id },
      data: {
        ...updateCheckDto,
        ...(updateCheckDto.checkAt && {
          checkAt: new Date(updateCheckDto.checkAt),
        }),
      },
    });
  }

  async deleteCheck(userId: number, id: number) {
    const checkRequest = await this.prisma.checkRequest.findUnique({
      where: { id },
    });
    if (!checkRequest) throw new NotFoundException('Check request not found');
    if (checkRequest.userId !== userId)
      throw new ForbiddenException('Only requester can delete this request');

    return await this.prisma.checkRequest.delete({ where: { id } });
  }

  async readAllStorage(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    return await this.prisma.storageRequest.findMany({
      include: {
        user: {
          select: { name: true, nickname: true, email: true },
        },
      },
      orderBy: { storeAt: 'asc' },
    });
  }

  async readStorageById(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const storageRequest = await this.prisma.storageRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, nickname: true, email: true },
        },
      },
    });

    if (!storageRequest)
      throw new NotFoundException('Storage request not found');
    return storageRequest;
  }

  async createStorage(userId: number, createStorageDto: CreateStorageDto) {
    return await this.prisma.storageRequest.create({
      data: {
        ...createStorageDto,
        userId,
        storeAt: new Date(createStorageDto.storeAt),
      },
    });
  }

  async updateStorage(
    userId: number,
    id: number,
    updateStorageDto: UpdateStorageDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true, isAdmin: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isAdmin) throw new ForbiddenException('Admin access required');

    const storageRequest = await this.prisma.storageRequest.findUnique({
      where: { id },
    });
    if (!storageRequest)
      throw new NotFoundException('Storage request not found');

    return await this.prisma.storageRequest.update({
      where: { id },
      data: {
        ...updateStorageDto,
        ...(updateStorageDto.storeAt && {
          storeAt: new Date(updateStorageDto.storeAt),
        }),
      },
    });
  }

  // 보관 요청 삭제 (요청자만 가능)
  async deleteStorage(userId: number, id: number) {
    const storageRequest = await this.prisma.storageRequest.findUnique({
      where: { id },
    });
    if (!storageRequest)
      throw new NotFoundException('Storage request not found');
    if (storageRequest.userId !== userId)
      throw new ForbiddenException('Only requester can delete this request');

    return await this.prisma.storageRequest.delete({ where: { id } });
  }
}
