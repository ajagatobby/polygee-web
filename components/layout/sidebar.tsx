"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Flame,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { sidebarLeagues } from "@/lib/mock-data";

interface SidebarProps {
  activeLeague: string;
  onLeagueChange: (slug: string) => void;
}

export function Sidebar({ activeLeague, onLeagueChange }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ soccer: true });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isPredictionsActive = pathname === "/" || pathname.startsWith("/prediction");
  const isFixturesActive = pathname.startsWith("/fixtures");

  return (
    <aside className="w-[240px] shrink-0 border-r border-[#f0f0f0] bg-white overflow-y-auto hidden lg:flex flex-col">
      {/* Top navigation */}
      <div className="p-3 pb-0">
        <div className="flex flex-col gap-0.5">
          <Link
            href="/"
            className={`
              flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all group
              ${isPredictionsActive
                ? "bg-[#0066FF]/[0.08] text-[#0066FF]"
                : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#1a1a2e]"
              }
            `}
          >
            <div className={`
              w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors
              ${isPredictionsActive
                ? "bg-[#0066FF]/[0.12]"
                : "bg-[#f5f5f5] group-hover:bg-[#eee]"
              }
            `}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[13px] font-semibold ${isPredictionsActive ? "text-[#0066FF]" : ""}`}>
                Predictions
              </span>
            </div>
            <Flame className={`w-3.5 h-3.5 shrink-0 ${isPredictionsActive ? "text-[#0066FF]/60" : "text-[#ccc]"}`} />
          </Link>

          <Link
            href="/fixtures"
            className={`
              flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all group
              ${isFixturesActive
                ? "bg-[#0066FF]/[0.08] text-[#0066FF]"
                : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#1a1a2e]"
              }
            `}
          >
            <div className={`
              w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors
              ${isFixturesActive
                ? "bg-[#0066FF]/[0.12]"
                : "bg-[#f5f5f5] group-hover:bg-[#eee]"
              }
            `}>
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[13px] font-semibold ${isFixturesActive ? "text-[#0066FF]" : ""}`}>
                Fixtures
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 my-3 h-px bg-[#f0f0f0]" />

      {/* Leagues section */}
      <div className="flex-1 px-3 pb-4">
        {/* Section label */}
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-[0.08em]">
            Leagues
          </span>
          <button className="text-[10px] font-semibold text-[#0066FF] hover:text-[#0052cc] transition-colors cursor-pointer">
            View all
          </button>
        </div>

        {/* Sports + Leagues */}
        {sidebarLeagues.map((sport) => (
          <div key={sport.id} className="mb-1">
            {/* Sport header */}
            <button
              onClick={() => toggleExpand(sport.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-semibold text-[#1a1a2e] hover:bg-[#f5f5f5] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[16px] leading-none">{sport.logo}</span>
                <span>{sport.name}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#bbb] group-hover:text-[#999] transition-transform duration-200 ${
                  expanded[sport.id] ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {/* Children leagues - animated */}
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${
                expanded[sport.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-0.5 pb-1">
                {sport.children?.map((league) => {
                  const isActive = activeLeague === league.slug;
                  return (
                    <button
                      key={league.id}
                      onClick={() => onLeagueChange(league.slug)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-[9px] rounded-[8px] transition-all cursor-pointer group/league
                        ${isActive
                          ? "bg-[#1a1a2e] text-white"
                          : "text-[#555] hover:bg-[#f5f5f5] hover:text-[#1a1a2e]"
                        }
                      `}
                    >
                      {/* League logo */}
                      <div className={`
                        w-[26px] h-[26px] rounded-[6px] flex items-center justify-center text-[14px] shrink-0 transition-colors
                        ${isActive ? "bg-white/15" : "bg-[#f5f5f5] group-hover/league:bg-[#eee]"}
                      `}>
                        {league.logo}
                      </div>

                      {/* League name */}
                      <span className={`flex-1 text-left text-[13px] truncate ${isActive ? "font-semibold" : "font-medium"}`}>
                        {league.name}
                      </span>

                      {/* Match count badge */}
                      <span className={`
                        text-[11px] font-semibold px-1.5 py-0.5 rounded-[5px] shrink-0 tabular-nums
                        ${isActive
                          ? "bg-white/20 text-white/80"
                          : "bg-[#f0f0f0] text-[#999] group-hover/league:bg-[#e8e8e8]"
                        }
                      `}>
                        {league.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mt-auto border-t border-[#f0f0f0] p-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-gradient-to-r from-[#0066FF]/[0.06] to-[#0066FF]/[0.02]">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#0066FF]/[0.1] flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-[#0066FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#1a1a2e] leading-tight">AI Accuracy</p>
            <p className="text-[11px] text-[#999] leading-tight">72.4% last 30 days</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
