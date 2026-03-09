"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { Tabs } from "@/components/ui/tabs";
import { useTodayFixtures, useUpcomingFixtures } from "@/lib/hooks/use-fixtures";
import { useLiveSocket } from "@/lib/hooks/use-live-socket";
import { dropdownVariants, duration, easing } from "@/lib/animations";
import { formatDateLong, isMatchLive, isMatchFinished, isMatchUpcoming } from "@/lib/utils";
import type { ApiEnrichedFixture } from "@/types/api";

type FixtureFilter = "all" | "upcoming" | "live" | "completed";

// Generate date options: today + next 6 days
function getDateOptions(): { label: string; value: string }[] {
  const options: { label: string; value: string }[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    let label: string;
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";
    else {
      label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
    options.push({ label, value: iso });
  }
  return options;
}

export default function FixturesPage() {
  const [activeLeague, setActiveLeague] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<FixtureFilter>("all");
  const [hasInteracted, setHasInteracted] = useState(false);

  const dateOptions = useMemo(() => getDateOptions(), []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].value);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const currentDateIndex = dateOptions.findIndex((d) => d.value === selectedDate);

  // Connect to live WebSocket for real-time score updates
  useLiveSocket({ enabled: true });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
        setDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Convert activeLeague to leagueId filter
  const leagueIdFilter = activeLeague !== "all" ? Number(activeLeague) : undefined;

  // For "today" we use the today endpoint; for other dates we use upcoming with a date filter
  const isToday = selectedDate === dateOptions[0].value;

  const todayQuery = useTodayFixtures(
    isToday
      ? {
          leagueId: leagueIdFilter,
        }
      : undefined,
  );

  const upcomingQuery = useUpcomingFixtures(
    !isToday
      ? {
          date: selectedDate,
          leagueId: leagueIdFilter,
        }
      : undefined,
  );

  const { data: fixturesResponse, isLoading, error } = isToday ? todayQuery : upcomingQuery;

  const allFixtures = fixturesResponse?.data ?? [];

  // Client-side status filtering
  const filteredFixtures = useMemo(() => {
    if (activeFilter === "all") return allFixtures;
    return allFixtures.filter((item) => {
      const status = item.fixture.status;
      switch (activeFilter) {
        case "live":
          return isMatchLive(status);
        case "completed":
          return isMatchFinished(status);
        case "upcoming":
          return isMatchUpcoming(status);
        default:
          return true;
      }
    });
  }, [allFixtures, activeFilter]);

  // Counts for tab badges
  const liveCount = allFixtures.filter((f) => isMatchLive(f.fixture.status)).length;
  const upcomingCount = allFixtures.filter((f) => isMatchUpcoming(f.fixture.status)).length;
  const completedCount = allFixtures.filter((f) => isMatchFinished(f.fixture.status)).length;

  // Group fixtures by date
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, ApiEnrichedFixture[]> = {};
    filteredFixtures.forEach((item) => {
      const dateKey = item.fixture.date.split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredFixtures]);

  const goToPrevDate = () => {
    if (currentDateIndex > 0) setSelectedDate(dateOptions[currentDateIndex - 1].value);
  };

  const goToNextDate = () => {
    if (currentDateIndex < dateOptions.length - 1) setSelectedDate(dateOptions[currentDateIndex + 1].value);
  };

  const handleFilterChange = (filter: FixtureFilter) => {
    setHasInteracted(true);
    setActiveFilter(filter);
  };

  const handleLeagueChange = (slug: string) => {
    setHasInteracted(true);
    setActiveLeague(slug);
  };

  const selectedDateLabel = dateOptions.find((d) => d.value === selectedDate)?.label ?? selectedDate;

  const filterTabs = [
    { id: "all" as const, label: "All", count: allFixtures.length },
    { id: "upcoming" as const, label: "Upcoming", count: upcomingCount },
    { id: "live" as const, label: "Live", count: liveCount, dot: liveCount > 0 },
    { id: "completed" as const, label: "Results", count: completedCount },
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

                {/* Date selector */}
                <div className="flex items-center gap-1" ref={dateDropdownRef}>
                  <button
                    onClick={goToPrevDate}
                    disabled={currentDateIndex <= 0}
                    className="p-1.5 text-[#999] hover:text-[#666] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setDateDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-1.5 h-[34px] px-3 text-[13px] font-medium text-[#1a1a2e] bg-white border border-[#e8e8e8] rounded-[8px] hover:border-[#ccc] transition-colors cursor-pointer"
                    >
                      {selectedDateLabel}
                      <motion.div
                        animate={{ rotate: dateDropdownOpen ? 180 : 0 }}
                        transition={{ duration: duration.normal, ease: easing.easeInOut }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {dateDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 top-[calc(100%+4px)] z-50 w-[180px] max-h-[280px] overflow-y-auto scrollbar-thin bg-white border border-[#e8e8e8] rounded-[10px] shadow-lg py-1"
                        >
                          {dateOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSelectedDate(opt.value);
                                setDateDropdownOpen(false);
                                setHasInteracted(true);
                              }}
                              className={`
                                w-full text-left px-3 py-2 text-[13px] transition-colors cursor-pointer
                                ${opt.value === selectedDate
                                  ? "bg-neutral-50 font-semibold text-[#1a1a2e]"
                                  : "text-[#666] hover:bg-neutral-50 hover:text-[#1a1a2e]"
                                }
                              `}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={goToNextDate}
                    disabled={currentDateIndex >= dateOptions.length - 1}
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

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#1552f0] animate-spin mb-3" />
              <p className="text-[13px] text-[#999]">Loading fixtures...</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-[40px] mb-3">&#9888;&#65039;</div>
              <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                Failed to load fixtures
              </h3>
              <p className="text-[13px] text-[#999]">
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* Fixtures grouped by date */}
          {!isLoading && !error && (
            <div className="px-10 pt-4 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeLeague}-${activeFilter}-${selectedDate}`}
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
                        {dateFixtures.map((item) => (
                          <FixtureCard key={item.fixture.id} data={item} />
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
                    Try selecting a different date or league.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
