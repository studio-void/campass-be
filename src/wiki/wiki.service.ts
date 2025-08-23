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

    // Transaction을 사용하여 Wiki 생성과 History 생성을 동시에 처리
    return await this.prisma.$transaction(async (prisma) => {
      // Wiki 생성
      const newWiki = await prisma.wiki.create({
        data: {
          ...createWikiDto,
          authorId: userId,
          school: user.school,
        },
      });

      // WikiHistory 생성 (초기 버전)
      await prisma.wikiHistory.create({
        data: {
          wikiId: newWiki.id,
          editorId: userId,
          content: createWikiDto.content,
          comment: '초기 버전 생성',
        },
      });

      return newWiki;
    });
  }

  async update(userId: number, id: number, updateWikiDto: UpdateWikiDto) {
    const wiki = await this.prisma.wiki.findUnique({ where: { id } });
    if (!wiki) throw new NotFoundException('Wiki not found');

    return await this.prisma.$transaction(async (prisma) => {
      const updatedWiki = await prisma.wiki.update({
        where: { id },
        data: {
          title: updateWikiDto.title || wiki.title,
          content: updateWikiDto.content || wiki.content,
        },
      });

      if (updateWikiDto.content && updateWikiDto.content !== wiki.content) {
        await prisma.wikiHistory.create({
          data: {
            wikiId: id,
            editorId: userId,
            content: updateWikiDto.content,
            comment:
              updateWikiDto.comment ||
              (updateWikiDto.title !== wiki.title
                ? `제목 및 내용 수정: "${updateWikiDto.title || wiki.title}"`
                : '내용 수정'),
          },
        });
      }

      return updatedWiki;
    });
  }

  async readHistoryById(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { school: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const wiki = await this.prisma.wiki.findUnique({
      where: { id },
      select: { school: true },
    });
    if (!wiki) throw new NotFoundException('Wiki not found');

    if (wiki.school !== user.school) {
      throw new ForbiddenException('Access denied to this wiki');
    }

    return await this.prisma.wikiHistory.findMany({
      where: { wikiId: id },
      include: {
        editor: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: { editedAt: 'desc' },
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
