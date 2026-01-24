import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind가 스캔할 파일 경로 지정
  // 여기에 포함된 파일에서 사용된 클래스만 최종 CSS에 포함됨 (성능 최적화)
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // 다크모드 설정: 'media' (시스템 설정 따름) 또는 'class' (클래스로 제어)
  // darkMode: 'class',
  
  // 테마 커스터마이징
  theme: {
    // extend: 기존 설정에 추가 (기본값 유지하면서 확장)
    // extend 없이 직접 지정하면 기본값을 완전히 덮어씀
    extend: {
      // 커스텀 색상 추가
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 예시: 'brand-blue': '#1e40af' 추가하면 bg-brand-blue 사용 가능
      },
      
      // 커스텀 폰트 추가
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      // },
      
      // 커스텀 간격 추가
      // spacing: {
      //   '128': '32rem',
      // },
      
      // 커스텀 브레이크포인트 추가
      // screens: {
      //   'xs': '475px',
      // },
    },
  },
  
  // 플러그인 추가 (예: @tailwindcss/forms, @tailwindcss/typography 등)
  plugins: [],
};
export default config;
