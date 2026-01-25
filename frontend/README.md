# Frontend - 광고 상품 구매 서비스

## 기술 스택
- Next.js 14.0.0
- TypeScript 5.2.2
- Tailwind CSS 3.3.5
- React 18.2.0
- react-hot-toast (Toast 알림)
- date-fns (날짜 처리)

## 실행 방법

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치
```bash
cd frontend
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

개발 서버가 시작되면 `http://localhost:3000`에서 애플리케이션을 확인할 수 있습니다.

### 빌드
```bash
npm run build
npm start
```

## 프로젝트 구조
```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   ├── contracts/         # 계약 관련 페이지
│   │   ├── page.tsx       # 계약 목록 (현황 조회)
│   │   ├── [id]/page.tsx  # 계약 상세
│   │   └── new/           # 계약 생성
│   │       ├── select/page.tsx  # 상품 선택
│   │       └── page.tsx   # 계약 폼
│   └── globals.css        # 전역 스타일
├── src/
│   ├── types/             # TypeScript 타입 정의
│   │   ├── api.ts         # API 타입
│   │   ├── error.ts       # ErrorResponse 타입
│   │   └── index.ts
│   ├── lib/
│   │   ├── api/           # API 클라이언트
│   │   │   ├── client.ts  # API 클라이언트
│   │   │   ├── error-handler.ts  # 에러 처리
│   │   │   └── services.ts  # API 서비스 함수
│   │   └── utils/         # 유틸리티
│   │       ├── format.ts  # 숫자 포맷팅
│   │       └── date.ts    # 날짜 처리
│   └── components/
│       ├── layout/        # 레이아웃 컴포넌트
│       │   ├── Layout.tsx
│       │   └── Sidebar.tsx
│       └── ui/            # UI 컴포넌트
│           ├── Toast.tsx
│           └── AutoComplete.tsx
├── tailwind.config.ts     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
└── package.json
```

## 주요 기능

### 1. 공통 레이아웃
- 좌측 사이드바 네비게이션
- '광고 현황 조회' 및 '광고 계약' 메뉴

### 2. 광고 계약 프로세스
- **상품 선택**: 상품 카드 선택 시 계약 폼으로 이동
- **계약 폼**:
  - 업체명 자동완성
  - 시작일 기본값: 오늘
  - 종료일 기본값: 시작일 + 28일
  - 종료일 최소값 제약 (시작일 + 28일)
  - 금액 입력 시 자동 콤마 삽입
  - 금액 유효성 검사 (10,000원 ~ 1,000,000원)
  - 버튼 중복 클릭 방지
  - 계약 성공 시 상세 페이지로 이동

### 3. 광고 현황 조회
- 업체명 자동완성 필터
- 계약 상태 다중 선택 체크박스
  - '전체' 체크박스로 일괄 선택/해제
  - 하위 항목 선택 시 '전체' 자동 동기화
- 계약 기간 필터 (시작일, 종료일)
- 페이징 (페이지당 5건)
- 계약번호 클릭 시 상세 페이지 이동

### 4. 에러 처리
- Backend ErrorResponse 규격에 따른 에러 처리
- Toast 알림으로 사용자에게 피드백
- 필드별 에러 메시지 표시

## 환경 변수

`.env.local` 파일을 생성하여 API 베이스 URL을 설정할 수 있습니다:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

## 에러 응답 규격

Frontend에서 사용하는 ErrorResponse 타입은 Backend와 동일한 구조를 가집니다:

```typescript
interface ErrorResponse {
  code: string;              // 에러 코드
  message: string;           // 에러 메시지
  details?: Record<string, string | string[]>;  // 상세 에러 정보
  timestamp: string;         // 에러 발생 시각
  status: number;            // HTTP 상태 코드
}
```
