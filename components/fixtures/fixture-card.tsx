"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ApiEnrichedFixture } from "@/types/api";
import {
  formatTime,
  isMatchLive,
  isMatchFinished,
  getStatusLabel,
  getTeamShortName,
} from "@/lib/utils";
import { useTeamColor } from "@/lib/hooks/use-team-color";
import { duration, easing } from "@/lib/animations";

interface FixtureCardProps {
  data: ApiEnrichedFixture;
}

export function FixtureCard({ data }: FixtureCardProps) {
  const { fixture, homeTeam, awayTeam } = data;
  const isLive = isMatchLive(fixture.status);
  const isCompleted = isMatchFinished(fixture.status);

  // Team colors
  const homeColor = useTeamColor(homeTeam.id, homeTeam.logo, homeTeam.teamColors?.player?.primary);
  const awayColor = useTeamColor(awayTeam.id, awayTeam.logo, awayTeam.teamColors?.player?.primary);

  // Short team names
  const homeShort = getTeamShortName(homeTeam.shortName, homeTeam.name);
  const awayShort = getTeamShortName(awayTeam.shortName, awayTeam.name);

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

      {/* Match content */}
      <div className="px-4 pb-4">
        {/* Teams and score area */}
        <div className="flex items-center gap-3">
          {/* Teams column */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Home team */}
            <div className="flex items-center gap-2.5">
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
              {(isLive || isCompleted) && (
                <span className={`ml-auto text-[18px] font-bold tabular-nums shrink-0 ${
                  isLive ? "text-[#1a1a2e]" : homeWon ? "text-[#1a1a2e]" : "text-[#bbb]"
                }`}>
                  {fixture.goalsHome ?? 0}
                </span>
              )}
            </div>

            {/* Away team */}
            <div className="flex items-center gap-2.5">
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
              <span className={`text-[14px] font-semibold truncate ${
                isCompleted ? (awayWon ? "text-[#1a1a2e]" : "text-[#bbb]") : "text-[#1a1a2e]"
              }`}>
                {awayTeam.name || "Away"}
              </span>
              {(isLive || isCompleted) && (
                <span className={`ml-auto text-[18px] font-bold tabular-nums shrink-0 ${
                  isLive ? "text-[#1a1a2e]" : awayWon ? "text-[#1a1a2e]" : "text-[#bbb]"
                }`}>
                  {fixture.goalsAway ?? 0}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Outcome buttons */}
        <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-[#f0f0f0]">
          <OutcomeChip
            label={homeShort}
            color={homeColor}
          />
          <OutcomeChip
            label="DRAW"
            color="#808080"
            dimmed
          />
          <OutcomeChip
            label={awayShort}
            color={awayColor}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Outcome chip ──────────────────────────────────────────────────────

function OutcomeChip({
  label,
  color,
  dimmed = false,
}: {
  label: string;
  color: string;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        flex-1 flex items-center justify-center h-[36px] rounded-[8px]
        text-[11px] font-bold uppercase tracking-[0.04em]
        transition-all duration-150 cursor-pointer
        ${dimmed ? "opacity-50 hover:opacity-70" : "hover:opacity-85"}
      `}
      style={{
        backgroundColor: color + "12",
        color: color,
      }}
    >
      {label}
    </button>
  );
}
