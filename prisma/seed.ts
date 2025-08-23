import { Equipment, Facility, PrismaClient, User, Wiki } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

async function main() {
  const prisma = new PrismaClient();

  console.log('🌱 Starting seed...');

  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  // Users data
  const usersData: CreateUserDto[] = [
    {
      email: 'admin@gist.ac.kr',
      name: '관리자',
      nickname: 'admin',
      tel: '010-1234-5678',
      school: 'GIST',
      number: '2024001',
      password: adminPassword,
      isAdmin: true,
      verifyStatus: 'VERIFIED' as const,
    },
    // VERIFIED 사용자들
    {
      email: 'kim.student@gist.ac.kr',
      name: '김학생',
      nickname: 'student1',
      tel: '010-2345-6789',
      school: 'GIST',
      number: '2024002',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'VERIFIED' as const,
    },
    {
      email: 'lee.student@gist.ac.kr',
      name: '이연구',
      nickname: 'researcher1',
      tel: '010-3456-7890',
      school: 'GIST',
      number: '2024003',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'VERIFIED' as const,
    },
    // PENDING 사용자들
    {
      email: 'park.student@gist.ac.kr',
      name: '박학생',
      nickname: 'student2',
      tel: '010-4567-8901',
      school: 'GIST',
      number: '2024004',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'PENDING' as const,
    },
    {
      email: 'choi.student@gist.ac.kr',
      name: '최실험',
      nickname: 'experiment1',
      tel: '010-5678-9012',
      school: 'GIST',
      number: '2024005',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'PENDING' as const,
    },
    // NONE 사용자들
    {
      email: 'jung.student@gist.ac.kr',
      name: '정신입',
      nickname: 'newbie1',
      tel: '010-6789-0123',
      school: 'GIST',
      number: '2024006',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'NONE' as const,
    },
    {
      email: 'han.student@gist.ac.kr',
      name: '한프로젝트',
      nickname: 'project1',
      tel: '010-7890-1234',
      school: 'GIST',
      number: '2024007',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'NONE' as const,
    },
  ];

  console.log('👤 Creating users...');
  const users: User[] = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: userData,
    });
    users.push(user);
    console.log(`  ✅ Created user: ${user.name} (${user.email})`);
  }

  // Facilities data
  const facilitiesData = [
    {
      name: 'GIST 체육관',
      school: 'GIST',
      description: '농구, 배드민턴, 배구 등을 할 수 있는 종합 체육관입니다.',
      location: '학생회관 B1층',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T22:00:00Z'),
      isAvailable: true,
    },
    {
      name: '대회의실',
      school: 'GIST',
      description: '대형 세미나 및 학술회의를 위한 공간입니다.',
      location: '오룡관 3층',
      openTime: new Date('2024-01-01T09:00:00Z'),
      closeTime: new Date('2024-01-01T21:00:00Z'),
      isAvailable: true,
    },
    {
      name: '소회의실 A',
      school: 'GIST',
      description: '팀 프로젝트 및 소규모 미팅을 위한 공간입니다.',
      location: '도서관 4층',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T20:00:00Z'),
      isAvailable: true,
    },
    {
      name: '소회의실 B',
      school: 'GIST',
      description: '스터디룸으로 활용 가능한 소규모 회의실입니다.',
      location: '도서관 4층',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T20:00:00Z'),
      isAvailable: false,
    },
    {
      name: '메이커 스페이스',
      school: 'GIST',
      description: '3D 프린팅 및 프로토타입 제작을 위한 공간입니다.',
      location: '창업보육센터 1층',
      openTime: new Date('2024-01-01T09:00:00Z'),
      closeTime: new Date('2024-01-01T18:00:00Z'),
      isAvailable: true,
    },
  ];

  console.log('🏢 Creating facilities...');
  const facilities: Facility[] = [];
  for (const facilityData of facilitiesData) {
    const facility = await prisma.facility.create({
      data: facilityData,
    });
    facilities.push(facility);
    console.log(`  ✅ Created facility: ${facility.name}`);
  }

  // Facility Requests data
  const facilityRequestsData = [
    {
      userId: users[1].id, // 김학생
      facilityId: facilities[0].id, // GIST 체육관
      startTime: new Date('2024-01-15T14:00:00Z'),
      endTime: new Date('2024-01-15T16:00:00Z'),
    },
    {
      userId: users[2].id, // 이연구
      facilityId: facilities[1].id, // 대회의실
      startTime: new Date('2024-01-16T10:00:00Z'),
      endTime: new Date('2024-01-16T12:00:00Z'),
    },
    {
      userId: users[1].id, // 김학생
      facilityId: facilities[2].id, // 소회의실 A
      startTime: new Date('2024-01-17T15:00:00Z'),
      endTime: new Date('2024-01-17T17:00:00Z'),
    },
    {
      userId: users[3].id, // 박학생 (PENDING)
      facilityId: facilities[4].id, // 메이커 스페이스
      startTime: new Date('2024-01-18T13:00:00Z'),
      endTime: new Date('2024-01-18T15:00:00Z'),
    },
  ];

  console.log('📅 Creating facility requests...');
  for (const requestData of facilityRequestsData) {
    const request = await prisma.facilityRequest.create({
      data: requestData,
    });
    console.log(`  ✅ Created facility request: ID ${request.id}`);
  }

  // Equipment data
  const equipmentData = [
    {
      name: '고해상도 현미경',
      school: 'GIST',
      description: '생물학 연구용 고해상도 광학 현미경',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: '3D 프린터 (Ultimaker)',
      school: 'GIST',
      description: 'PLA, ABS 소재 지원 프로토타입 제작용 3D 프린터',
      isAvailable: true,
      isOccupied: true,
    },
    {
      name: 'PCR 장비',
      school: 'GIST',
      description: 'DNA 증폭을 위한 PCR (중합효소연쇄반응) 장비',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: '분광분석기',
      school: 'GIST',
      description: 'UV-Vis 분광분석기 (화학 성분 분석용)',
      isAvailable: false,
    },
    {
      name: '원심분리기',
      school: 'GIST',
      description: '고속 원심분리기 (최대 15000 rpm)',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: '오실로스코프',
      school: 'GIST',
      description: '전자공학 실험용 디지털 오실로스코프',
      isAvailable: true,
      isOccupied: false,
    },
  ];

  console.log('🔬 Creating equipment...');
  const equipment: Equipment[] = [];
  for (const equipData of equipmentData) {
    const equip = await prisma.equipment.create({
      data: equipData,
    });
    equipment.push(equip);
    console.log(`  ✅ Created equipment: ${equip.name}`);
  }

  // Equipment History data
  const equipmentHistoryData = [
    // 완료된 사용 기록들
    {
      userId: users[1].id, // 김학생
      equipmentId: equipment[0].id, // 고해상도 현미경
      createdAt: new Date('2024-01-10T09:00:00Z'),
      updatedAt: new Date('2024-01-10T11:30:00Z'), // 2.5시간 사용
    },
    {
      userId: users[2].id, // 이연구
      equipmentId: equipment[0].id, // 고해상도 현미경
      createdAt: new Date('2024-01-12T14:00:00Z'),
      updatedAt: new Date('2024-01-12T16:00:00Z'), // 2시간 사용
    },
    {
      userId: users[1].id, // 김학생
      equipmentId: equipment[2].id, // PCR 장비
      createdAt: new Date('2024-01-13T10:00:00Z'),
      updatedAt: new Date('2024-01-13T12:30:00Z'), // 2.5시간 사용
    },
    // 현재 사용 중인 기록 (createdAt = updatedAt)
    {
      userId: users[2].id, // 이연구
      equipmentId: equipment[1].id, // 3D 프린터
      createdAt: new Date('2024-01-15T13:00:00Z'),
      updatedAt: new Date('2024-01-15T13:00:00Z'), // 현재 사용 중
    },
    {
      userId: users[3].id, // 박학생 (PENDING)
      equipmentId: equipment[4].id, // 원심분리기
      createdAt: new Date('2024-01-14T15:00:00Z'),
      updatedAt: new Date('2024-01-14T17:00:00Z'), // 2시간 사용
    },
  ];

  console.log('📊 Creating equipment history...');
  for (const historyData of equipmentHistoryData) {
    const history = await prisma.equipmentHistory.create({
      data: historyData,
    });
    console.log(`  ✅ Created equipment history: ID ${history.id}`);
  }

  // Check Requests data
  const checkRequestsData = [
    {
      userId: users[1].id, // 김학생 (VERIFIED)
      dorm: 'GIST A동 101호',
      notes: '에어컨 작동 불량으로 인한 점검 요청',
      type: 'MAINTENANCE' as const,
      status: 'FIRST_CHECK' as const,
      checkAt: new Date('2024-01-20T10:00:00Z'),
    },
    {
      userId: users[2].id, // 이연구 (VERIFIED)
      dorm: 'GIST B동 205호',
      notes: '학회 참석으로 인한 1박 2일 외박',
      type: 'SINGLE_EXIT' as const,
      status: 'PASS' as const,
      checkAt: new Date('2024-01-18T15:00:00Z'),
    },
    {
      userId: users[3].id, // 박학생 (PENDING)
      dorm: 'GIST A동 303호',
      notes: '화장실 배수구 막힘',
      type: 'MAINTENANCE' as const,
      status: 'SECOND_CHECK' as const,
      checkAt: new Date('2024-01-22T14:00:00Z'),
    },
    {
      userId: users[4].id, // 최학부 (VERIFIED)
      dorm: 'GIST C동 150호',
      notes: '가족 방문으로 인한 3박 4일 외박',
      type: 'DOUBLE_EXIT' as const,
      status: 'PASS' as const,
      checkAt: new Date('2024-01-15T09:00:00Z'),
    },
    {
      userId: users[5].id, // 정대학원 (PENDING)
      dorm: 'GIST B동 108호',
      notes: '조명 교체 요청',
      type: 'MAINTENANCE' as const,
      status: 'FIRST_CHECK' as const,
      checkAt: new Date('2024-01-25T11:00:00Z'),
    },
  ];

  console.log('🏠 Creating check requests...');
  for (const checkData of checkRequestsData) {
    const checkRequest = await prisma.checkRequest.create({
      data: checkData,
    });
    console.log(`  ✅ Created check request: ${checkRequest.dorm}`);
  }

  // Storage Requests data
  const storageRequestsData = [
    {
      userId: users[1].id, // user1
      storage: '지하 보관창고',
      items: '겨울 이불, 코트',
      isStored: false,
      storeAt: new Date('2024-01-25T14:00:00Z'),
    },
    {
      userId: users[2].id, // user2
      storage: '개인 사물함',
      items: '책, 노트',
      isStored: true,
      storeAt: new Date('2024-01-10T11:00:00Z'),
    },
  ];

  console.log('📦 Creating storage requests...');
  for (const storageData of storageRequestsData) {
    const storageRequest = await prisma.storageRequest.create({
      data: storageData,
    });
    console.log(`  ✅ Created storage request: ${storageRequest.storage}`);
  }

  // Wikis data
  const wikisData = [
    {
      title: 'GIST 기숙사 생활 가이드',
      content:
        'GIST 기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다. 입실 규칙, 외박 신청 방법, 공용 시설 이용 안내 등을 포함합니다.',
      authorId: users[0].id, // 관리자
      school: 'GIST',
    },
    {
      title: 'GIST 식당 메뉴 및 운영시간',
      content:
        'GIST 내 식당들의 메뉴와 운영시간을 정리한 정보입니다. 학생식당, 교직원식당, 카페테리아별 정보를 확인하세요.',
      authorId: users[1].id, // 김학생
      school: 'GIST',
    },
    {
      title: '연구실 장비 사용법',
      content:
        '각 연구실별 공통 장비 사용법과 예약 시스템 이용 방법을 안내합니다. 현미경, PCR 장비, 3D 프린터 등의 사용법을 확인하세요.',
      authorId: users[2].id, // 이연구
      school: 'GIST',
    },
    {
      title: 'GIST 도서관 이용 안내',
      content:
        '중앙도서관, 전자정보관 이용 시간과 스터디룸 예약 방법, 도서 대출 규정 등을 안내합니다.',
      authorId: users[3].id, // 박학생
      school: 'GIST',
    },
    {
      title: '캠퍼스 셔틀버스 시간표',
      content:
        'GIST 캠퍼스와 광주시내를 연결하는 셔틀버스 시간표와 정류장 위치를 안내합니다.',
      authorId: users[4].id, // 최학부
      school: 'GIST',
    },
  ];

  console.log('📚 Creating wikis...');
  const wikis: Wiki[] = [];
  for (const wikiData of wikisData) {
    const wiki = await prisma.wiki.create({
      data: wikiData,
    });
    wikis.push(wiki);
    console.log(`  ✅ Created wiki: ${wiki.title}`);
  }

  // Wiki History data
  const wikiHistoryData = [
    {
      wikiId: wikis[0].id, // GIST 기숙사 생활 가이드
      editorId: users[1].id, // 김학생
      content:
        'GIST 기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다. 입실 규칙, 외박 신청 방법, 공용 시설 이용 안내, 세탁실 이용법 등을 포함합니다. (세탁실 정보 추가)',
      comment: '세탁실 이용 안내 추가',
    },
    {
      wikiId: wikis[1].id, // GIST 식당 메뉴 및 운영시간
      editorId: users[2].id, // 이연구
      content:
        'GIST 내 식당들의 메뉴와 운영시간을 정리한 정보입니다. 학생식당, 교직원식당, 카페테리아별 정보 및 최신 주간 메뉴를 확인하세요.',
      comment: '주간 메뉴 업데이트',
    },
    {
      wikiId: wikis[2].id, // 연구실 장비 사용법
      editorId: users[3].id, // 박학생
      content:
        '각 연구실별 공통 장비 사용법과 예약 시스템 이용 방법을 안내합니다. 현미경, PCR 장비, 3D 프린터, 원심분리기 등의 사용법을 확인하세요.',
      comment: '원심분리기 사용법 추가',
    },
  ];

  console.log('📝 Creating wiki history...');
  for (const historyData of wikiHistoryData) {
    const history = await prisma.wikiHistory.create({
      data: historyData,
    });
    console.log(`  ✅ Created wiki history: ID ${history.id}`);
  }

  // Notes data
  const notesData = [
    {
      authorId: users[1].id, // 김학생 (VERIFIED)
      title: '나노소재 합성 실험 결과',
      content:
        'CVD 방법을 이용한 그래핀 합성 실험 결과를 정리했습니다. 온도 조건별 품질 분석 포함.',
    },
    {
      authorId: users[2].id, // 이연구 (VERIFIED)
      title: '머신러닝 모델 성능 분석',
      content:
        '이미지 분류를 위한 CNN 모델의 하이퍼파라미터 튜닝 결과와 성능 개선 방안을 정리한 노트입니다.',
    },
    {
      authorId: users[3].id, // 박학생 (PENDING)
      title: '바이오센서 개발 아이디어',
      content:
        '글루코스 검출용 바이오센서 개발을 위한 초기 아이디어와 관련 논문 리뷰를 모았습니다.',
    },
    {
      authorId: users[4].id, // 최학부 (VERIFIED)
      title: '캡스톤 프로젝트 계획',
      content:
        'IoT 기반 스마트팜 시스템 개발 프로젝트 계획과 일정을 정리한 문서입니다.',
    },
    {
      authorId: users[5].id, // 정대학원 (PENDING)
      title: '양자역학 문제 풀이',
      content:
        '양자역학 과제 문제들의 풀이 과정과 핵심 개념 정리를 위한 개인 노트입니다.',
    },
  ];

  console.log('📒 Creating notes...');
  for (const noteData of notesData) {
    const note = await prisma.note.create({
      data: noteData,
    });
    console.log(`  ✅ Created note: ${note.title}`);
  }

  console.log('🎉 Seeding completed successfully!');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
