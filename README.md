# Campus Management Backend

캠퍼스 관리 시스템을 위한 NestJS 백엔드 API 서버입니다.

## 주요 기능

- **인증/인가**: JWT 기반 인증, 역할별 접근 제어 (관리자/일반사용자)
- **사용자 관리**: 회원가입, 인증 대기, 관리자 승인 시스템
- **위키**: 학교별 위키 시스템 (작성/수정/삭제)
- **시설 관리**: 체육관, 세미나실 등 시설 예약 시스템
- **연구 지원**: 연구 장비 사용 관리, 개인 연구 노트
- **기숙사**: 점검 요청, 물품 보관 신청 관리

## 기술 스택

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Role-based Access Control
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Password Hashing**: bcrypt

## 빠른 시작

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
DATABASE_URL="postgresql://username:password@localhost:5432/campass"
JWT_SECRET="your-secret-key"
```

### 2. 데이터베이스 설정

```bash
# 데이터베이스 마이그레이션
npx prisma migrate dev

# 테스트 데이터 생성
npx prisma db seed
```

### 3. 서버 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

서버가 실행되면 http://localhost:3000/api 에서 Swagger 문서를 확인할 수 있습니다.

## 테스트 계정

시드 데이터를 통해 다음 테스트 계정들이 생성됩니다:

### 관리자 계정

- **이메일**: `admin@example.com`
- **비밀번호**: `admin1234`
- **권한**: 모든 리소스 관리, 사용자 승인/거부

### 일반 사용자 계정

- **이메일**: `user@example.com`
- **비밀번호**: `user1234`
- **상태**: 승인됨 (VERIFIED)

### 인증 대기 계정

- **이메일**: `user2@example.com`
- **비밀번호**: `user1234`
- **상태**: 인증 대기 중 (PENDING)

## API 사용법

### 1. 로그인

```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin1234"
}
```

### 2. JWT 토큰 사용

응답으로 받은 `access_token`을 Authorization 헤더에 포함:

```
Authorization: Bearer <your-access-token>
```

### 3. 주요 API 엔드포인트

- **인증**: `/auth` - 로그인/로그아웃
- **사용자**: `/user` - 회원가입, 정보 수정, 인증 관리
- **위키**: `/wiki` - 위키 CRUD
- **시설**: `/facility` - 시설 조회 및 예약
- **연구**: `/research` - 장비 관리, 노트 작성
- **기숙사**: `/dorm` - 점검/보관 요청 관리

## 개발자 가이드

### 프로젝트 구조

```
src/
├── auth/          # JWT 인증, 가드
├── user/          # 사용자 관리
├── wiki/          # 위키 시스템
├── facility/      # 시설 관리
├── research/      # 연구 지원
├── dorm/          # 기숙사 관리
└── prisma/        # 데이터베이스 연결
```

### 데이터베이스 스키마 수정

```bash
# 스키마 파일 수정 후
npx prisma db push       # 개발용 (즉시 적용)
npx prisma migrate dev   # 프로덕션용 (마이그레이션 파일 생성)
```

### 새로운 기능 추가

1. DTO 클래스에 `@ApiProperty` 데코레이터로 Swagger 문서화
2. 서비스 클래스에 비즈니스 로직 구현
3. 컨트롤러에 `@ApiOperation`, `@ApiResponse` 추가
4. 필요시 가드(`@Roles('admin')`) 적용

## API 문서

서버 실행 후 http://localhost:3000/api 에서 상세한 API 문서를 확인할 수 있습니다.

모든 API는 실제 시드 데이터를 기반으로 한 예시가 포함되어 있어 바로 테스트해볼 수 있습니다.
