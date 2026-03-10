"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { getLeagueLogo } from "@/lib/utils";
import type { ApiEnrichedFixture } from "@/types/api";

interface LeagueTab {
  id: string;
  name: string;
  logo: string;
  count: number;
}

interface LeagueTabsProps {
  /** Raw fixture data to extract available leagues from */
  fixtures: ApiEnrichedFixture[];
  /** Currently active league id ("all" or a numeric string) */
  activeLeague: string;
  /** Callback when a league tab is clicked */
  onLeagueChange: (leagueId: string) => void;
  /** Unique layoutId for the active pill animation */
  layoutId?: string;
  className?: string;
}

/**
 * Horizontal scrollable league filter tabs.
 * Extracts unique leagues from fixture data and renders pill tabs with logos.
 * Auto-scrolls to keep the active tab visible.
 */
export function LeagueTabs({
  fixtures,
  activeLeague,
  onLeagueChange,
  layoutId = "league-tab-indicator",
  className = "",
}: LeagueTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Extract unique leagues from fixtures, sorted by count descending
  const leagueTabs: LeagueTab[] = (() => {
    const map = new Map<
      number,
      { name: string; logo: string; count: number }
    >();
    for (const item of fixtures) {
      const leagueId = item.fixture.leagueId;
      const existing = map.get(leagueId);
      if (existing) {
        existing.count++;
      } else {
        map.set(leagueId, {
          name: item.fixture.leagueName ?? `League ${leagueId}`,
          logo: getLeagueLogo(leagueId),
          count: 1,
        });
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([id, data]) => ({
        id: String(id),
        ...data,
      }));
  })();

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      // Check if tab is outside visible area
      if (
        tabRect.left < containerRect.left ||
        tabRect.right > containerRect.right
      ) {
        tab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeLeague]);

  // Don't render if there's only 1 or 0 leagues
  if (leagueTabs.length <= 1) return null;

  const totalFixtures = fixtures.length;

  return (
    <div className={`border-b border-[#f0f0f0] ${className}`}>
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide px-4 md:px-6 lg:px-10 py-2"
      >
        {/* All tab */}
        <LeagueTabButton
          ref={activeLeague === "all" ? activeRef : null}
          isActive={activeLeague === "all"}
          label="All"
          count={totalFixtures}
          layoutId={layoutId}
          onClick={() => onLeagueChange("all")}
        />

        {/* League tabs */}
        {leagueTabs.map((league) => (
          <LeagueTabButton
            key={league.id}
            ref={activeLeague === league.id ? activeRef : null}
            isActive={activeLeague === league.id}
            label={league.name}
            logo={league.logo}
            count={league.count}
            layoutId={layoutId}
            onClick={() => onLeagueChange(league.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Individual tab button ─────────────────────────────────────────

import { forwardRef } from "react";

interface LeagueTabButtonProps {
  isActive: boolean;
  label: string;
  logo?: string;
  count: number;
  layoutId: string;
  onClick: () => void;
}

const LeagueTabButton = forwardRef<HTMLButtonElement, LeagueTabButtonProps>(
  function LeagueTabButton(
    { isActive, label, logo, count, layoutId, onClick },
    ref,
  ) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          relative flex items-center gap-1.5 h-[34px] px-3 rounded-[8px] cursor-pointer outline-none
          text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0
          ${
            isActive
              ? "text-white"
              : "text-[#808080] hover:text-[#1a1a2e] hover:bg-[#f5f5f5]"
          }
        `}
      >
        {/* Animated active background */}
        {isActive && (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-[8px] bg-[#1552f0]"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.8,
            }}
          />
        )}

        {/* Logo */}
        {logo && (
          <img
            src={logo}
            alt=""
            className={`relative z-10 w-4 h-4 object-contain shrink-0 ${
              isActive ? "brightness-0 invert" : ""
            }`}
          />
        )}

        {/* Label */}
        <span className="relative z-10">{label}</span>

        {/* Count badge */}
        <span
          className={`
            relative z-10 text-[10px] font-bold leading-none min-w-[18px] text-center
            px-[5px] py-[3px] rounded-full transition-colors duration-150
            ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-[#f0f0f0] text-[#bbb]"
            }
          `}
        >
          {count}
        </span>
      </button>
    );
  },
);
