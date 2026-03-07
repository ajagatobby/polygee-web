"use client";

import Link from "next/link";
import { PriceButton } from "@/components/ui/price-button";
import { Prediction } from "@/types";
import { formatVolume } from "@/lib/mock-data";

interface GameRowProps {
  prediction: Prediction;
  onSelect?: (prediction: Prediction) => void;
}

export function GameRow({ prediction, onSelect }: GameRowProps) {
  const isLive = prediction.status === "live";

  return (
    <div className="pb-2 w-full">
      <div
        className="w-full bg-white rounded-xl border border-[#e8e8e8] overflow-hidden cursor-pointer hover:bg-[#fafafa]/50 transition-colors"
        onClick={() => onSelect?.(prediction)}
      >
        <div className="flex flex-col w-full p-3">
          {/* Top row: status + volume + Game View */}
          <div className="flex flex-1 justify-between items-center h-[32px] min-h-[32px] gap-2 mb-3">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
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
                        <span className="text-[#1a1a2e]">HT</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xs font-semibold text-[#1a1a2e]">{prediction.matchTime}</p>
                  )}
                </div>

                {/* Volume */}
                <div className="flex items-center text-xs text-[#808080] font-semibold min-w-0 overflow-hidden">
                  <span className="whitespace-nowrap shrink-0">
                    {formatVolume(prediction.totalVolume)} Vol.
                  </span>
                </div>
              </div>
            </div>

            {/* Game View link */}
            <div className="flex overflow-visible gap-1 shrink-0">
              <Link
                href={`/prediction/${prediction.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-[32px] group gap-1 items-center justify-center rounded-lg pr-2.5 pl-2 bg-[#f5f5f5] hover:bg-[#ebebeb] cursor-pointer transition-colors"
              >
                <span className="flex items-center">
                  <span className="flex items-center justify-center font-medium mr-1.5 text-[10px] px-1 py-0.5 rounded-sm text-[#808080] border border-[#ddd] border-b-2 bg-white">
                    {prediction.matchCount || 12}
                  </span>
                  <span className="text-[#1a1a2e] text-xs">Game View</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 18 18">
                  <polyline points="6.5 2.75 12.75 9 6.5 15.25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Main content: teams + buttons */}
          <div className="flex w-full gap-3 flex-row">
            {/* Teams + Scores */}
            <div className="flex justify-between lg:min-w-0 lg:flex-1 lg:shrink-0">
              <div
                className="grid gap-x-3 items-center lg:self-center lg:flex-1 lg:min-w-0 relative w-full"
                style={{
                  gridTemplateColumns: isLive ? "28px min-content auto" : "min-content auto",
                  gridTemplateRows: "40px 40px",
                  gap: "8px 12px",
                }}
              >
                {/* Home team row */}
                {isLive && (
                  <div className="flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 bg-[#f0f0f0] text-[#1a1a2e]">
                    {prediction.homeScore}
                  </div>
                )}
                <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center">
                  <span className="text-[18px] leading-none">{prediction.homeTeam.logo}</span>
                </div>
                <div className="flex flex-1 items-baseline min-w-0 max-w-full gap-[5px] overflow-hidden">
                  <span className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap truncate">
                    {prediction.homeTeam.name}
                  </span>
                  {prediction.homeTeam.record && (
                    <span className="text-xs font-normal text-[#808080] whitespace-nowrap">
                      {prediction.homeTeam.record}
                    </span>
                  )}
                </div>

                {/* Away team row */}
                {isLive && (
                  <div className="flex px-1.5 text-xs font-semibold rounded-sm justify-center items-center h-6 bg-[#f0f0f0] text-[#1a1a2e]">
                    {prediction.awayScore}
                  </div>
                )}
                <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center">
                  <span className="text-[18px] leading-none">{prediction.awayTeam.logo}</span>
                </div>
                <div className="flex flex-1 items-baseline min-w-0 max-w-full gap-[5px] overflow-hidden">
                  <span className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap truncate">
                    {prediction.awayTeam.name}
                  </span>
                  {prediction.awayTeam.record && (
                    <span className="text-xs font-normal text-[#808080] whitespace-nowrap">
                      {prediction.awayTeam.record}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons grid: 3 columns */}
            <div className="flex flex-1 justify-end">
              <div className="grid flex-1 grid-cols-3 gap-2 lg:w-[372px]">
                {/* Moneyline column: 3 stacked buttons */}
                <div className="flex w-full flex-col gap-2">
                  <PriceButton
                    label={prediction.homeTeam.shortName}
                    price={prediction.moneyline.home}
                    color="custom"
                    customColor={prediction.homeTeam.color}
                    size="sm"
                  />
                  <PriceButton
                    label="DRAW"
                    price={prediction.moneyline.draw}
                    color="gray"
                    size="sm"
                    dimmed
                  />
                  <PriceButton
                    label={prediction.awayTeam.shortName}
                    price={prediction.moneyline.away}
                    color="custom"
                    customColor={prediction.awayTeam.color}
                    size="sm"
                    dimmed
                  />
                </div>

                {/* Spread column: 2 tall buttons */}
                <div className="flex w-full flex-col gap-2">
                  <PriceButton
                    label={prediction.spread.homeLabel}
                    price={prediction.spread.homePrice}
                    color="gray"
                    size="lg"
                    dimmed
                  />
                  <PriceButton
                    label={prediction.spread.awayLabel}
                    price={prediction.spread.awayPrice}
                    color="gray"
                    size="lg"
                    dimmed
                  />
                </div>

                {/* Total column: 2 tall buttons */}
                <div className="flex w-full flex-col gap-2">
                  <PriceButton
                    label={prediction.total.overLabel}
                    price={prediction.total.overPrice}
                    color="gray"
                    size="lg"
                    dimmed
                  />
                  <PriceButton
                    label={prediction.total.underLabel}
                    price={prediction.total.underPrice}
                    color="gray"
                    size="lg"
                    dimmed
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
