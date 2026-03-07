"use client";

import { MapPin, Tv } from "lucide-react";
import { motion } from "motion/react";
import { Fixture } from "@/types";
import { formatDate } from "@/lib/mock-data";
import { duration, easing } from "@/lib/animations";

interface FixtureCardProps {
  fixture: Fixture;
}

function OutcomeButton({ label, variant = "default" }: { label: string; variant?: "home" | "draw" | "away" | "default" }) {
  const colors = {
    home: "bg-[#1a1a2e] text-white",
    away: "bg-[#1a1a2e] text-white",
    draw: "bg-[#eef1f5] text-[#1a1a2e]",
    default: "bg-[#eef1f5] text-[#1a1a2e]",
  };

  return (
    <button
      type="button"
      className={`
        flex-1 h-[34px] rounded-[8px] text-[11px] font-semibold uppercase tracking-[0.3px]
        cursor-pointer select-none transition-opacity duration-100
        hover:opacity-85 active:opacity-70
        ${colors[variant]}
      `}
    >
      {label}
    </button>
  );
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const isLive = fixture.status === "live";
  const isCompleted = fixture.status === "completed";

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#e8e8e8] overflow-hidden flex flex-col"
      whileHover={{
        y: -2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        borderColor: "#ddd",
      }}
      transition={{ duration: duration.fast, ease: easing.ease }}
    >
      {/* Top bar: status + league + broadcast */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          {isLive && (
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex items-center justify-center">
                <span className="w-[6px] h-[6px] rounded-full bg-[#ff3b30] relative z-10" />
                <span className="absolute -inset-px w-[8px] h-[8px] rounded-full bg-[#ff3b30] opacity-75 animate-ping" />
              </span>
              <span className="text-[11px] font-bold text-[#ff3b30] uppercase">Live</span>
            </span>
          )}
          {isCompleted && (
            <span className="text-[11px] font-bold text-[#999] shrink-0">FT</span>
          )}
          {!isLive && !isCompleted && (
            <span className="text-[11px] text-[#999] font-semibold shrink-0">{fixture.matchTime}</span>
          )}
          <span className="text-[11px] text-[#ccc]">&middot;</span>
          <span className="text-[11px] text-[#999] truncate">{fixture.league.name}</span>
          {fixture.matchday > 0 && (
            <>
              <span className="text-[11px] text-[#ccc]">&middot;</span>
              <span className="text-[11px] text-[#ccc] shrink-0">MD {fixture.matchday}</span>
            </>
          )}
        </div>
        {fixture.broadcast && (
          <span className="flex items-center gap-1 text-[10px] text-[#bbb] shrink-0 ml-2">
            <Tv className="w-3 h-3" />
            {fixture.broadcast}
          </span>
        )}
      </div>

      {/* Center: teams */}
      <div className="px-4 py-3 flex-1">
        {/* Home team row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-[20px] shrink-0">{fixture.homeTeam.logo}</span>
            <div className="min-w-0">
              <p className={`text-[13px] font-semibold truncate ${
                isCompleted && fixture.homeScore !== undefined && fixture.awayScore !== undefined
                  ? fixture.homeScore > fixture.awayScore ? "text-[#1a1a2e]" : "text-[#bbb]"
                  : "text-[#1a1a2e]"
              }`}>
                {fixture.homeTeam.name}
              </p>
              {fixture.homeTeam.record && (
                <p className="text-[10px] text-[#bbb] font-medium">{fixture.homeTeam.record}</p>
              )}
            </div>
          </div>
          {(isLive || isCompleted) && (
            <span className={`text-[20px] font-bold tabular-nums shrink-0 ml-3 ${
              isLive ? "text-[#ff3b30]" : "text-[#1a1a2e]"
            }`}>
              {fixture.homeScore}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#f0f0f0]" />
          {!isLive && !isCompleted && (
            <span className="text-[10px] font-bold text-[#ccc] uppercase">vs</span>
          )}
          {(isLive || isCompleted) && (
            <span className="text-[10px] font-bold text-[#ccc]">-</span>
          )}
          <div className="flex-1 h-px bg-[#f0f0f0]" />
        </div>

        {/* Away team row */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-[20px] shrink-0">{fixture.awayTeam.logo}</span>
            <div className="min-w-0">
              <p className={`text-[13px] font-semibold truncate ${
                isCompleted && fixture.homeScore !== undefined && fixture.awayScore !== undefined
                  ? fixture.awayScore > fixture.homeScore ? "text-[#1a1a2e]" : "text-[#bbb]"
                  : "text-[#1a1a2e]"
              }`}>
                {fixture.awayTeam.name}
              </p>
              {fixture.awayTeam.record && (
                <p className="text-[10px] text-[#bbb] font-medium">{fixture.awayTeam.record}</p>
              )}
            </div>
          </div>
          {(isLive || isCompleted) && (
            <span className={`text-[20px] font-bold tabular-nums shrink-0 ml-3 ${
              isLive ? "text-[#ff3b30]" : "text-[#1a1a2e]"
            }`}>
              {fixture.awayScore}
            </span>
          )}
        </div>
      </div>

      {/* Outcome buttons: Home / Draw / Away */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <OutcomeButton label={fixture.homeTeam.shortName} variant="home" />
        <OutcomeButton label="Draw" variant="draw" />
        <OutcomeButton label={fixture.awayTeam.shortName} variant="away" />
      </div>

      {/* Bottom bar: venue + date */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#f0f0f0] bg-[#fafafa]/60">
        <span className="flex items-center gap-1 text-[10px] text-[#bbb] min-w-0">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{fixture.venue}</span>
        </span>
        {!isLive && !isCompleted && (
          <span className="text-[10px] text-[#bbb] font-medium shrink-0 ml-2">
            {formatDate(fixture.matchDate)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
