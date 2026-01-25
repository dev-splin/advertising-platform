'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // 홈 페이지 접속 시 광고 현황 조회 페이지로 리다이렉트
    router.push('/contracts');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">광고 플랫폼</h1>
        <p className="text-gray-600">페이지를 불러오는 중...</p>
      </div>
    </div>
  );
}
