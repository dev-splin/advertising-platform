# 광고 플랫폼 Frontend

TypeScript, React, Next.js, Tailwind CSS로 구성된 광고 플랫폼 프론트엔드 애플리케이션입니다.

## 기술 스택

- **TypeScript**: 타입 안정성을 위한 언어
- **React**: UI 라이브러리
- **Next.js**: React 프레임워크
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
frontend/
├── app/              # Next.js App Router
│   ├── layout.tsx    # 루트 레이아웃
│   ├── page.tsx      # 홈 페이지
│   └── globals.css   # 전역 스타일
├── components/       # 재사용 가능한 컴포넌트
├── public/          # 정적 파일
├── next.config.js   # Next.js 설정
├── tailwind.config.ts # Tailwind CSS 설정
└── tsconfig.json    # TypeScript 설정
```
