# 광고 상품 구매 서비스

광고 상품을 계약하고, 계약 내역을 조회할 수 있는 광고 상품 구매 서비스입니다.

## 기술 스택

### Frontend
- **Framework**: Next.js 14.0.0
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.5
- **Library**: React 18.2.0

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17+
- **ORM**: Spring Data JPA
- **Database**: H2 Database (In-Memory)
- **Build Tool**: Maven
- **Library**: Lombok

## 프로젝트 구조

```
advertising-platform/
├── frontend/                    # Next.js Frontend
│   ├── app/                    # Next.js App Router
│   ├── src/
│   │   ├── types/              # TypeScript 타입 정의
│   │   │   └── error.ts        # ErrorResponse 타입
│   │   └── lib/
│   │       └── api/            # API 클라이언트 및 에러 처리
│   ├── components/             # React 컴포넌트
│   ├── public/                 # 정적 파일
│   ├── tailwind.config.ts      # Tailwind 설정
│   ├── tsconfig.json           # TypeScript 설정
│   └── package.json
│
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/advertising/
│   │   │   │   ├── AdvertisingPlatformApplication.java
│   │   │   │   ├── common/     # 공통 모듈
│   │   │   │   │   ├── config/         # 설정 클래스
│   │   │   │   │   └── exception/      # 예외 처리 및 ErrorResponse
│   │   │   │   ├── domain/     # 도메인 모듈
│   │   │   │   │   ├── entity/         # 엔티티 (Product, Company, Contract)
│   │   │   │   │   ├── enums/          # 열거형 (ContractStatus)
│   │   │   │   │   └── repository/     # 리포지토리
│   │   │   │   ├── application/        # 애플리케이션 모듈
│   │   │   │   │   ├── dto/            # DTO
│   │   │   │   │   └── service/        # 비즈니스 로직
│   │   │   │   └── presentation/       # 프레젠테이션 모듈
│   │   │   │       └── controller/     # REST 컨트롤러
│   │   │   └── resources/
│   │   │       ├── application.yml      # 설정 파일
│   │   │       └── data.sql            # 초기 데이터
│   │   └── test/               # 테스트 코드
│   └── pom.xml
│
└── README.md                   # 프로젝트 문서
```

## 실행 방법

### 사전 요구사항
- **Frontend**: Node.js 18 이상, npm 또는 yarn
- **Backend**: JDK 17 이상, Maven 3.6 이상

### Backend 실행

1. Backend 디렉토리로 이동
```bash
cd backend
```

2. Maven을 사용하여 의존성 설치 및 실행
```bash
mvn spring-boot:run
```

서버가 시작되면 `http://localhost:8080/api`에서 API를 사용할 수 있습니다.

**H2 Console 접속**:
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:advertisingdb`
- Username: `sa`
- Password: (비워두기)

### Frontend 실행

1. Frontend 디렉토리로 이동
```bash
cd frontend
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

개발 서버가 시작되면 `http://localhost:3000`에서 애플리케이션을 확인할 수 있습니다.

### 환경 변수 설정 (Frontend)

Frontend 디렉토리에 `.env.local` 파일을 생성하여 API 베이스 URL을 설정할 수 있습니다:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 공통 에러 응답 규격

Frontend와 Backend 간 통신 시 사용하는 공통 에러 응답 규격입니다.

### JSON 구조

```json
{
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "details": {
    "field1": "필드별 에러 메시지",
    "field2": ["에러 메시지 1", "에러 메시지 2"]
  },
  "timestamp": "2026-01-24T10:00:00",
  "status": 400
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `code` | string | 필수 | 에러 코드 (예: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR") |
| `message` | string | 필수 | 에러 메시지 |
| `details` | object | 선택 | 상세 에러 정보 (필드별 검증 오류 등) |
| `timestamp` | string | 필수 | 에러 발생 시각 (ISO 8601 형식) |
| `status` | number | 필수 | HTTP 상태 코드 |

### 에러 코드 예시

- `VALIDATION_ERROR`: 입력값 검증 실패
- `BAD_REQUEST`: 잘못된 요청
- `NOT_FOUND`: 리소스를 찾을 수 없음
- `INTERNAL_ERROR`: 서버 내부 오류

### 사용 예시

**Backend (Java)**:
```java
ErrorResponse errorResponse = ErrorResponse.builder()
    .code("VALIDATION_ERROR")
    .message("입력값 검증에 실패했습니다.")
    .details(Map.of("amount", "계약 금액은 최소 10,000원 이상이어야 합니다."))
    .timestamp(LocalDateTime.now())
    .status(HttpStatus.BAD_REQUEST.value())
    .build();
