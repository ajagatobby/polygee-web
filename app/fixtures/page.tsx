"use client";

import { useState, useMemo } from "react";
import { CalendarDays, Filter } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { getFixturesByLeague, fixtures, formatDateLong } from "@/lib/mock-data";

type FixtureFilter = "all" | "scheduled" | "live" | "completed";

export default function FixturesPage() {
  const [activeLeague, setActiveLeague] = useState("premier-league");
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");

  const filteredFixtures = useMemo(() => {
    let result = getFixturesByLeague(activeLeague === "all" ? "all" : activeLeague);
    if (activeFilter !== "all") {
      result = result.filter((f) => f.status === activeFilter);
    }
    return result;
  }, [activeLeague, activeFilter]);

  // Group fixtures by date
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, typeof filteredFixtures> = {};
    filteredFixtures.forEach((fixture) => {
      if (!groups[fixture.matchDate]) groups[fixture.matchDate] = [];
      groups[fixture.matchDate].push(fixture);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredFixtures]);

  const filters: { id: FixtureFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: fixtures.length },
    { id: "scheduled", label: "Upcoming", count: fixtures.filter((f) => f.status === "scheduled").length },
    { id: "live", label: "Live", count: fixtures.filter((f) => f.status === "live").length },
    { id: "completed", label: "Results", count: fixtures.filter((f) => f.status === "completed").length },
  ];

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
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5 text-[#0066FF]" />
              <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Fixtures
              </h1>
            </div>
            <p className="text-[13px] text-[#999]">
              Upcoming matches, live scores, and recent results.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f0f0f0]">
            <Filter className="w-3.5 h-3.5 text-[#bbb]" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  h-[30px] px-3 text-[12px] font-medium rounded-[20px] transition-all cursor-pointer
                  ${activeFilter === filter.id
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white text-[#666] border border-[#e8e8e8] hover:border-[#ccc]"
                  }
                `}
              >
                {filter.label}
                {filter.id === "live" && filter.count > 0 && (
                  <span className="ml-1 inline-flex w-[5px] h-[5px] bg-[#ff3b30] rounded-full animate-pulse-soft" />
                )}
              </button>
            ))}
          </div>

          {/* Fixtures grouped by date */}
          <div>
            {groupedFixtures.map(([date, dateFixtures]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="px-5 py-2.5 bg-white border-b border-[#f0f0f0]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                      {formatDateLong(date)}
                    </h2>
                    <span className="text-[11px] text-[#bbb] font-medium">
                      {dateFixtures.length} {dateFixtures.length === 1 ? "match" : "matches"}
                    </span>
                  </div>
                </div>

                {/* Fixtures List */}
                {dateFixtures.map((fixture) => (
                  <FixtureCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            ))}
          </div>

          {filteredFixtures.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-[40px] mb-3">&#128197;</div>
              <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                No fixtures found
              </h3>
              <p className="text-[13px] text-[#999]">
                Try selecting a different league or filter.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
