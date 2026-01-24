# Frontend - 광고 상품 구매 서비스

## 기술 스택
- Next.js 14.0.0
- TypeScript 5.2.2
- Tailwind CSS 3.3.5
- React 18.2.0

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
│   └── page.tsx           # 홈 페이지
├── src/
│   ├── types/             # TypeScript 타입 정의
│   │   └── error.ts       # ErrorResponse 타입
│   └── lib/
│       └── api/           # API 클라이언트
│           ├── client.ts  # API 클라이언트
│           └── error-handler.ts  # 에러 처리
├── components/            # React 컴포넌트
├── public/                # 정적 파일
├── tailwind.config.ts     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
└── package.json
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

## 환경 변수

`.env.local` 파일을 생성하여 API 베이스 URL을 설정할 수 있습니다:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```
