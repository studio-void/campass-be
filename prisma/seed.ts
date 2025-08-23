import { Equipment, Facility, PrismaClient, User, Wiki } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  console.log('🌱 Starting seed...');

  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  // Users data
  const usersData = [
    {
      email: 'admin@example.com',
      name: '관리자',
      nickname: 'admin',
      tel: '010-1234-5678',
      school: '한국대학교',
      number: '2024001',
      password: adminPassword,
      isAdmin: true,
      verifyStatus: 'VERIFIED' as const,
    },
    {
      email: 'user@example.com',
      name: '김학생',
      nickname: 'student1',
      tel: '010-2345-6789',
      school: '한국대학교',
      number: '2024002',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'NONE' as const,
    },
    {
      email: 'user2@example.com',
      name: '이학생',
      nickname: 'student2',
      tel: '010-3456-7890',
      school: '한국대학교',
      number: '2024003',
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
      name: '체육관',
      school: '한국대학교',
      description: '농구, 배드민턴 등을 할 수 있는 체육관입니다.',
      location: '학생회관 3층',
      openTime: new Date('2024-01-01T09:00:00Z'),
      closeTime: new Date('2024-01-01T22:00:00Z'),
      isAvailable: true,
    },
    {
      name: '세미나실',
      school: '한국대학교',
      description: '회의 및 세미나를 위한 공간입니다.',
      location: '도서관 5층',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T20:00:00Z'),
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
      userId: users[1].id, // user1
      facilityId: facilities[0].id, // facility1
      startTime: new Date('2024-01-15T14:00:00Z'),
      endTime: new Date('2024-01-15T16:00:00Z'),
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
      name: '현미경',
      school: '한국대학교',
      description: '연구용 고성능 현미경',
      isAvailable: true,
    },
    {
      name: '3D 프린터',
      school: '한국대학교',
      description: '프로토타입 제작용 3D 프린터',
      isAvailable: false,
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
    {
      userId: users[1].id, // user1
      equipmentId: equipment[0].id, // equipment1
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
      userId: users[1].id, // user1
      dorm: 'A동 101호',
      notes: '에어컨 점검 요청',
      type: 'MAINTENANCE' as const,
      status: 'FIRST_CHECK' as const,
      checkAt: new Date('2024-01-20T10:00:00Z'),
    },
    {
      userId: users[2].id, // user2
      dorm: 'B동 205호',
      type: 'SINGLE_EXIT' as const,
      status: 'PASS' as const,
      checkAt: new Date('2024-01-18T15:00:00Z'),
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
      title: '기숙사 생활 가이드',
      content:
        '기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다.',
      authorId: users[0].id, // admin
      school: '한국대학교',
    },
    {
      title: '학식 메뉴 추천',
      content: '맛있는 학식 메뉴와 시간대별 추천사항을 정리했습니다.',
      authorId: users[1].id, // user1
      school: '한국대학교',
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
      wikiId: wikis[0].id, // wiki1
      editorId: users[1].id, // user1
      content:
        '기숙사에서 생활할 때 알아야 할 기본적인 정보들을 정리한 위키입니다. (수정됨)',
      comment: '오타 수정',
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
      authorId: users[1].id, // user1
      title: '실험 결과 정리',
      content: '오늘 진행한 화학 실험의 결과를 정리한 내용입니다.',
    },
    {
      authorId: users[2].id, // user2
      title: '프로젝트 아이디어',
      content: '다음 학기 프로젝트를 위한 아이디어들을 모아둔 노트입니다.',
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
