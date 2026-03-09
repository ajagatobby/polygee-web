"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "Predictions", icon: BarChart3 },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/pricing", label: "Pro", icon: Crown },
];

/**
 * Bottom navigation bar for mobile/tablet screens.
 * Hidden on desktop (lg+) where the sidebar handles navigation.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show on auth pages
  if (pathname.startsWith("/sign-") || pathname.startsWith("/forgot-") || pathname.startsWith("/invite-")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e8e8e8] sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-[56px]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/prediction")
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          // Show sign-in for unauthenticated users instead of Pro
          if (item.href === "/pricing" && !isAuthenticated) {
            return (
              <Link
                key="/sign-in"
                href="/sign-in"
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#808080]"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Sign In</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-[#1552f0]" : "text-[#808080]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
