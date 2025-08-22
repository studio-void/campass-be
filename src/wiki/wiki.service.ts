import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';

@Injectable()
export class WikiService {
  constructor(private readonly prisma: PrismaService) {}

  async readBySchool(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.wiki.findMany({
      where: { school: user.school },
      orderBy: { createdAt: 'desc' },
    });
  }

  async readById(userId: number, id: number) {
    const wiki = await this.prisma.wiki.findUnique({
      where: { id },
    });
    if (!wiki) throw new NotFoundException('Wiki not found');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user || wiki.school !== user.school)
      throw new ForbiddenException('Access denied');

    return wiki;
  }

  async create(userId: number, createWikiDto: CreateWikiDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.wiki.create({
      data: {
        ...createWikiDto,
        authorId: userId,
        school: user.school,
      },
    });
  }

  async update(userId: number, id: number, updateWikiDto: UpdateWikiDto) {
    const wiki = await this.prisma.wiki.findUnique({ where: { id } });
    if (!wiki) throw new NotFoundException('Wiki not found');

    if (wiki.authorId !== userId)
      throw new ForbiddenException('Only author can update');

    return await this.prisma.wiki.update({
      where: { id },
      data: updateWikiDto,
    });
  }

  async delete(userId: number, id: number) {
    const wiki = await this.prisma.wiki.findUnique({ where: { id } });
    if (!wiki) throw new NotFoundException('Wiki not found');

    if (wiki.authorId !== userId)
      throw new ForbiddenException('Only author can delete');

    return await this.prisma.wiki.delete({ where: { id } });
  }
}
