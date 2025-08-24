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
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserId } from './user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { VerifyUserDto } from './dto/verify-user.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '팀 생성', description: '새로운 팀을 생성합니다.' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('team')
  async createTeam(
    @UserId() userId: number,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return await this.userService.createTeam(
      userId,
      createTeamDto.title,
      createTeamDto.memberIds,
    );
  }

  @ApiOperation({
    summary: '팀 나가기',
    description: '현재 사용자가 팀에서 나갑니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('team/:id/leave')
  async leaveTeam(@UserId() userId: number, @Param('id') teamId: number) {
    return await this.userService.leaveTeam(userId, teamId);
  }

  @ApiOperation({ summary: '팀 삭제', description: '팀을 삭제합니다.' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('team/:id')
  async deleteTeam(@Param('id') id: number) {
    return await this.userService.deleteTeam(id);
  }

  @ApiOperation({
    summary: '팀 목록 조회',
    description: '모든 팀 목록을 조회합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('team')
  async listTeams() {
    return await this.userService.listTeams();
  }

  @ApiOperation({
    summary: '친구 요청 보내기',
    description: '특정 사용자에게 친구 요청을 보냅니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('friend/request/:toId')
  async sendFriendRequest(
    @UserId() userId: number,
    @Param('toId') toId: number,
  ) {
    return await this.userService.sendFriendRequest(userId, toId);
  }

  @ApiOperation({
    summary: '친구 요청 수락',
    description: '받은 친구 요청을 수락합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('friend/accept/:requestId')
  async acceptFriendRequest(
    @UserId() userId: number,
    @Param('requestId') requestId: number,
  ) {
    return await this.userService.acceptFriendRequest(requestId, userId);
  }

  @ApiOperation({
    summary: '친구 요청 거절',
    description: '받은 친구 요청을 거절합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('friend/reject/:requestId')
  async rejectFriendRequest(
    @UserId() userId: number,
    @Param('requestId') requestId: number,
  ) {
    return await this.userService.rejectFriendRequest(requestId, userId);
  }

  @ApiOperation({
    summary: '친구 삭제',
    description: '친구 관계를 삭제합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete('friend/:friendId')
  async removeFriend(
    @UserId() userId: number,
    @Param('friendId') friendId: number,
  ) {
    return await this.userService.removeFriend(userId, friendId);
  }

  @ApiOperation({
    summary: '친구 목록 조회',
    description: '현재 사용자의 친구 목록을 조회합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('friend')
  async getFriends(@UserId() userId: number) {
    return await this.userService.getFriends(userId);
  }

  @ApiOperation({
    summary: '받은 친구 요청 목록',
    description: '현재 사용자가 받은 친구 요청 목록을 조회합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('friend/requests/received')
  async getReceivedFriendRequests(@UserId() userId: number) {
    return await this.userService.getReceivedFriendRequests(userId);
  }

  @ApiOperation({
    summary: '보낸 친구 요청 목록',
    description: '현재 사용자가 보낸 친구 요청 목록을 조회합니다.',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('friend/requests/sent')
  async getSentFriendRequests(@UserId() userId: number) {
    return await this.userService.getSentFriendRequests(userId);
  }

  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: '인증된 사용자의 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 반환',
    schema: {
      example: {
        id: 2,
        email: 'student1@gist.ac.kr',
        name: '김학생',
        nickname: '김김',
        tel: '010-2345-6789',
        school: 'GIST',
        number: '20241001',
        isAdmin: false,
        verifyStatus: 'VERIFIED',
        verifyImageUrl: 'https://example.com/verify-images/student1-card.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@UserId() userId: number) {
    return await this.userService.readById(userId);
  }

  @ApiOperation({
    summary: '모든 사용자 목록 조회',
    description:
      '모든 사용자 목록을 조회합니다. 관리자는 전화번호 포함 모든 정보를, 일반 사용자는 기본 정보만 볼 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          email: 'admin@gist.ac.kr',
          name: '관리자',
          nickname: '관리',
          tel: '010-1234-5678', // 관리자만 볼 수 있는 정보
          school: 'GIST',
          number: '20241000',
          isAdmin: true,
          verifyStatus: 'VERIFIED',
          verifyImageUrl: null,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          email: 'student1@gist.ac.kr',
          name: '김학생',
          nickname: '김김',
          school: 'GIST',
          number: '20241001',
          isAdmin: false,
          verifyStatus: 'VERIFIED',
          verifyImageUrl: 'https://example.com/verify-images/student1-card.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async readAllUsers(@UserId() userId: number) {
    return await this.userService.readAllUsers(userId);
  }

  @ApiOperation({
    summary: '사용자 인증 요청 목록 조회 (관리자)',
    description:
      '모든 사용자의 인증 요청을 조회합니다. 관리자만 접근할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 요청 목록 조회 성공',
    schema: {
      example: [
        {
          id: 4,
          email: 'student3@gist.ac.kr',
          name: '박학생',
          nickname: '박박',
          school: 'GIST',
          number: '20241003',
          isAdmin: false,
          verifyStatus: 'PENDING',
          verifyImageUrl: 'https://example.com/verify-images/student3-card.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 6,
          email: 'student4@gist.ac.kr',
          name: '정대학원',
          nickname: '정정',
          school: 'GIST',
          number: '20241005',
          isAdmin: false,
          verifyStatus: 'PENDING',
          verifyImageUrl: 'https://example.com/verify-images/student4-card.jpg',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('verify')
  async readAllVerifyRequests() {
    return await this.userService.readAllVerifyRequests();
  }

  @ApiOperation({
    summary: '사용자 정보 조회',
    description:
      'ID로 특정 사용자의 정보를 조회합니다. 관리자는 전화번호 포함 모든 정보를, 일반 사용자는 기본 정보만 볼 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    schema: {
      example: {
        id: 3,
        email: 'student2@gist.ac.kr',
        name: '이연구',
        nickname: '이이',
        tel: '010-3456-7890', // 관리자만 볼 수 있는 정보
        school: 'GIST',
        number: '20241002',
        isAdmin: false,
        verifyStatus: 'VERIFIED',
        verifyImageUrl: 'https://example.com/verify-images/student2-card.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async readById(@UserId() userId: number, @Param('id') id: number) {
    return await this.userService.readByIdWithAuth(id, userId);
  }

  @ApiOperation({
    summary: '이메일로 사용자 정보 조회',
    description:
      '이메일로 사용자의 정보를 조회합니다. 관리자는 전화번호 포함 모든 정보를, 일반 사용자는 기본 정보만 볼 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    schema: {
      example: {
        id: 3,
        email: 'student2@gist.ac.kr',
        name: '이연구',
        nickname: '이이',
        tel: '010-3456-7890', // 관리자만 볼 수 있는 정보
        school: 'GIST',
        number: '20241002',
        isAdmin: false,
        verifyStatus: 'VERIFIED',
        verifyImageUrl: 'https://example.com/verify-images/student2-card.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({
    status: 404,
    description: '해당 이메일의 사용자를 찾을 수 없음',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async readByEmail(@UserId() userId: number, @Param('email') email: string) {
    return await this.userService.readByEmailWithAuth(email, userId);
  }

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    schema: {
      example: {
        id: 4,
        email: 'newstudent@gist.ac.kr',
        name: '박학생',
        nickname: '박박',
        tel: '010-9876-5432',
        school: 'GIST',
        number: '20241003',
        isAdmin: false,
        verifyStatus: 'NONE',
        verifyImageUrl: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '현재 사용자의 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 성공',
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@UserId() userId: number, @Body() user: UpdateUserDto) {
    return await this.userService.update(userId, user);
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '현재 사용자를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
  })
  @ApiResponse({ status: 401, description: '인증 실패(JWT 누락 또는 만료)' })
  @ApiResponse({ status: 404, description: '해당 ID의 사용자를 찾을 수 없음' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@UserId() userId: number) {
    return await this.userService.delete(userId);
  }

  @ApiOperation({
    summary: '사용자 인증 요청',
    description: '학생증 이미지를 업로드하여 사용자 인증을 요청합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 요청 성공 (관리자 승인 대기)',
    schema: {
      example: {
        id: 3,
        email: 'student2@gist.ac.kr',
        name: '이연구',
        nickname: '이이',
        school: 'GIST',
        number: '20241002',
        isAdmin: false,
        verifyStatus: 'PENDING',
        verifyImageUrl: 'https://example.com/verify-images/student2-card.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@UserId() userId: number, @Body() verifyDto: VerifyUserDto) {
    return await this.userService.verify(userId, verifyDto);
  }

  @ApiOperation({
    summary: '사용자 인증 승인 (관리자)',
    description: '관리자가 사용자의 인증 요청을 승인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 승인 성공',
    schema: {
      example: {
        id: 3,
        email: 'student2@gist.ac.kr',
        name: '이연구',
        nickname: '이이',
        school: 'GIST',
        number: '20241002',
        isAdmin: false,
        verifyStatus: 'VERIFIED',
        verifyImageUrl: 'https://example.com/verify-images/student2-card.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 405, description: 'Role Guard - Method Not Allowed' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('verify/approve/:id')
  async approve(@Param('id') id: number) {
    return await this.userService.approve(id);
  }

  @ApiOperation({
    summary: '사용자 인증 거부 (관리자)',
    description: '관리자가 사용자의 인증 요청을 거부합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인증 거부 성공',
    schema: {
      example: {
        id: 3,
        email: 'student2@gist.ac.kr',
        name: '이연구',
        nickname: '이이',
        school: 'GIST',
        number: '20241002',
        isAdmin: false,
        verifyStatus: 'NONE',
        verifyImageUrl: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: '관리자 권한 필요' })
  @ApiResponse({ status: 405, description: 'Role Guard - Method Not Allowed' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('verify/reject/:id')
  async reject(@Param('id') id: number) {
    return await this.userService.reject(id);
  }
}
