"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <div
      className="group border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#fafafa] transition-colors"
      onClick={() => onSelect?.(prediction)}
    >
      <div className="px-4 py-3">
        {/* Top row: status + volume + game view link */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            {isLive && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#ff3b30] animate-pulse-soft" />
                  <span className="text-[12px] font-bold text-[#ff3b30]">LIVE</span>
                </span>
                <span className="text-[12px] text-[#999] font-medium">HT</span>
              </>
            )}
            {!isLive && (
              <span className="text-[12px] text-[#999] font-medium">
                {prediction.matchTime}
              </span>
            )}
            <span className="text-[12px] text-[#999] font-medium">
              {formatVolume(prediction.totalVolume)} Vol.
            </span>
          </div>
          <Link
            href={`/prediction/${prediction.id}`}
            className="flex items-center gap-1 text-[12px] text-[#999] hover:text-[#666] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="w-[20px] h-[20px] rounded-[4px] bg-[#f0f0f0] flex items-center justify-center text-[10px] font-bold text-[#999]">
              {prediction.matchCount || 12}
            </span>
            <span className="font-medium">Game View</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Game content grid */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center">
          {/* Teams column */}
          <div className="space-y-1">
            {/* Home team */}
            <div className="flex items-center gap-2">
              {isLive && (
                <span className="w-[22px] text-center text-[13px] font-bold text-[#1a1a2e]">
                  {prediction.homeScore}
                </span>
              )}
              <span className="text-[15px]">{prediction.homeTeam.logo}</span>
              <span className="text-[13px] font-medium text-[#1a1a2e]">
                {prediction.homeTeam.name}
              </span>
              {prediction.homeTeam.record && (
                <span className="text-[11px] text-[#bbb] font-normal">
                  {prediction.homeTeam.record}
                </span>
              )}
            </div>
            {/* Away team */}
            <div className="flex items-center gap-2">
              {isLive && (
                <span className="w-[22px] text-center text-[13px] font-bold text-[#1a1a2e]">
                  {prediction.awayScore}
                </span>
              )}
              <span className="text-[15px]">{prediction.awayTeam.logo}</span>
              <span className="text-[13px] font-medium text-[#1a1a2e]">
                {prediction.awayTeam.name}
              </span>
              {prediction.awayTeam.record && (
                <span className="text-[11px] text-[#bbb] font-normal">
                  {prediction.awayTeam.record}
                </span>
              )}
            </div>
          </div>

          {/* Moneyline column */}
          <div className="space-y-1 min-w-[100px]">
            <PriceButton
              label={prediction.homeTeam.shortName}
              price={prediction.moneyline.home}
              color={prediction.homeTeam.color}
              size="sm"
              className="w-full"
            />
            <PriceButton
              label="DRAW"
              price={prediction.moneyline.draw}
              color="#808080"
              variant="outline"
              size="sm"
              className="w-full"
            />
            <PriceButton
              label={prediction.awayTeam.shortName}
              price={prediction.moneyline.away}
              color={prediction.awayTeam.color}
              size="sm"
              className="w-full"
            />
          </div>

          {/* Spread column */}
          <div className="space-y-1 min-w-[105px]">
            <PriceButton
              label={prediction.spread.homeLabel}
              price={prediction.spread.homePrice}
              variant="outline"
              size="sm"
              className="w-full"
            />
            <div className="h-[30px]" />
            <PriceButton
              label={prediction.spread.awayLabel}
              price={prediction.spread.awayPrice}
              variant="outline"
              size="sm"
              className="w-full"
            />
          </div>

          {/* Total column */}
          <div className="space-y-1 min-w-[90px]">
            <PriceButton
              label={prediction.total.overLabel}
              price={prediction.total.overPrice}
              variant="outline"
              size="sm"
              className="w-full"
            />
            <div className="h-[30px]" />
            <PriceButton
              label={prediction.total.underLabel}
              price={prediction.total.underPrice}
              variant="outline"
              size="sm"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
