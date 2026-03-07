"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  BarChart3,
  Radio,
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
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col py-8 px-3 overflow-y-auto scrollbar-thin sticky top-[60px]" style={{ height: "calc(100vh - 60px)" }}>
      {/* Top navigation links */}
      <Link
        href="/"
        className={`
          flex flex-row justify-between items-center rounded-md px-3 py-3 w-full cursor-pointer transition-colors
          ${isPredictionsActive ? "bg-neutral-50" : "bg-transparent hover:bg-neutral-50"}
        `}
      >
        <div className="flex flex-row items-center gap-x-2.5 flex-1 min-w-0">
          <div className="shrink-0 text-neutral-500">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-[14px] font-semibold truncate text-[#1a1a2e]">
            Predictions
          </p>
        </div>
      </Link>

      <Link
        href="/fixtures"
        className={`
          flex flex-row justify-between items-center rounded-md px-3 py-3 w-full cursor-pointer transition-colors
          ${isFixturesActive ? "bg-neutral-50" : "bg-transparent hover:bg-neutral-50"}
        `}
      >
        <div className="flex flex-row items-center gap-x-2.5 flex-1 min-w-0">
          <div className="shrink-0 text-neutral-500">
            <CalendarDays className="w-5 h-5" />
          </div>
          <p className="text-[14px] font-semibold truncate text-[#1a1a2e]">
            Fixtures
          </p>
        </div>
      </Link>

      {/* Divider */}
      <div className="pb-2 border-b border-neutral-100 mb-2 w-full" />

      {/* Section label */}
      <div className="flex items-center pl-3 pr-3 mt-4 mb-3">
        <p className="text-[11px] uppercase text-neutral-400 font-medium tracking-wider whitespace-nowrap">
          All Leagues
        </p>
      </div>

      {/* Sports with collapsible leagues */}
      {sidebarLeagues.map((sport) => (
        <div key={sport.id}>
          {/* Sport parent row (e.g. Soccer) */}
          <button
            onClick={() => toggleExpand(sport.id)}
            className={`
              flex flex-row items-center justify-between rounded-md px-3 py-3 w-full cursor-pointer transition-colors
              bg-transparent hover:bg-neutral-50
            `}
          >
            <div className="flex items-center gap-x-2.5 min-w-0">
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                <span className="text-[16px] leading-none">{sport.logo}</span>
              </div>
              <p className="text-[14px] font-semibold truncate text-[#1a1a2e]">
                {sport.name}
              </p>
            </div>
            <ChevronDown
              className={`w-3 h-3 shrink-0 text-neutral-400 transition-transform duration-200 ${
                expanded[sport.id] ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Collapsible sub-leagues */}
          <div
            style={{
              height: expanded[sport.id] ? "auto" : "0px",
              overflow: expanded[sport.id] ? "visible" : "hidden",
              opacity: expanded[sport.id] ? 1 : 0,
              transition: "opacity 300ms",
            }}
          >
            <div className="pl-5 flex flex-col pt-0.5">
              {sport.children?.map((league) => {
                const isActive = activeLeague === league.slug;
                return (
                  <button
                    key={league.id}
                    onClick={() => onLeagueChange(league.slug)}
                    className="block w-full text-left"
                  >
                    <div className={`
                      rounded-md py-3 px-3 cursor-pointer relative transition-colors
                      ${isActive ? "bg-neutral-50" : "hover:bg-neutral-50"}
                    `}>
                      <div className="flex items-center gap-x-2.5 min-w-0">
                        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <span className="text-[14px] leading-none">{league.logo}</span>
                        </div>
                        <p className="pr-4 whitespace-nowrap truncate text-[14px] font-medium text-[#1a1a2e]">
                          {league.name}
                        </p>
                      </div>
                      {league.count > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-bold">
                          {league.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
