# Maple Backend - 이벤트 보상 시스템

메이플스토리 이벤트 보상 시스템 과제입니다.  
NestJS 기반 Monorepo 구조로 Auth / Event 서비스를 분리하여 구축했습니다.  
JWT 인증, MongoDB, Swagger, Docker 기반으로 설계 및 단위 테스트까지 구현했습니다.

## 설계 및 구현 설명

### 이벤트-보상 설계 이유

- 이벤트와 보상을 1:N 관계로 분리하여 재사용성을 높이고, 관리 편의성을 확보했습니다.

### 인증 및 권한 설계

- JWT 인증을 통해 사용자 인증을 처리하며, 역할 기반 접근 제어(RBAC)로 기능을 분리했습니다.
- 초기 설계에서는 DB 기반의 역할 분리 및 동적 관리를 고려했으나,이번 과제에서는 이벤트 수가 많지 않고 사용자가 제한적이라는 점을 감안하여,유저 생성 시 수동으로 역할을 설정하는 방식으로 구현했습니다.

### 보상 조건 검증 방식

- 조건은 동적으로 처리 가능하도록 MongoDB 컬렉션에 저장하며, 사용자 요청 시 조건 충족 여부를 체크합니다.

### 구현 중 고민한 점

- 보상 중복 요청을 어떻게 막을 것인지 고민하다가, 사용자 이메일 + 이벤트 ID 조합으로 고유 요청을 생성하도록 처리했습니다.
- 설계상 Gateway Server를 통해 모든 요청을 수신하고 인증·인가·라우팅까지 담당하는 구조를 고려했지만, Auth 및 Event 서버 위주로 구현했습니다.
- Swagger UI를 활용하여 API 요청 흐름을 수동으로 확인하였습니다.

---

## 실행 방법

### 1. 환경 변수 설정

# .env 파일 예시

PORT=3002
MONGO_URI=mongodb://localhost:27017/event
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s

# 2. 의존성 설치

yarn install

# [옵션 A] Docker로 전체 실행

docker-compose up --build

# [옵션 B] 로컬 Nest 서비스 직접 실행

# auth 서비스

yarn start auth

# event 서비스

yarn start event

## 기술 스택

- **NestJS** (Monorepo, MSA 구조)
- **MongoDB** (Mongoose ODM)
- **JWT 인증** (Passport, Guard)
- **Swagger** (API 문서 자동화)
- **Docker / docker-compose** (배포 환경)

### 3. Swagger 문서 주소

- Auth 서비스: http://localhost:3001/api
- Event 서비스: http://localhost:3002/api

---

## 프로젝트 구조

maple-backend/

├── apps/

│ ├── auth/ # 인증 서비스 (회원가입, 로그인, JWT 발급)

│ │ ├── docker/ # Dockerfile, docker-compose 설정

│ │ ├── .env # 환경 변수 설정

│ └── event/ # 이벤트 서비스 (이벤트, 보상, 유저 요청)

│ │ ├── docker/ # Dockerfile, docker-compose 설정

│ │ ├── .env # 환경 변수 설정

├── libs/ # 공통 모듈 및 유틸리티

└── README.md # 프로젝트 설명서 (본 파일)

---

## 서비스 설명

### Auth Service

- 회원가입, 로그인 기능
- JWT 토큰 발급 및 검증 전략

### Event Service

- 이벤트 등록 / 조회
- 보상 등록 / 조회
- 유저 보상 요청 (중복 방지, 상태 기록)
- 유저 요청 내역 조회
- JWT 토큰 발급 및 검증 전략

---

## API 사용 흐름 예시

### 1. 회원가입 (공통)

POST /auth/register
{
"email": "user@example.com",
"password": "user1234",
"role": "USER"
}

### 2. 로그인

POST /auth/login
{
"email": "user@example.com",
"password": "user1234"
}
-> 응답의 access_token을 이후 모든 API 요청에 Bearer로 사용

### 3. 이벤트 등록 (관리자/운영자)

POST /events
Authorization: Bearer <access_token>
{
"name": "출석 이벤트",
"description": "3일 연속 로그인 시 지급",
"condition": "login_3_days",
"startDate": "2025-05-01T00:00:00Z",
"endDate": "2025-06-01T23:59:59Z",
"isActive": true
}

### 4. 보상 등록 (이벤트명 기반, 관리자/운영자)

POST /rewards
Authorization: Bearer <access_token>
{
"name": "100 포인트",
"quantity": 100,
"eventName": "출석 이벤트"
}
동일 이벤트에 중복된 보상이 등록되면 409 Conflict 발생

### 5. 보상 조건 충족 여부 등록 (감사자/관리자)

POST /reward-condition
Authorization: Bearer <access_token>
{
"userEmail": "user@example.com",
"rewardName": "100 포인트",
"isSatisfied": true
}

### 6. 보상 요청 (유저)

POST /reward-requests
Authorization: Bearer <access_token>
{
"eventName": "출석 이벤트",
"rewardName": "100 포인트"
}
조건 미충족/중복 요청 시 → FAILED
조건 충족 시 → SUCCESS

### 7. 요청 내역 조회

유저 본인 요청 이력
GET /reward-requests/me
Authorization: Bearer <access_token>

### 관리자/감사자 전체 조회

GET /reward-requests?eventName=출석 이벤트&status=SUCCESS
Authorization: Bearer <access_token>

---

# AuthService 단위 테스트 항목

1. 회원가입(register)

- 비밀번호 해싱 후 사용자 등록 성공 케이스
- 사용자 등록 실패 예외 처리 케이스

2. 로그인(validateUser)

- 이메일/비밀번호/역할 일치 시 정상 반환
- 비밀번호 불일치 시 UnauthorizedException
- 역할 불일치 시 예외 메시지 확인

3. JWT 토큰 발급(login)

- 유저 객체로 JWT 토큰 생성 반환

4. 실행

- npx jest apps/auth/src/auth.service.spec.ts

# RewardService 단위 테스트 항목

1. 보상 등록 (rewards)

- ADMIN, OPERATOR 역할인 경우 등록 성공
- USER 역할일 경우 ForbiddenException 발생

2. 전체 보상 목록 조회 (rewards)

- ADMIN, AUDITOR는 목록 조회 가능
- USER는 ForbiddenException 발생

3. 보상 이름으로 조회 (/rewards/:name)

- ADMIN, AUDITOR는 조회 가능
- USER는 ForbiddenException 발생

4. 실행

- npx jest apps/event/src/rewards/rewards.controller.spec.ts

---
