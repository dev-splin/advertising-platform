# Backend - 광고 상품 구매 서비스

## 기술 스택
- Java 17+
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (In-Memory)
- Maven
- Lombok

## 실행 방법

### 사전 요구사항
- JDK 17 이상
- Maven 3.6 이상

### 실행
```bash
cd backend
mvn spring-boot:run
```

서버가 시작되면 `http://localhost:8080/api`에서 API를 사용할 수 있습니다.

### H2 Console 접속
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:advertisingdb`
- Username: `sa`
- Password: (비워두기)

## 프로젝트 구조
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/advertising/
│   │   │   ├── AdvertisingPlatformApplication.java
│   │   │   ├── common/
│   │   │   │   ├── config/          # 설정 클래스
│   │   │   │   └── exception/        # 예외 처리 및 ErrorResponse
│   │   │   ├── domain/
│   │   │   │   ├── entity/          # 엔티티
│   │   │   │   ├── enums/            # 열거형
│   │   │   │   └── repository/       # 리포지토리
│   │   │   ├── application/
│   │   │   │   ├── dto/              # DTO
│   │   │   │   └── service/          # 비즈니스 로직
│   │   │   └── presentation/
│   │   │       └── controller/       # REST 컨트롤러
│   │   └── resources/
│   │       ├── application.yml       # 설정 파일
│   │       └── data.sql              # 초기 데이터
│   └── test/
│       └── java/                     # 테스트 코드
└── pom.xml
```

## API 엔드포인트

### 상품 조회
- `GET /api/products` - 전체 상품 조회
- `GET /api/products/{id}` - 상품 상세 조회

### 업체 조회
- `GET /api/companies` - 전체 업체 조회
- `GET /api/companies/search?keyword={keyword}` - 업체 검색
- `GET /api/companies/{id}` - 업체 상세 조회

### 계약
- `POST /api/contracts` - 계약 생성
- `GET /api/contracts/{id}` - 계약 상세 조회
- `GET /api/contracts` - 계약 목록 조회 (페이징)

## 에러 응답 규격

모든 에러 응답은 다음 JSON 형식을 따릅니다:

```json
{
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "details": {
    "field1": "필드별 에러 메시지"
  },
  "timestamp": "2026-01-24T10:00:00",
  "status": 400
}
```

### 필드 설명
- `code`: 에러 코드 (예: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR")
- `message`: 에러 메시지
- `details`: 상세 에러 정보 (필드별 검증 오류 등, 선택적)
- `timestamp`: 에러 발생 시각
- `status`: HTTP 상태 코드

## 테스트 실행

### 전체 테스트 실행
```bash
cd backend
mvn test
```

### 특정 테스트 클래스 실행
```bash
mvn test -Dtest=ContractServiceTest
```

### 테스트 커버리지 확인
```bash
mvn test
```

테스트 실행 후 커버리지 리포트가 자동으로 생성됩니다:
- 리포트 위치: `target/site/jacoco/index.html`
- 브라우저에서 열어서 확인할 수 있습니다.

또는 직접 리포트만 생성:
```bash
mvn jacoco:report
```

## 구현된 주요 기능

### 1. 도메인 모델
- **Contract**: 계약 엔티티에 비즈니스 로직 메서드 포함
  - `isValidPeriod()`: 계약 기간 검증 (최소 28일)
  - `isValidAmount()`: 계약 금액 검증 (10,000원 ~ 1,000,000원)
  - `updateStatus()`: 계약 상태 자동 업데이트
  - `cancel()`: 계약 취소

### 2. 비즈니스 로직
- 계약 유효성 검사
  - 시작일은 오늘 이후
  - 종료일은 시작일 + 28일 이후
  - 금액 범위: 10,000원 ~ 1,000,000원
- 중복 요청 방지
  - 동일한 계약 요청이 5초 이내에 중복 생성되는 것을 방지

### 3. API 기능
- 업체 조회 (키워드 자동완성)
  - 최대 20개 결과 반환
  - 빈 키워드 처리
- 계약 목록 조회
  - 페이징 (기본 5개, 최대 100개)
  - 업체명, 상태, 날짜 범위 필터링
  - 계약 상태 자동 업데이트

### 4. 테스트 코드
- 단위 테스트
  - `ContractTest`: 도메인 모델 테스트
  - `ContractServiceTest`: 서비스 레이어 테스트
  - `CompanyServiceTest`: 업체 서비스 테스트
  - `ContractControllerTest`: 컨트롤러 테스트
- 통합 테스트
  - `ContractIntegrationTest`: 전체 플로우 테스트
