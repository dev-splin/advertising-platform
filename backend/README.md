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
