"use client";

import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { Tabs } from "@/components/ui/tabs";
import { getFixturesByLeague, fixtures, formatDateLong } from "@/lib/mock-data";
import { duration, easing } from "@/lib/animations";

type FixtureFilter = "all" | "scheduled" | "live" | "completed";

export default function FixturesPage() {
  const [activeLeague, setActiveLeague] = useState("premier-league");
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFilterChange = (filter: FixtureFilter) => {
    setHasInteracted(true);
    setActiveFilter(filter);
  };

  const handleLeagueChange = (slug: string) => {
    setHasInteracted(true);
    setActiveLeague(slug);
  };

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

  const liveCount = fixtures.filter((f) => f.status === "live").length;

  const filterTabs = [
    { id: "all" as const, label: "All", count: fixtures.length },
    { id: "scheduled" as const, label: "Upcoming", count: fixtures.filter((f) => f.status === "scheduled").length },
    { id: "live" as const, label: "Live", count: liveCount, dot: liveCount > 0 },
    { id: "completed" as const, label: "Results", count: fixtures.filter((f) => f.status === "completed").length },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeLeague={activeLeague} onLeagueChange={handleLeagueChange} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Header */}
          <div className="border-b border-[#f0f0f0]">
            <div className="px-10 pt-5 pb-4">
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
          </div>

          {/* Status Filter Tabs */}
          <div className="border-b border-[#f0f0f0]">
            <Tabs
              tabs={filterTabs}
              activeTab={activeFilter}
              onTabChange={(id) => handleFilterChange(id as FixtureFilter)}
              layoutId="fixtures-filter"
              className="px-10"
            />
          </div>

          {/* Fixtures grouped by date */}
          <div className="px-10 pt-4 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeLeague}-${activeFilter}`}
                initial={hasInteracted ? { opacity: 0, filter: "blur(4px)" } : false}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: duration.normal, ease: easing.easeOut }}
              >
                {groupedFixtures.map(([date, dateFixtures]) => (
                  <div key={date} className="mb-5">
                    {/* Date Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                        {formatDateLong(date)}
                      </h2>
                      <span className="text-[11px] text-[#bbb] font-medium">
                        {dateFixtures.length} {dateFixtures.length === 1 ? "match" : "matches"}
                      </span>
                    </div>

                    {/* 2-column grid of fixture cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dateFixtures.map((fixture) => (
                        <FixtureCard key={fixture.id} fixture={fixture} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

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
          </div>
        </main>
      </div>
    </div>
  );
}
