"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { motion } from "motion/react";
import { PriceButton } from "@/components/ui/price-button";
import type { ApiEnrichedFixture } from "@/types/api";
import {
  probToPercent,
  formatTime,
  isMatchLive,
  getStatusLabel,
  getAiPick,
  getTeamShortName,
} from "@/lib/utils";
import { useTeamColor } from "@/lib/hooks/use-team-color";
import { duration, easing } from "@/lib/animations";

// ─── Component ─────────────────────────────────────────────────────────

interface PredictionCardProps {
  data: ApiEnrichedFixture;
}

export function PredictionCard({ data }: PredictionCardProps) {
  const { fixture, homeTeam, awayTeam, prediction } = data;
  const isLive = isMatchLive(fixture.status);

  // Probabilities as percentages
  const homeProb = probToPercent(prediction?.homeWinProb);
  const drawProb = probToPercent(prediction?.drawProb);
  const awayProb = probToPercent(prediction?.awayWinProb);

  // Team colors: prefer API kit > logo extraction > static map > default
  const homeColor = useTeamColor(homeTeam.id, homeTeam.logo, homeTeam.teamColors?.player?.primary);
  const awayColor = useTeamColor(awayTeam.id, awayTeam.logo, awayTeam.teamColors?.player?.primary);

  // AI pick (highest probability outcome)
  const aiPick = prediction
    ? getAiPick(
        prediction.homeWinProb,
        prediction.drawProb,
        prediction.awayWinProb,
      )
    : null;

  const aiPickLabel =
    aiPick?.team === "home"
      ? getTeamShortName(homeTeam.shortName, homeTeam.name)
      : aiPick?.team === "away"
        ? getTeamShortName(awayTeam.shortName, awayTeam.name)
        : "Draw";

  const aiPickColor =
    aiPick?.team === "home"
      ? homeColor
      : aiPick?.team === "away"
        ? awayColor
        : "#808080";

  const confidence = prediction?.confidence ?? 0;

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
          {/* Top row: status + confidence + AI pick + Game View */}
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
                    <p className="text-xs font-semibold">
                      <span className="text-[#1a1a2e]">
                        {getStatusLabel(fixture.status, fixture.elapsed)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-semibold text-[#1a1a2e]">
                    {formatTime(fixture.date)}
                  </p>
                )}
              </div>

              {/* Confidence badge */}
              {confidence > 0 && (
                <span className="text-xs text-[#808080] font-semibold whitespace-nowrap shrink-0">
                  {confidence}/10
                </span>
              )}

              {/* AI Pick badge */}
              {aiPick && prediction && (
                <div
                  className="flex items-center gap-1 h-[22px] px-2 rounded-full shrink-0"
                  style={{ backgroundColor: aiPickColor + "14" }}
                >
                  <Brain className="w-3 h-3" style={{ color: aiPickColor }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: aiPickColor }}
                  >
                    {aiPickLabel}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: aiPickColor, opacity: 0.7 }}
                  >
                    {probToPercent(aiPick.probability)}%
                  </span>
                </div>
              )}

              {/* League name */}
              <span className="text-[10px] text-[#bbb] font-medium truncate hidden sm:inline">
                {fixture.leagueName}
              </span>
            </div>

            {/* Game View link */}
            <div className="flex overflow-visible gap-1 shrink-0">
              <Link
                href={`/prediction/${fixture.id}`}
                className="flex h-[32px] group gap-1 items-center justify-center rounded-lg pr-2.5 pl-2 bg-[#f5f5f5] hover:bg-[#ebebeb] cursor-pointer transition-colors"
              >
                <span className="flex items-center">
                  <span className="text-[#1a1a2e] text-xs font-medium">Game View</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 18 18">
                  <polyline points="6.5 2.75 12.75 9 6.5 15.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Main content: teams + 3 outcome buttons */}
          <div className="flex w-full gap-3 flex-row">
            {/* Teams + Scores (left side) */}
            <div className="flex justify-between lg:min-w-0 lg:flex-1 lg:shrink-0">
              <div
                className="grid gap-x-3 items-center lg:self-center lg:flex-1 lg:min-w-0 relative w-full"
                style={{
                  gridTemplateColumns: isLive || fixture.goalsHome != null ? "28px min-content auto" : "min-content auto",
                  gridTemplateRows: "40px 40px",
                  gap: "8px 12px",
                }}
              >
                {/* Home team row */}
                {(isLive || fixture.goalsHome != null) && (
                  <div className="flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 bg-[#f0f0f0] text-[#1a1a2e]">
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
                  <span className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap truncate">
                    {homeTeam.name || "Home"}
                  </span>
                  {aiPick?.team === "home" && prediction && (
                    <span
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: homeColor + "18",
                        color: homeColor,
                      }}
                    >
                      AI Pick
                    </span>
                  )}
                </div>

                {/* Away team row */}
                {(isLive || fixture.goalsAway != null) && (
                  <div className="flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 bg-[#f0f0f0] text-[#1a1a2e]">
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
                  <span className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap truncate">
                    {awayTeam.name || "Away"}
                  </span>
                  {aiPick?.team === "away" && prediction && (
                    <span
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: awayColor + "18",
                        color: awayColor,
                      }}
                    >
                      AI Pick
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3 outcome buttons: Home Win / Draw / Away Win */}
            <div className="flex flex-col gap-2 shrink-0 w-[130px]">
              {prediction ? (
                <>
                  <PriceButton
                    label={homeShort}
                    price={homeProb}
                    color="custom"
                    customColor={homeColor}
                    size="sm"
                  />
                  <PriceButton
                    label="DRAW"
                    price={drawProb}
                    color="gray"
                    size="sm"
                    dimmed
                  />
                  <PriceButton
                    label={awayShort}
                    price={awayProb}
                    color="custom"
                    customColor={awayColor}
                    size="sm"
                    dimmed
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-[11px] text-[#bbb] font-medium">
                  No prediction
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
