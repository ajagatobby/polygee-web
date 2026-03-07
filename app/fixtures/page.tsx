"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { Tabs } from "@/components/ui/tabs";
import { getFixturesByLeague, fixtures, formatDateLong } from "@/lib/mock-data";
import { dropdownVariants, duration, easing } from "@/lib/animations";

type FixtureFilter = "all" | "scheduled" | "live" | "completed";

const weeks = Array.from({ length: 38 }, (_, i) => `Week ${i + 1}`);

export default function FixturesPage() {
  const [activeLeague, setActiveLeague] = useState("premier-league");
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");
  const [weekFilter, setWeekFilter] = useState("Week 29");
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const weekDropdownRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#1552f0]" />
                  <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                    Fixtures
                  </h1>
                </div>

                {/* Week selector */}
                <div className="flex items-center gap-1" ref={weekDropdownRef}>
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
                      <motion.div
                        animate={{ rotate: weekDropdownOpen ? 180 : 0 }}
                        transition={{ duration: duration.normal, ease: easing.easeInOut }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {weekDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 top-[calc(100%+4px)] z-50 w-[140px] max-h-[280px] overflow-y-auto scrollbar-thin bg-white border border-[#e8e8e8] rounded-[10px] shadow-lg py-1"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
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
