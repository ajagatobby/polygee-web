"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { useTodayFixtures } from "@/lib/hooks/use-fixtures";
import { useLiveSocket } from "@/lib/hooks/use-live-socket";
import { dropdownVariants, duration, easing } from "@/lib/animations";
import { useAuth } from "@/lib/auth-context";
import { formatDateLong } from "@/lib/utils";
import type { ApiEnrichedFixture } from "@/types/api";

export default function HomePage() {
  const [activeLeague, setActiveLeague] = useState<string>("all");
  const [hasInteracted, setHasInteracted] = useState(false);
  const { isAuthenticated, isPro } = useAuth();

  // Convert activeLeague to leagueId filter (if not "all")
  const leagueIdFilter = activeLeague !== "all" ? Number(activeLeague) : undefined;

  // Fetch today's fixtures with predictions from the API
  const { data: todayData, isLoading, error } = useTodayFixtures(
    leagueIdFilter ? { leagueId: leagueIdFilter } : undefined,
  );

  const fixtures = todayData?.data ?? [];

  // Connect to live WebSocket — patches TanStack Query cache for real-time score updates
  useLiveSocket({ enabled: true });

  const handleLeagueChange = (slug: string) => {
    setHasInteracted(true);
    setActiveLeague(slug);
  };

  // Gating: unauthenticated or free users see limited predictions
  const maxFreeCards = 2;
  const shouldGate = !isAuthenticated || !isPro;

  // Get the active league name from the first fixture
  const activeLeagueName = useMemo(() => {
    if (activeLeague === "all") return "All Leagues";
    const match = fixtures.find(
      (f) => f.fixture.leagueId === Number(activeLeague),
    );
    return match?.fixture.leagueName || "All Leagues";
  }, [activeLeague, fixtures]);

  // Group fixtures by date
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, ApiEnrichedFixture[]> = {};
    fixtures.forEach((item) => {
      const dateKey = item.fixture.date.split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [fixtures]);

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
          {/* League header */}
          <div className="border-b border-[#f0f0f0]">
            <div className="px-10 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={activeLeagueName}
                    className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]"
                    initial={hasInteracted ? { opacity: 0, x: -8 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: duration.normal, ease: easing.easeOut }}
                  >
                    {activeLeagueName}
                  </motion.h1>
                </AnimatePresence>

                {/* Date label */}
                <span className="text-[13px] font-medium text-[#808080]">
                  {todayData?.date
                    ? formatDateLong(todayData.date)
                    : "Today"}
                </span>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#1552f0] animate-spin mb-3" />
              <p className="text-[13px] text-[#999]">Loading predictions...</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-[40px] mb-3">&#9888;&#65039;</div>
              <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                Failed to load predictions
              </h3>
              <p className="text-[13px] text-[#999]">
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* Predictions list grouped by date */}
          {!isLoading && !error && (
            <div className="px-10 pt-2 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLeague}
                  initial={hasInteracted ? { opacity: 0, filter: "blur(4px)" } : false}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: duration.normal, ease: easing.easeOut }}
                >
                  {(() => {
                    let cardCount = 0;
                    return groupedFixtures.map(([date, items]) => {
                      const dateCards = items.map((item) => {
                        const index = cardCount++;
                        const isBlurred = shouldGate && index >= maxFreeCards;
                        return (
                          <div
                            key={item.fixture.id}
                            className={isBlurred ? "select-none pointer-events-none" : ""}
                            style={isBlurred ? { filter: "blur(8px)", opacity: 0.6 } : undefined}
                          >
                            <PredictionCard data={item} />
                          </div>
                        );
                      });

                      return (
                        <div key={date}>
                          <div className="px-1 py-2.5">
                            <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                              {formatDateLong(date)}
                            </h2>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
                            {dateCards}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Upgrade / sign-up overlay for gated users */}
              {shouldGate && fixtures.length > maxFreeCards && (
                <div className="sticky bottom-0 left-0 right-0 z-10 -mt-32">
                  <div
                    className="h-40 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, transparent 0%, white 70%)",
                    }}
                  />
                  <div className="bg-white pb-10 pt-2 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#e7edfe] mb-3">
                      <motion.svg
                        width="20"
                        height="20"
                        viewBox="0 -4 24 28"
                        fill="none"
                        stroke="#1552f0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.rect
                          x="3" y="11" width="18" height="11" rx="2" ry="2"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.8, ease: easing.easeOut }}
                        />
                        <motion.g
                          animate={{
                            translateY: [0, 0, -3, -3, 0, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.25, 0.4, 0.6, 0.75, 1],
                          }}
                        >
                          <motion.path
                            d="M7 11V7a5 5 0 0 1 10 0v4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: easing.easeOut, delay: 0.3 }}
                          />
                        </motion.g>
                        <motion.circle
                          cx="12" cy="16.5" r="1"
                          fill="#1552f0"
                          stroke="none"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.9, ease: easing.easeOut }}
                        />
                      </motion.svg>
                    </div>
                    <h3 className="text-[17px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                      {isAuthenticated
                        ? "Upgrade to Pro for all predictions"
                        : "Sign up to see all predictions"}
                    </h3>
                    <p className="text-[13px] text-[#808080] mt-1 max-w-[340px]">
                      {isAuthenticated
                        ? "Unlock every AI prediction, detailed match analysis, and value bets with a Pro subscription."
                        : "Create a free account to get started, or go Pro for unlimited predictions and analysis."}
                    </p>
                    <div className="flex items-center gap-2.5 mt-4">
                      {isAuthenticated ? (
                        <Link
                          href="/pricing"
                          className="flex items-center h-[38px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
                        >
                          View Pro Plans
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/sign-in"
                            className="flex items-center h-[38px] px-5 text-[13px] font-medium text-[#1a1a2e] bg-[#f5f5f5] rounded-[8px] hover:bg-[#ebebeb] transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/sign-up"
                            className="flex items-center h-[38px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
                          >
                            Sign Up Free
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && fixtures.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-[40px] mb-3">&#9917;</div>
              <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
                No predictions for today
              </h3>
              <p className="text-[13px] text-[#999]">
                Check back later or try a different league.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
