"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, BarChart3, CalendarDays } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Predictions", icon: BarChart3 },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
];

export function Header() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
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

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/prediction")
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors
                  ${isActive
                    ? "text-[#1a1a2e] bg-[#f0f0f0] font-semibold"
                    : "text-[#808080] hover:text-[#1a1a2e] hover:bg-[#f7f7f7]"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-[400px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-[#f5f5f5] rounded-[8px] text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#ddd] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="relative p-2 text-[#666] hover:text-[#333] transition-colors cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
