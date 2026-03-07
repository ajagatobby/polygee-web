"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useState } from "react";

const categories = [
  { href: "/", label: "Sports", active: true },
  { href: "#", label: "Trending" },
  { href: "#", label: "Breaking" },
  { href: "#", label: "New" },
  { href: "#", label: "Politics" },
  { href: "#", label: "Crypto" },
  { href: "#", label: "Finance" },
  { href: "#", label: "Culture" },
];

export function Header() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
      {/* Top bar */}
      <div className="h-[60px] flex items-center px-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              Polygee
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-[480px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-[40px] pl-9 pr-4 text-[13px] bg-[#f5f5f5] rounded-[8px] text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#ddd] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-[#999] font-medium">Portfolio</div>
            <div className="text-[14px] font-bold text-[#1a1a2e]">$85.07</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-[#999] font-medium">Cash</div>
            <div className="text-[14px] font-bold text-[#1a1a2e]">$58.64</div>
          </div>
          <button className="h-[36px] px-4 bg-[#0066FF] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#0052cc] transition-colors cursor-pointer">
            Deposit
          </button>
          <button className="relative p-2 text-[#666] hover:text-[#333] transition-colors cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 cursor-pointer" />
        </div>
      </div>

      {/* Category bar */}
      <div className="h-[40px] flex items-center px-6 gap-1 border-t border-[#f0f0f0] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat) => {
          const isActive = cat.href === "/" ? pathname === "/" || pathname.startsWith("/prediction") : false;
          return (
            <Link
              key={cat.label}
              href={cat.href}
              className={`
                px-3 py-1.5 text-[13px] font-medium rounded-[6px] whitespace-nowrap transition-colors
                ${isActive
                  ? "text-[#1a1a2e] font-semibold"
                  : "text-[#808080] hover:text-[#1a1a2e]"
                }
              `}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
