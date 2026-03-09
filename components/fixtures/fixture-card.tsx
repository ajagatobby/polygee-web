"use client";

import { useState } from "react";
import { MapPin, Bell, BellOff } from "lucide-react";
import { motion } from "motion/react";
import type { ApiEnrichedFixture } from "@/types/api";
import {
  formatTime,
  isMatchLive,
  isMatchFinished,
  getStatusLabel,
  getTeamShortName,
} from "@/lib/utils";
import { duration, easing } from "@/lib/animations";

interface FixtureCardProps {
  data: ApiEnrichedFixture;
}

// 3D outcome button matching PriceButton style — label only, no percentage
function OutcomeButton({
  label,
  color,
  dimmed = false,
}: {
  label: string;
  color: "custom" | "gray";
  dimmed?: boolean;
}) {
  const [tapState, setTapState] = useState<"rest" | "pressed">("rest");

  const height = 33;
  const shadowHeight = 3;
  const hoverOffset = 2;

  const isGray = color === "gray";
  const bg = isGray ? "var(--color-bg-tertiary, #eef1f5)" : "#1a1a2e";
  const textColor = isGray ? "var(--color-text-primary, #0d1117)" : "#fff";
  const shadowOpacity = isGray ? 0.08 : 0.15;

  const currentShadowHeight = tapState === "pressed" ? Math.max(shadowHeight - 2, 1) : shadowHeight;
  const translateY = tapState === "pressed" ? hoverOffset : 0;

  return (
    <span
      className={`${dimmed ? "opacity-60" : "opacity-100"} transition-opacity duration-100`}
      style={{ display: "flex", height: `${height + (shadowHeight - currentShadowHeight)}px`, flex: "1 1 0%", width: "100%", maxWidth: "100%" }}
    >
      <button
        type="button"
        onPointerDown={() => setTapState("pressed")}
        onPointerUp={() => setTapState("rest")}
        onPointerLeave={() => setTapState("rest")}
        className="relative w-full max-w-full select-none cursor-pointer rounded-[8px] transition-all duration-100 ease-out"
        style={{
          height: `${height}px`,
          background: bg,
          color: textColor,
          boxShadow: `0px -${currentShadowHeight}px 0px 0px rgba(0, 0, 0, ${shadowOpacity}) inset`,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span className="flex w-full h-full items-center justify-center">
          <span className="uppercase leading-[21px] tracking-[0.15px] text-xs font-semibold">
            {label}
          </span>
        </span>
      </button>
    </span>
  );
}

export function FixtureCard({ data }: FixtureCardProps) {
  const { fixture, homeTeam, awayTeam } = data;
  const isLive = isMatchLive(fixture.status);
  const isCompleted = isMatchFinished(fixture.status);
  const [subscribed, setSubscribed] = useState(false);

  // Short team names (3-letter code or last word)
  const homeShort = getTeamShortName(homeTeam.shortName, homeTeam.name);
  const awayShort = getTeamShortName(awayTeam.shortName, awayTeam.name);

  return (
    <div className="pb-2 w-full">
      <motion.div
        className="w-full bg-white rounded-xl border border-[#e8e8e8] overflow-hidden"
        whileHover={{
          y: -2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          borderColor: "#ddd",
        }}
        transition={{ duration: duration.fast, ease: easing.ease }}
      >
        <div className="flex flex-col w-full p-3">
          {/* Top row: status + league + venue + subscribe */}
          <div className="flex flex-1 justify-between items-center h-[32px] min-h-[32px] gap-2 mb-3">
            <div className="flex flex-1 items-center gap-2.5 min-w-0">
              {/* Live indicator or time */}
              <div className="h-5 flex justify-start items-center gap-2.5 whitespace-nowrap shrink-0">
                {isLive ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      <div className="relative flex items-center justify-center">
                        <div className="w-[7px] h-[7px] rounded-full bg-red-500 relative z-10" />
                        <div className="absolute -inset-px w-[9px] h-[9px] rounded-full bg-red-500 opacity-75 animate-ping" />
                      </div>
                      <p className="text-xs text-red-500 uppercase ml-1 font-bold">Live</p>
                    </div>
                    <p className="text-xs font-semibold text-[#1a1a2e]">
                      {getStatusLabel(fixture.status, fixture.elapsed)}
                    </p>
                  </>
                ) : isCompleted ? (
                  <p className="text-xs font-bold text-[#999]">
                    {getStatusLabel(fixture.status, fixture.elapsed)}
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-[#1a1a2e]">
                    {formatTime(fixture.date)}
                  </p>
                )}
              </div>

              {/* League */}
              <span className="text-xs text-[#808080] font-semibold whitespace-nowrap shrink-0">
                {fixture.leagueName}
              </span>

              {/* Round badge */}
              {fixture.round && (
                <span className="flex items-center h-[20px] px-1.5 rounded text-[10px] font-semibold text-[#999] bg-[#f5f5f5] shrink-0">
                  {fixture.round}
                </span>
              )}

              {/* Venue */}
              {fixture.venueName && (
                <span className="hidden sm:flex items-center gap-1 text-[10px] text-[#bbb] min-w-0 shrink-0">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[100px]">{fixture.venueName}</span>
                </span>
              )}
            </div>

            {/* Subscribe button */}
            <div className="flex overflow-visible gap-1 shrink-0">
              <button
                onClick={() => setSubscribed((prev) => !prev)}
                className={`
                  flex h-[32px] gap-1.5 items-center justify-center rounded-lg px-2.5 cursor-pointer transition-colors
                  ${subscribed
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#1a1a2e]"
                  }
                `}
              >
                {subscribed ? (
                  <BellOff className="w-3 h-3" />
                ) : (
                  <Bell className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {subscribed ? "Subscribed" : "Subscribe"}
                </span>
              </button>
            </div>
          </div>

          {/* Main content: teams + 3 outcome buttons */}
          <div className="flex w-full gap-3 flex-row">
            {/* Teams + Scores (left side) */}
            <div className="flex justify-between lg:min-w-0 lg:flex-1 lg:shrink-0">
              <div
                className="grid gap-x-3 items-center lg:self-center lg:flex-1 lg:min-w-0 relative w-full"
                style={{
                  gridTemplateColumns: (isLive || isCompleted) ? "28px min-content auto" : "min-content auto",
                  gridTemplateRows: "40px 40px",
                  gap: "8px 12px",
                }}
              >
                {/* Home team row */}
                {(isLive || isCompleted) && (
                  <div className={`flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 ${
                    isLive ? "bg-red-50 text-[#ff3b30]" : "bg-[#f0f0f0] text-[#1a1a2e]"
                  }`}>
                    {fixture.goalsHome ?? 0}
                  </div>
                )}
                <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center self-center">
                  {homeTeam.logo ? (
                    <img
                      src={homeTeam.logo}
                      alt={homeTeam.name || ""}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#e8e8e8]" />
                  )}
                </div>
                <div className="flex flex-1 items-center min-w-0 max-w-full gap-[5px] overflow-hidden">
                  <span className={`text-sm font-semibold whitespace-nowrap truncate ${
                    isCompleted && fixture.goalsHome != null && fixture.goalsAway != null
                      ? fixture.goalsHome > fixture.goalsAway ? "text-[#1a1a2e]" : "text-[#bbb]"
                      : "text-[#1a1a2e]"
                  }`}>
                    {homeTeam.name || "Home"}
                  </span>
                </div>

                {/* Away team row */}
                {(isLive || isCompleted) && (
                  <div className={`flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 ${
                    isLive ? "bg-red-50 text-[#ff3b30]" : "bg-[#f0f0f0] text-[#1a1a2e]"
                  }`}>
                    {fixture.goalsAway ?? 0}
                  </div>
                )}
                <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center self-center">
                  {awayTeam.logo ? (
                    <img
                      src={awayTeam.logo}
                      alt={awayTeam.name || ""}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#e8e8e8]" />
                  )}
                </div>
                <div className="flex flex-1 items-center min-w-0 max-w-full gap-[5px] overflow-hidden">
                  <span className={`text-sm font-semibold whitespace-nowrap truncate ${
                    isCompleted && fixture.goalsHome != null && fixture.goalsAway != null
                      ? fixture.goalsAway > fixture.goalsHome ? "text-[#1a1a2e]" : "text-[#bbb]"
                      : "text-[#1a1a2e]"
                  }`}>
                    {awayTeam.name || "Away"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 outcome buttons: Home Win / Draw / Away Win */}
            <div className="flex flex-col gap-2 shrink-0 w-[130px]">
              <OutcomeButton
                label={homeShort}
                color="custom"
              />
              <OutcomeButton
                label="DRAW"
                color="gray"
                dimmed
              />
              <OutcomeButton
                label={awayShort}
                color="custom"
                dimmed
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