```

**Frontend (TypeScript)**:
```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string | string[]>;
  timestamp: string;
  status: number;
}
```

## API 엔드포인트

### 상품 조회
- `GET /api/products` - 전체 상품 조회
- `GET /api/products/{id}` - 상품 상세 조회

### 업체 조회
- `GET /api/companies` - 전체 업체 조회
- `GET /api/companies/search?keyword={keyword}` - 업체 검색 (자동완성)
- `GET /api/companies/{id}` - 업체 상세 조회

### 계약
- `POST /api/contracts` - 계약 생성
  ```json
  {
    "companyId": 1,
    "productId": 1,
    "startDate": "2026-01-25",
    "endDate": "2026-02-22",
    "amount": 100000
  }
  ```
- `GET /api/contracts/{id}` - 계약 상세 조회
- `GET /api/contracts?companyName={name}&statuses={status}&startDate={date}&endDate={date}&page={page}&size={size}` - 계약 목록 조회 (페이징)

## 가정 사항

### 초기 업체 데이터

다음 업체 정보는 데이터베이스에 초기 데이터로 등록되어 있습니다:

| 업체번호 | 업체명 | 업체 유형 |
|---------|--------|----------|
| 10001 | 놀유니버스 그랜드 호텔 | 호텔 |
| 10002 | 놀유니버스 시티 호텔 강남 | 호텔 |
| 10003 | 놀유니버스 오션뷰 호텔 | 호텔 |
| 10004 | 포레스트 강남 펜션 | 펜션 |
| 10005 | 포레스트 서초 펜션 | 펜션 |
| 10006 | 포레스트 구로 펜션 | 펜션 |

### 초기 상품 정보

다음 광고 상품 정보는 데이터베이스에 초기 데이터로 등록되어 있습니다:

- **상품명**: 노출 보장형 광고
- **상품설명**: 고객이 활발하게 탐색하는 지면에 최적화되어 숙소가 유동적으로 노출됩니다.

### 기타 가정 사항

1. **계약 번호 생성 규칙**: `CNT-{YYYYMMDD}-{순번}` 형식으로 자동 생성됩니다.
2. **계약 상태 자동 결정**:
   - 계약 시작일이 오늘 이후인 경우: `집행전` (PENDING)
   - 계약 시작일이 오늘인 경우: `진행중` (IN_PROGRESS)
3. **계약 금액 제한**: 최소 10,000원, 최대 1,000,000원
4. **계약 기간 제한**: 계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다.
5. **페이징 기본값**: 페이지당 5건 (최대 5건)

## 테스트 방법

### Backend 테스트
```bash
cd backend
mvn test
```

### Frontend 테스트
```bash
cd frontend
npm run test
```

## 설계 및 구현 설명

### 아키텍처

본 프로젝트는 **계층형 아키텍처(Layered Architecture)**를 따릅니다:

1. **Presentation Layer**: REST API 컨트롤러
2. **Application Layer**: 비즈니스 로직 및 DTO
3. **Domain Layer**: 엔티티, 리포지토리, 도메인 로직
4. **Infrastructure Layer**: 데이터베이스, 외부 서비스 연동

### 주요 설계 원칙

- **단일 책임 원칙 (SRP)**: 각 클래스는 하나의 책임만 가집니다.
- **의존성 역전 원칙 (DIP)**: 인터페이스를 통한 의존성 주입
- **관심사의 분리**: 각 계층은 명확한 역할을 가집니다.

### 데이터베이스 설계

- **Product**: 광고 상품 정보
- **Company**: 업체 정보
- **Contract**: 광고 계약 정보 (Product, Company와 다대일 관계)

## 개선 및 제약 사항

### 구현 완료 사항
- ✅ 기본 CRUD API 구현
- ✅ 공통 에러 응답 규격 정의 및 구현
- ✅ 계약 생성 시 검증 로직 구현
- ✅ 페이징 기능 구현
- ✅ 업체 검색 (자동완성) 기능 구현

### 향후 개선 사항
- [ ] 계약 상태 자동 업데이트 (스케줄러)
- [ ] 계약 취소 기능 구현
- [ ] 인증/인가 기능 추가
- [ ] 로깅 및 모니터링 강화
- [ ] 단위 테스트 및 통합 테스트 보완
- [ ] API 문서화 (Swagger/OpenAPI)
- [ ] 프론트엔드 페이지 구현 (광고 상품 선택, 계약, 상세, 목록)
- [ ] 에러 바운더리 및 사용자 친화적 에러 메시지

### 제약 사항
- 현재는 H2 In-Memory 데이터베이스를 사용하여 서버 재시작 시 데이터가 초기화됩니다.
- 인증/인가 기능이 구현되지 않아 모든 API가 공개되어 있습니다.
- 프론트엔드 페이지는 기본 구조만 생성되어 있으며, 실제 화면 구현은 추가 작업이 필요합니다.

## 라이선스

이 프로젝트는 과제용으로 작성되었습니다.
