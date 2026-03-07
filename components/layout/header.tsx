"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, BarChart3, CalendarDays, Target, Settings, Trophy, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { duration, easing } from "@/lib/animations";
import { ConnectPolymarketModal } from "@/components/ui/connect-polymarket-modal";

const navLinks = [
  { href: "/", label: "Predictions", icon: BarChart3 },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
];

export function Header() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setAvatarMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setAvatarMenuOpen(false), 150);
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
      <div className="h-[60px] flex items-center px-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              Polygee
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-[400px]">
          <div className="relative">
            <motion.div
              animate={{ opacity: searchFocused ? 1 : 0.5 }}
              transition={{ duration: duration.fast, ease: easing.ease }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            </motion.div>
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-[#f5f5f5] rounded-[8px] text-[#1a1a2e] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-[#ddd] transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
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

          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] font-medium text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors cursor-pointer"
          >
            Connect Polymarket
          </button>

          <button className="relative p-2 text-[#666] hover:text-[#333] transition-colors cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          {/* Avatar + Popover */}
          <div
            className="relative"
            ref={avatarMenuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 cursor-pointer hover:opacity-90 transition-opacity" />

            <AnimatePresence>
              {avatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.97, y: -4, filter: "blur(4px)" }}
                  transition={{ duration: duration.normal, ease: easing.easeOut }}
                  className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white border border-[#e8e8e8] rounded-[12px] shadow-lg overflow-hidden z-50"
                  style={{ transformOrigin: "top right" }}
                >
                  {/* User info */}
                  <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                    <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">0x9BBA6B71...</p>
                    </div>
                    <button className="ml-auto shrink-0 p-1 text-[#999] hover:text-[#1a1a2e] transition-colors cursor-pointer">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="h-px bg-[#f0f0f0]" />

                  {/* Primary menu items */}
                  <div className="py-1.5">
                    {[
                      { icon: Target, label: "Accuracy" },
                      { icon: Settings, label: "Settings" },
                      { icon: Trophy, label: "Leaderboard" },
                      { icon: HelpCircle, label: "Support" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
                      >
                        <item.icon className="w-4 h-4 text-[#808080]" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="h-px bg-[#f0f0f0]" />

                  {/* Logout */}
                  <div className="py-1.5">
                    <button
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-[#ff3b30] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>

    <ConnectPolymarketModal
      open={connectModalOpen}
      onClose={() => setConnectModalOpen(false)}
    />
    </>
  );
}
