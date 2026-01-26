'use client';

import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex-shrink min-w-0 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}
