"use client";

import { MapPin, Tv, Clock } from "lucide-react";
import { Fixture } from "@/types";
import { formatDate } from "@/lib/mock-data";

interface FixtureCardProps {
  fixture: Fixture;
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const isLive = fixture.status === "live";
  const isCompleted = fixture.status === "completed";

  return (
    <div
      className={`
        border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors
        ${isCompleted ? "opacity-70" : ""}
      `}
    >
      <div className="px-5 py-3">
        {/* Status row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            {isLive && (
              <span className="flex items-center gap-1.5">
                <span className="w-[6px] h-[6px] rounded-full bg-[#ff3b30] animate-pulse-soft" />
                <span className="text-[12px] font-bold text-[#ff3b30]">LIVE</span>
              </span>
            )}
            {isCompleted && (
              <span className="text-[12px] font-bold text-[#999]">FT</span>
            )}
            {!isLive && !isCompleted && (
              <span className="text-[12px] text-[#999] font-medium">{fixture.matchTime}</span>
            )}
            <span className="text-[12px] text-[#bbb]">&middot;</span>
            <span className="text-[12px] text-[#999]">{fixture.league.name}</span>
            {fixture.matchday > 0 && (
              <>
                <span className="text-[12px] text-[#bbb]">&middot;</span>
                <span className="text-[12px] text-[#bbb]">MD {fixture.matchday}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {fixture.broadcast && (
              <span className="flex items-center gap-1 text-[11px] text-[#999]">
                <Tv className="w-3 h-3" />
                {fixture.broadcast}
              </span>
            )}
          </div>
        </div>

        {/* Match row */}
        <div className="flex items-center gap-4">
          {/* Teams */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[16px]">{fixture.homeTeam.logo}</span>
              <span className={`text-[13px] font-medium ${
                isCompleted && fixture.homeScore !== undefined && fixture.awayScore !== undefined
                  ? fixture.homeScore > fixture.awayScore ? "text-[#1a1a2e] font-semibold" : "text-[#999]"
                  : "text-[#1a1a2e]"
              }`}>
                {fixture.homeTeam.name}
              </span>
              {fixture.homeTeam.record && (
                <span className="text-[11px] text-[#ccc]">{fixture.homeTeam.record}</span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[16px]">{fixture.awayTeam.logo}</span>
              <span className={`text-[13px] font-medium ${
                isCompleted && fixture.homeScore !== undefined && fixture.awayScore !== undefined
                  ? fixture.awayScore > fixture.homeScore ? "text-[#1a1a2e] font-semibold" : "text-[#999]"
                  : "text-[#1a1a2e]"
              }`}>
                {fixture.awayTeam.name}
              </span>
              {fixture.awayTeam.record && (
                <span className="text-[11px] text-[#ccc]">{fixture.awayTeam.record}</span>
              )}
            </div>
          </div>

          {/* Score / Time */}
          {(isLive || isCompleted) ? (
            <div className="text-right">
              <div className={`text-[16px] font-bold ${isLive ? "text-[#ff3b30]" : "text-[#1a1a2e]"}`}>
                {fixture.homeScore}
              </div>
              <div className={`text-[16px] font-bold ${isLive ? "text-[#ff3b30]" : "text-[#1a1a2e]"}`}>
                {fixture.awayScore}
              </div>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-[14px] font-bold text-[#1a1a2e]">{fixture.matchTime}</div>
              <div className="text-[11px] text-[#bbb]">{formatDate(fixture.matchDate)}</div>
            </div>
          )}

          {/* Venue */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#bbb] min-w-[140px]">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{fixture.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
