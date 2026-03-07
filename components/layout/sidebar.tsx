"use client";

import Link from "next/link";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { sidebarLeagues } from "@/lib/mock-data";

interface SidebarProps {
  activeLeague: string;
  onLeagueChange: (slug: string) => void;
}

export function Sidebar({ activeLeague, onLeagueChange }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ soccer: true });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-[220px] shrink-0 border-r border-[#f0f0f0] bg-white overflow-y-auto hidden lg:block">
      <div className="py-4">
        {/* Futures link */}
        <Link
          href="/fixtures"
          className="flex items-center gap-2.5 px-5 py-2 text-[13px] font-medium text-[#666] hover:text-[#1a1a2e] hover:bg-[#f7f7f7] transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Fixtures
        </Link>

        {/* Section header */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em]">
            All Sports
          </span>
        </div>

        {/* Sports + Leagues */}
        {sidebarLeagues.map((sport) => (
          <div key={sport.id}>
            {/* Sport header */}
            <button
              onClick={() => toggleExpand(sport.id)}
              className="w-full flex items-center justify-between px-5 py-2 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[15px]">{sport.logo}</span>
                <span>{sport.name}</span>
              </div>
              {expanded[sport.id] ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#999]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
              )}
            </button>

            {/* Children leagues */}
            {expanded[sport.id] && sport.children && (
              <div className="ml-4">
                {sport.children.map((league) => (
                  <button
                    key={league.id}
                    onClick={() => onLeagueChange(league.slug)}
                    className={`
                      w-full flex items-center justify-between px-5 py-[7px] text-[13px] transition-colors cursor-pointer rounded-l-[6px]
                      ${
                        activeLeague === league.slug
                          ? "bg-[#f0f0f0] text-[#1a1a2e] font-medium"
                          : "text-[#666] hover:text-[#1a1a2e] hover:bg-[#f7f7f7] font-normal"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px]">{league.logo}</span>
                      <span>{league.name}</span>
                    </div>
                    <span className="text-[12px] text-[#999] font-normal">{league.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
