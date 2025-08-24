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
      name: 'Admin',
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
      email: 'john.doe@gm.gist.ac.kr',
      name: 'John Doe',
      nickname: 'Doe',
      tel: '010-2345-6789',
      school: 'GIST',
      number: '2024002',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'VERIFIED' as const,
    },
    {
      email: 'john.appleseed@gm.gist.ac.kr',
      name: 'John Appleseed',
      nickname: 'Seed',
      tel: '010-3456-7890',
      school: 'GIST',
      number: '2024003',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'VERIFIED' as const,
    },
    // PENDING 사용자들
    {
      email: 'cindy@gm.gist.ac.kr',
      name: 'Cindy',
      nickname: 'student2',
      tel: '010-4567-8901',
      school: 'GIST',
      number: '2024004',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'PENDING' as const,
    },
    {
      email: 'kiara@gm.gist.ac.kr',
      name: 'Kiara Choi',
      nickname: 'experiment1',
      tel: '010-5678-9012',
      school: 'GIST',
      number: '2024005',
      password: userPassword,
      isAdmin: true,
      verifyStatus: 'PENDING' as const,
    },
    // NONE 사용자들
    {
      email: 'upstage@gist.ac.kr',
      name: 'Kim Upstage',
      nickname: 'upstage',
      tel: '010-6789-0123',
      school: 'GIST',
      number: '2024006',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'NONE' as const,
    },
    {
      email: 'jyles@gist.ac.kr',
      name: 'Jyles Hwang',
      nickname: 'project1',
      tel: '010-7890-1234',
      school: 'GIST',
      number: '2024007',
      password: userPassword,
      isAdmin: true,
      verifyStatus: 'NONE' as const,
    },
    {
      email: 'hoony6134@gm.gist.ac.kr',
      name: 'JeongHoon Lim',
      nickname: 'Cyan',
      tel: '010-4255-6134',
      school: 'GIST',
      number: '20255182',
      password: userPassword,
      isAdmin: false,
      verifyStatus: 'NONE' as const,
    },
    {
      email: 'rhseungg@gm.gist.ac.kr',
      name: 'Hyunseung Ryu',
      nickname: 'Rhseung',
      tel: '010-4663-3354',
      school: 'GIST',
      number: '20255070',
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
      name: 'GIST Gym',
      school: 'GIST',
      description: 'Gym for sports activities and fitness training.',
      location: 'Student Union Building 2F',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T22:00:00Z'),
      isAvailable: true,
    },
    {
      name: 'GIST Conference Room',
      school: 'GIST',
      description: 'Space for large seminars and academic conferences.',
      location: 'Oryong Hall 3F',
      openTime: new Date('2024-01-01T09:00:00Z'),
      closeTime: new Date('2024-01-01T21:00:00Z'),
      isAvailable: true,
    },
    {
      name: 'Conference Room A',
      school: 'GIST',
      description: 'Space for team projects and small meetings.',
      location: 'Central Library 4F',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T20:00:00Z'),
      isAvailable: true,
    },
    {
      name: 'Conference Room B',
      school: 'GIST',
      description: 'Space for team projects and small meetings.',
      location: 'Central Library 4F',
      openTime: new Date('2024-01-01T08:00:00Z'),
      closeTime: new Date('2024-01-01T20:00:00Z'),
      isAvailable: false,
    },
    {
      name: 'Maker Space',
      school: 'GIST',
      description: 'Space for 3D printing and maker education.',
      location: 'Start-up Center 1F',
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
      name: 'High-Resolution Microscope',
      school: 'GIST',
      description:
        'High-resolution optical microscope for biological research.',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: '3D Printer (Ultimaker)',
      school: 'GIST',
      description:
        '3D printer supporting PLA and ABS materials for prototyping.',
      isAvailable: true,
      isOccupied: true,
    },
    {
      name: 'PCR Machine',
      school: 'GIST',
      description:
        'DNA amplification PCR (Polymerase Chain Reaction) equipment.',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: 'Spectrophotometer',
      school: 'GIST',
      description: 'UV-Vis spectrophotometer for chemical analysis.',
      isAvailable: false,
    },
    {
      name: 'Centrifuge',
      school: 'GIST',
      description: 'High-speed centrifuge (up to 15000 rpm)',
      isAvailable: true,
      isOccupied: false,
    },
    {
      name: 'Oscilloscope',
      school: 'GIST',
      description: 'Digital oscilloscope for electronics experiments.',
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
      dorm: 'GIST A101',
      notes: 'Maintenance request due to air conditioner malfunction',
      type: 'MAINTENANCE' as const,
      status: 'FIRST_CHECK' as const,
      checkAt: new Date('2024-01-20T10:00:00Z'),
    },
    {
      userId: users[2].id, // 이연구 (VERIFIED)
      dorm: 'GIST B205',
      type: 'SINGLE_EXIT' as const,
      status: 'PASS' as const,
      checkAt: new Date('2024-01-18T15:00:00Z'),
    },
    {
      userId: users[3].id, // 박학생 (PENDING)
      dorm: 'GIST A303',
      notes: 'Restroom maintenance request',
      type: 'MAINTENANCE' as const,
      status: 'SECOND_CHECK' as const,
      checkAt: new Date('2024-01-22T14:00:00Z'),
    },
    {
      userId: users[4].id, // 최학부 (VERIFIED)
      dorm: 'GIST C150',
      type: 'DOUBLE_EXIT' as const,
      status: 'PASS' as const,
      checkAt: new Date('2024-01-15T09:00:00Z'),
    },
    {
      userId: users[5].id, // 정대학원 (PENDING)
      dorm: 'GIST B108',
      notes: 'LED Change Request',
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
      storage: 'B1F Storage',
      items: 'Winter blanket, coat',
      isStored: false,
      storeAt: new Date('2024-01-25T14:00:00Z'),
    },
    {
      userId: users[2].id, // user2
      storage: 'Building B, 4F',
      items: 'Books, notes',
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
      title: 'About GIST Library',
      content: `## Library Operating Hours

| Division      | Operating Hours     | Extended Hours During Exam Period |
|---------------|---------------------|-----------------------------------|
| LG Library    | 09:00 ~ 21:00       | -                                 |
| Central Library | 08:00 ~ 24:00     | 08:00 ~ 02:00 (next day)          |

- **Extended Hours**: From one week before the exam period until Thursday of the exam week  
- **Closed Days**: New Year’s Day, Lunar New Year holidays, Chuseok holidays  

---

## LG Library
- LG Library is a **stack-centered facility** where users can borrow and return materials.  
- A **Family Reading Room** is available to support early childhood and children’s education.  

---

## Central Library
- The Central Library offers **high-quality IT infrastructure**, including a desktop virtualization system and cloud system, as well as learning and relaxation spaces.  
- Users can utilize **Thin Client PCs** for searching and multimedia.  
- The library provides **44 diverse rooms** such as a small theater, exhibition room, individual reading rooms, and group study rooms for learning, discussion, and presentations.  
  - Rooms can be reserved via:  
    - **PC**: [https://library.gist.ac.kr](https://library.gist.ac.kr)  
    - **Mobile**: [https://library.gist.ac.kr/m-index.html](https://library.gist.ac.kr/m-index.html)  
- To maintain a quiet atmosphere, **general reading rooms** and **laptop reading rooms** are operated separately.  `,
      authorId: users[0].id, // 관리자
      school: 'GIST',
    },
    {
      title: 'About GIST Cafeteria',
      content: `We have organized information about GIST restaurants here.
## Student Union Building II (제2학생회관)
- Student Cafeteria
- Breakfast: 8:00 AM – 9:00 AM
- Lunch: 11:30 AM – 1:30 PM
- Dinner: 5:00 PM – 6:30 PM
- Only this cafeteria operates on weekends.
- Price:
 - Breakfast: ₩1,000 (₩5,300 for non-students, student ID required)
 - Lunch: ₩5,500 (buffet or set meal)
 - Dinner: ₩5,500 (self-serve)
## Student Union Café (inside Student Cafeteria)
- Weekdays: 8:30 AM – 6:30 PM
- Closed during lunch break: 1:30 PM – 2:00 PM
- Closed on weekends and public holidays

## Student Union Building I (제1학생회관)
- Student Cafeteria
 - Breakfast: 8:00 AM – 9:00 AM (Weekdays only)
 - Lunch: 11:30 AM – 1:30 PM (Weekdays only)
 - Dinner: 5:00 PM – 6:30 PM (Weekdays only)
- Lunch is served buffet-style
- Same breakfast price as Student Union Building II
- “RakRak” Dining Hall
- Student Dining Hall: 10:00 AM – 7:00 PM
- Faculty Dining Hall (Self-service): 11:30 AM – 1:00 PM
- Closed on weekends and public holidays`,
      authorId: users[1].id, // 김학생
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
  const wikiHistoryData = [];

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
