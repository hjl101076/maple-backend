# Maple Backend - 이벤트 보상 시스템

메이플스토리 이벤트 보상 시스템 과제입니다.  
NestJS 기반 Monorepo 구조로 Auth / Event 서비스를 분리하여 구축했습니다.  
JWT 인증, MongoDB, Swagger, Docker 기반으로 구성했습니다.

---

# 1. 저장소 클론

git clone https://github.com/hjl101076/maple-backend.git
cd maple-backend

# 2. 의존성 설치

yarn install

# auth 서비스

cd apps/auth
yarn start:dev

# event 서비스

cd apps/event
yarn start:dev

## 기술 스택

- **NestJS** (Monorepo, MSA 구조)
- **MongoDB** (Mongoose ODM)
- **JWT 인증** (Passport, Guard)
- **Swagger** (API 문서 자동화)
- **Docker / docker-compose** (배포 환경)

---

## 프로젝트 구조

## <pre> `bash maple-backend/ ├── apps/ │ ├── auth/ # 인증 서비스 (회원가입, 로그인, JWT 발급) │ │ ├── docker/ # Dockerfile, docker-compose 설정 │ └── event/ # 이벤트 서비스 (이벤트, 보상, 유저 요청) │ ├── docker/ # Dockerfile, docker-compose 설정 ├── libs/ # 공통 모듈 및 유틸리티 ├── .env # 환경 변수 설정 └── README.md # 프로젝트 설명서 (본 파일) ` </pre>

## 서비스 설명

### Auth Service

- 회원가입, 로그인 기능
- JWT 토큰 발급 및 검증 전략
- Swagger API 문서 제공

### Event Service

- 이벤트 등록 / 조회
- 보상 등록 / 조회
- 유저 보상 요청 (중복 방지, 상태 기록)
- 유저 요청 내역 조회
- JWT 토큰 발급 및 검증 전략

---

## 실행 방법

### 1. 환경 변수 설정

# .env 파일 예시

PORT=3002
MONGO_URI=mongodb://localhost:27017/event
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s

### 2. Docker 실행

docker-compose up --build

### 3. Swagger 문서 주소

- Auth 서비스: http://localhost:3001/api
- Event 서비스: http://localhost:3002/api

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
