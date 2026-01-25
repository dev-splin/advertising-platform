'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/contracts', label: '광고 현황 조회' },
  { href: '/contracts/new/select', label: '광고 계약' },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">광고 플랫폼</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href === '/contracts/new' && pathname?.startsWith('/contracts/new')) ||
                          (item.href === '/contracts' && pathname?.startsWith('/contracts') && pathname !== '/contracts/new');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
