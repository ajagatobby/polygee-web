"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ApiEnrichedFixture } from "@/types/api";
import {
  formatTime,
  isMatchLive,
  isMatchFinished,
  getStatusLabel,
} from "@/lib/utils";
import { duration, easing } from "@/lib/animations";

interface FixtureCardProps {
  data: ApiEnrichedFixture;
}

export function FixtureCard({ data }: FixtureCardProps) {
  const { fixture, homeTeam, awayTeam } = data;
  const isLive = isMatchLive(fixture.status);
  const isCompleted = isMatchFinished(fixture.status);

  // Winner detection for completed matches
  const homeWon = isCompleted && fixture.goalsHome != null && fixture.goalsAway != null && fixture.goalsHome > fixture.goalsAway;
  const awayWon = isCompleted && fixture.goalsHome != null && fixture.goalsAway != null && fixture.goalsAway > fixture.goalsHome;

  return (
    <motion.div
      className="w-full bg-white rounded-[14px] border border-[#eaeaea] overflow-hidden"
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        borderColor: "#ddd",
      }}
      transition={{ duration: duration.fast, ease: easing.ease }}
    >
      {/* Top bar — league + time/status */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold text-[#999] truncate">
            {fixture.leagueName}
          </span>
          {fixture.round && (
            <span className="text-[10px] font-medium text-[#bbb] bg-[#f5f5f5] px-1.5 py-0.5 rounded shrink-0">
              {fixture.round}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="shrink-0">
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff3b30] opacity-75 animate-ping" />
                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#ff3b30]" />
              </span>
              <span className="text-[11px] font-bold text-[#ff3b30] uppercase">
                {getStatusLabel(fixture.status, fixture.elapsed)}
              </span>
            </div>
          ) : isCompleted ? (
            <span className="text-[11px] font-bold text-[#bbb] uppercase">
              {getStatusLabel(fixture.status, fixture.elapsed)}
            </span>
          ) : (
            <span className="text-[11px] font-bold text-[#1a1a2e]">
              {formatTime(fixture.date)}
            </span>
          )}
        </div>
      </div>

      {/* Club A vs Club B */}
      <div className="px-4 pb-4">
        <div className="flex items-center">
          {/* Home team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              {homeTeam.logo ? (
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name || ""}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#f0f0f0]" />
              )}
            </div>
            <span className={`text-[14px] font-semibold truncate ${
              isCompleted ? (homeWon ? "text-[#1a1a2e]" : "text-[#bbb]") : "text-[#1a1a2e]"
            }`}>
              {homeTeam.name || "Home"}
            </span>
          </div>

          {/* Score or VS */}
          <div className="shrink-0 mx-3 text-center min-w-[48px]">
            {isLive || isCompleted ? (
              <div className={`text-[20px] font-bold tabular-nums ${
                isLive ? "text-[#1a1a2e]" : "text-[#666]"
              }`}>
                <span className={isCompleted && homeWon ? "text-[#1a1a2e]" : isCompleted ? "text-[#bbb]" : ""}>
                  {fixture.goalsHome ?? 0}
                </span>
                <span className="text-[#ccc] mx-1">-</span>
                <span className={isCompleted && awayWon ? "text-[#1a1a2e]" : isCompleted ? "text-[#bbb]" : ""}>
                  {fixture.goalsAway ?? 0}
                </span>
              </div>
            ) : (
              <span className="text-[13px] font-bold text-[#ccc]">vs</span>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span className={`text-[14px] font-semibold truncate text-right ${
              isCompleted ? (awayWon ? "text-[#1a1a2e]" : "text-[#bbb]") : "text-[#1a1a2e]"
            }`}>
              {awayTeam.name || "Away"}
            </span>
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              {awayTeam.logo ? (
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name || ""}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#f0f0f0]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
