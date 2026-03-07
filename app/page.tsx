"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { predictions, formatDateLong } from "@/lib/mock-data";
import { Prediction } from "@/types";

export default function HomePage() {
  const [activeLeague, setActiveLeague] = useState("premier-league");
  const [weekFilter, setWeekFilter] = useState("Week 29");

  // Get the active league name
  const activeLeagueName = useMemo(() => {
    if (activeLeague === "all") return "All Leagues";
    const p = predictions.find((p) => p.league.slug === activeLeague);
    return p?.league.name || "Premier League";
  }, [activeLeague]);

  // Filter predictions by league
  const filteredPredictions = useMemo(() => {
    if (activeLeague === "all") return predictions;
    return predictions.filter((p) => p.league.slug === activeLeague);
  }, [activeLeague]);

  // Group by date
  const groupedPredictions = useMemo(() => {
    const groups: Record<string, Prediction[]> = {};
    filteredPredictions.forEach((pred) => {
      if (!groups[pred.matchDate]) groups[pred.matchDate] = [];
      groups[pred.matchDate].push(pred);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPredictions]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeLeague={activeLeague} onLeagueChange={setActiveLeague} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
          {/* League header */}
          <div className="px-6 pt-6 pb-4 bg-white border-b border-[#f0f0f0]">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-[24px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                {activeLeagueName}
              </h1>
              <div className="flex items-center gap-2">
                {/* Week selector */}
                <button className="flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium text-[#1a1a2e] bg-white border border-[#e8e8e8] rounded-[8px] hover:border-[#ccc] transition-colors cursor-pointer">
                  {weekFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
                </button>
                <button className="p-2 text-[#999] hover:text-[#666] transition-colors cursor-pointer">
                  <SlidersHorizontal className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
            <p className="text-[13px] text-[#999]">
              AI-powered match predictions and outcome probabilities.
            </p>
          </div>

          {/* Predictions grid grouped by date */}
          <div className="px-6 py-5">
            {groupedPredictions.map(([date, preds]) => (
              <div key={date} className="mb-6 last:mb-0">
                {/* Date header */}
                <div className="mb-3">
                  <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                    {formatDateLong(date)}
                  </h2>
                </div>

                {/* 3-column grid of prediction cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {preds.map((pred) => (
                    <PredictionCard key={pred.id} prediction={pred} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPredictions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-[40px] mb-3">&#9917;</div>
              <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                No predictions found
              </h3>
              <p className="text-[13px] text-[#999]">
                Try selecting a different league.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
