"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { predictions, formatDateLong } from "@/lib/mock-data";
import { Prediction } from "@/types";

const weeks = Array.from({ length: 38 }, (_, i) => `Week ${i + 1}`);

export default function HomePage() {
  const [activeLeague, setActiveLeague] = useState("premier-league");
  const [weekFilter, setWeekFilter] = useState("Week 29");
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const weekDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (weekDropdownRef.current && !weekDropdownRef.current.contains(e.target as Node)) {
        setWeekDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentWeekIndex = weeks.indexOf(weekFilter);

  const goToPrevWeek = () => {
    if (currentWeekIndex > 0) setWeekFilter(weeks[currentWeekIndex - 1]);
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) setWeekFilter(weeks[currentWeekIndex + 1]);
  };

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
        <div className="hidden lg:block">
          <Sidebar activeLeague={activeLeague} onLeagueChange={setActiveLeague} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* League header */}
          <div className="border-b border-[#f0f0f0]">
            <div className="px-10 pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                  {activeLeagueName}
                </h1>
                <button className="p-2 text-[#999] hover:text-[#666] transition-colors cursor-pointer">
                  <SlidersHorizontal className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-3">
                <button className="p-2 text-[#999] hover:text-[#666] transition-colors cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>

                {/* Week selector */}
                <div className="ml-auto flex items-center gap-1" ref={weekDropdownRef}>
                  <button
                    onClick={goToPrevWeek}
                    disabled={currentWeekIndex <= 0}
                    className="p-1.5 text-[#999] hover:text-[#666] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setWeekDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium text-[#1a1a2e] bg-white border border-[#e8e8e8] rounded-[8px] hover:border-[#ccc] transition-colors cursor-pointer"
                    >
                      {weekFilter}
                      <ChevronDown className={`w-3.5 h-3.5 text-[#999] transition-transform duration-200 ${weekDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {weekDropdownOpen && (
                      <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-[140px] max-h-[280px] overflow-y-auto scrollbar-thin bg-white border border-[#e8e8e8] rounded-[10px] shadow-lg py-1">
                        {weeks.map((week) => (
                          <button
                            key={week}
                            onClick={() => {
                              setWeekFilter(week);
                              setWeekDropdownOpen(false);
                            }}
                            className={`
                              w-full text-left px-3 py-2 text-[13px] transition-colors cursor-pointer
                              ${week === weekFilter
                                ? "bg-neutral-50 font-semibold text-[#1a1a2e]"
                                : "text-[#666] hover:bg-neutral-50 hover:text-[#1a1a2e]"
                              }
                            `}
                          >
                            {week}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={goToNextWeek}
                    disabled={currentWeekIndex >= weeks.length - 1}
                    className="p-1.5 text-[#999] hover:text-[#666] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions list grouped by date */}
          <div className="px-10 pt-2">
            {groupedPredictions.map(([date, preds]) => (
              <div key={date}>
                {/* Date header */}
                <div className="px-1 py-2.5">
                  <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                    {formatDateLong(date)}
                  </h2>
                </div>

                {/* 2-column grid of prediction cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
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
