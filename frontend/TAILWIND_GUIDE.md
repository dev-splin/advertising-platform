# Tailwind CSS 설정 가이드

## 1. tailwind.config.ts - 메인 설정 파일

### 주요 설정 옵션들:

#### `content` (필수)
- Tailwind가 어떤 파일들을 스캔할지 지정
- 여기에 포함된 파일들에서 사용된 클래스만 최종 CSS에 포함됨 (트리 쉐이킹)
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
]
```

#### `theme` - 테마 커스터마이징
- 기본 색상, 폰트, 간격 등을 확장하거나 덮어쓰기
- `extend`: 기존 설정에 추가
- 직접 지정: 기존 설정을 완전히 덮어쓰기

**예시:**
```typescript
theme: {
  extend: {
    // 커스텀 색상 추가
    colors: {
      'brand-blue': '#1e40af',
      'brand-red': '#dc2626',
    },
    // 커스텀 폰트 추가
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    // 커스텀 간격 추가
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
    // 커스텀 브레이크포인트 추가
    screens: {
      'xs': '475px',
    },
  },
}
```

#### `plugins` - 플러그인 추가
- 추가 기능을 제공하는 플러그인들
- 예: `@tailwindcss/forms`, `@tailwindcss/typography` 등

```typescript
plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
]
```

#### `darkMode` - 다크모드 설정
- `'media'`: 시스템 설정 따름
- `'class'`: 클래스로 제어 (예: `<html class="dark">`)

```typescript
darkMode: 'class', // 또는 'media'
```

## 2. postcss.config.js - PostCSS 설정

Tailwind CSS를 처리하기 위한 PostCSS 플러그인 설정:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},      // Tailwind CSS 처리
    autoprefixer: {},     // 브라우저 호환성을 위한 자동 접두사 추가
  },
}
```

## 3. globals.css - Tailwind 디렉티브

CSS 파일에서 Tailwind의 세 가지 레이어를 가져옴:

```css
@tailwind base;        /* 기본 스타일 리셋 */
@tailwind components;  /* 컴포넌트 클래스들 */
@tailwind utilities;   /* 유틸리티 클래스들 (가장 많이 사용) */
```

### 커스텀 유틸리티 추가:
```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## 실제 사용 예시

### 기본 클래스 사용:
```tsx
<div className="flex items-center justify-center p-4 bg-blue-500 text-white">
  내용
</div>
```

### 반응형 디자인:
```tsx
<div className="text-sm md:text-base lg:text-lg">
  반응형 텍스트
</div>
```

### 다크모드:
```tsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  다크모드 지원
</div>
```

### 커스텀 색상 사용:
```tsx
<div className="bg-brand-blue text-white">
  커스텀 색상
</div>
```
