"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/contracts", label: "광고 현황 조회" },
  { href: "/contracts/new/select", label: "광고 계약" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-w-64 max-w-64 flex-shrink-0 bg-white min-h-screen border-r border-gray-200">
      <div className="p-6">
      <div className="mb-8">
        <Link href="/">
          <h1 className="text-2xl font-bold text-black cursor-pointer hover:text-gray-700 transition-colors">
            광고 센터
          </h1>
        </Link>
      </div>

      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/contracts/new/select" &&
              pathname?.startsWith("/contracts/new")) ||
            (item.href === "/contracts" &&
              pathname?.startsWith("/contracts") &&
              !pathname?.startsWith("/contracts/new"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full px-4 py-3 rounded-lg transition-colors text-white font-medium ${
                isActive
                  ? "bg-blue-500 font-semibold"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
              style={
                isActive
                  ? { backgroundColor: "#3b82f6", color: "#ffffff" }
                  : { backgroundColor: "#475569", color: "#ffffff" }
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      </div>
    </aside>
  );
}
