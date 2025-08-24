import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import userConfig from './user.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigType } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { VerifyUserDto } from './dto/verify-user.dto';

export type UserSelect = Partial<Record<keyof User, true>>;

@Injectable()
export class UserService {
  constructor(
    @Inject(userConfig.KEY) private config: ConfigType<typeof userConfig>,
    private prisma: PrismaService,
  ) {}

  // 민감한 정보를 포함한 필드 선택 (관리자용)
  static getAdminUserSelect(): UserSelect {
    return {
      id: true,
      email: true,
      password: true,
      name: true,
      nickname: true,
      tel: true,
      school: true,
      number: true,
      isAdmin: true,
      verifyStatus: true,
      verifyImageUrl: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  // 민감한 정보를 제외한 기본 필드 선택 (일반 사용자용)
  static getBasicUserSelect(): UserSelect {
    return {
      id: true,
      email: true,
      name: true,
      nickname: true,
      school: true,
      number: true,
      isAdmin: true,
      verifyStatus: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  // 관리자 여부에 따라 적절한 select 반환
  static getUserSelect(isAdmin: boolean): UserSelect {
    if (isAdmin) return UserService.getAdminUserSelect();
    else return UserService.getBasicUserSelect();
  }

  // 팀 생성
  /**
   * 팀 생성 (본인도 팀 멤버에 포함)
   * @param creatorId 팀 생성자(본인) ID
   * @param title 팀 이름
   * @param memberIds 팀 멤버 ID 배열 (본인 제외 가능)
   */
  async createTeam(creatorId: number, title: string, memberIds: number[]) {
    // 중복 제거 및 본인 추가
    const allMemberIds = Array.from(new Set([creatorId, ...memberIds]));
    return await this.prisma.team.create({
      data: {
        title,
        members: {
          connect: allMemberIds.map((id) => ({ id })),
        },
      },
      include: { members: true },
    });
  }

  /**
   * 팀에서 나가기 (leave)
   * @param userId 나가는 사용자 ID
   * @param teamId 팀 ID
   */
  async leaveTeam(userId: number, teamId: number) {
    // 팀 존재 확인
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });
    if (!team) throw new NotFoundException('Team not found');
    // 멤버인지 확인
    if (!team.members.some((m) => m.id === userId)) {
      throw new ConflictException('User is not a member of this team');
    }
    // 멤버에서 제거
    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: [{ id: userId }],
        },
      },
    });
    return { success: true };
  }

  // 팀 삭제
  async deleteTeam(teamId: number) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');
    await this.prisma.team.delete({ where: { id: teamId } });
    return { success: true };
  }

  // 팀 목록 조회
  async listTeams() {
    return await this.prisma.team.findMany({ include: { members: true } });
  }

  // 친구 요청 보내기
  async sendFriendRequest(fromId: number, toId: number) {
    if (fromId === toId)
      throw new ConflictException('Cannot send request to yourself');
    const toUser = await this.prisma.user.findUnique({ where: { id: toId } });
    if (!toUser) throw new NotFoundException('Target user not found');
    const existing = await this.prisma.friendRequest.findFirst({
      where: {
        fromId,
        toId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });
    if (existing)
      throw new ConflictException('Request already exists or already friends');
    return await this.prisma.friendRequest.create({
      data: { fromId, toId, status: 'PENDING' },
    });
  }

  // 친구 요청 수락
  async acceptFriendRequest(requestId: number, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.toId !== userId)
      throw new ConflictException('Not your request');
    if (request.status !== 'PENDING')
      throw new ConflictException('Request is not pending');
    // 친구 관계 추가
    await this.prisma.user.update({
      where: { id: request.fromId },
      data: { friends: { connect: [{ id: request.toId }] } },
    });
    await this.prisma.user.update({
      where: { id: request.toId },
      data: { friends: { connect: [{ id: request.fromId }] } },
    });
    return await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  // 친구 요청 거절
  async rejectFriendRequest(requestId: number, userId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.toId !== userId)
      throw new ConflictException('Not your request');
    if (request.status !== 'PENDING')
      throw new ConflictException('Request is not pending');
    return await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  // 친구 삭제
  async removeFriend(userId: number, friendId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });
    if (!user || !friend) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: { id: userId },
      data: { friends: { disconnect: [{ id: friendId }] } },
    });
    await this.prisma.user.update({
      where: { id: friendId },
      data: { friends: { disconnect: [{ id: userId }] } },
    });
    return { success: true };
  }

  // 친구 목록 조회
  async getFriends(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.friends;
  }

  // 친구 요청 목록 조회 (받은 요청)
  async getReceivedFriendRequests(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: { toId: userId, status: 'PENDING' },
      include: { from: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 친구 요청 목록 조회 (보낸 요청)
  async getSentFriendRequests(userId: number) {
    return await this.prisma.friendRequest.findMany({
      where: { fromId: userId, status: 'PENDING' },
      include: { to: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(this.config.auth.passwordSaltRounds, 10),
    );

    return await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
  }

  async read() {
    return await this.prisma.user.findMany({
      select: UserService.getBasicUserSelect(),
    });
  }

  async readAllUsers(requesterId: number) {
    // 요청자가 관리자인지 확인
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { isAdmin: true },
    });

    if (!requester) {
      throw new NotFoundException(`User with ID ${requesterId} not found`);
    }

    return await this.prisma.user.findMany({
      select: UserService.getUserSelect(requester.isAdmin),
      orderBy: { createdAt: 'desc' },
    });
  }

  async readById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: UserService.getBasicUserSelect(),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async readByIdWithAuth(id: number, requesterId: number) {
    // 요청자가 관리자인지 확인
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { isAdmin: true },
    });

    if (!requester) {
      throw new NotFoundException(`Requester with ID ${requesterId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: UserService.getUserSelect(requester.isAdmin),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async readByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async readByEmailWithAuth(email: string, requesterId: number) {
    // 요청자가 관리자인지 확인
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { isAdmin: true },
    });

    if (!requester) {
      throw new NotFoundException(`Requester with ID ${requesterId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: UserService.getUserSelect(requester.isAdmin),
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, newUser: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const data: UpdateUserDto = { ...newUser };
    if (newUser.password) {
      const rawRounds = Number(this.config.auth.passwordSaltRounds);
      const rounds = Number.isFinite(rawRounds) ? rawRounds : 10;
      const saltRounds = Math.min(Math.max(rounds, 4), 15);
      data.password = await bcrypt.hash(newUser.password, saltRounds);
    }

    return await this.prisma.user.update({
      where: { id },
      data,
      select: UserService.getBasicUserSelect(),
    });
  }

  async delete(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.prisma.user.delete({
      where: { id },
      select: UserService.getBasicUserSelect(),
    });
  }

  async verify(userId: number, verifyDto: VerifyUserDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        verifyImageUrl: verifyDto.verifyImageUrl,
        verifyStatus: 'PENDING',
      },
      select: UserService.getBasicUserSelect(),
    });
  }

  async readAllVerifyRequests() {
    return await this.prisma.user.findMany({
      where: {
        verifyStatus: 'PENDING',
      },
      select: UserService.getBasicUserSelect(),
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async approve(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        verifyStatus: 'VERIFIED',
      },
      select: UserService.getBasicUserSelect(),
    });
  }

  async reject(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        verifyStatus: 'NONE',
        verifyImageUrl: null,
      },
      select: UserService.getBasicUserSelect(),
    });
  }
}
