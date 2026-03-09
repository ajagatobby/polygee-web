"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useLeagues } from "@/lib/hooks/use-leagues";
import { sidebarExpand, duration, easing } from "@/lib/animations";

interface SidebarProps {
  activeLeague: string;
  onLeagueChange: (slug: string) => void;
}

export function Sidebar({ activeLeague, onLeagueChange }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ soccer: true });
  const { data: leaguesData, isLoading } = useLeagues();

  const leagues = leaguesData?.data ?? [];

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="hidden lg:block relative w-[240px] shrink-0 sticky top-[60px] border-r border-neutral-100" style={{ height: "calc(100vh - 60px)" }}>
    <aside className="flex flex-col py-8 px-3 overflow-y-auto scrollbar-thin h-full">
      {/* Section label */}
      <div className="flex items-center pl-3 pr-3 mb-3">
        <p className="text-[11px] uppercase text-neutral-400 font-medium tracking-wider whitespace-nowrap">
          All Leagues
        </p>
      </div>

      {/* "All" option */}
      <button
        onClick={() => onLeagueChange("all")}
        className="block w-full text-left"
      >
        <div className={`
          rounded-md py-3 px-3 cursor-pointer relative transition-colors
          ${activeLeague === "all" ? "bg-neutral-50" : "hover:bg-neutral-50"}
        `}>
          <div className="flex items-center gap-x-2.5 min-w-0">
            <div className="shrink-0 w-5 h-5 flex items-center justify-center text-[14px]">
              &#9917;
            </div>
            <p className="pr-4 whitespace-nowrap truncate text-[14px] font-medium text-[#1a1a2e]">
              All Leagues
            </p>
          </div>
        </div>
      </button>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-4 h-4 text-[#999] animate-spin" />
        </div>
      )}

      {/* Soccer parent with collapsible leagues */}
      {!isLoading && leagues.length > 0 && (
        <div>
          {/* Sport parent row */}
          <button
            onClick={() => toggleExpand("soccer")}
            className="flex flex-row items-center justify-between rounded-md px-3 py-3 w-full cursor-pointer transition-colors bg-transparent hover:bg-neutral-50"
          >
            <div className="flex items-center gap-x-2.5 min-w-0">
              <div className="shrink-0 w-5 h-5 flex items-center justify-center text-[14px]">
                &#9917;
              </div>
              <p className="text-[14px] font-medium truncate text-[#1a1a2e]">
                Football
              </p>
            </div>
            <motion.div
              animate={{ rotate: expanded.soccer ? 180 : 0 }}
              transition={{ duration: duration.normal, ease: easing.easeInOut }}
            >
              <ChevronDown className="w-3 h-3 shrink-0 text-neutral-400" />
            </motion.div>
          </button>

          {/* Collapsible leagues */}
          <AnimatePresence initial={false}>
            {expanded.soccer && (
              <motion.div
                key="soccer-children"
                variants={sidebarExpand}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="overflow-hidden"
              >
                <div className="pl-5 flex flex-col pt-0.5">
                  {leagues.map((league, index) => {
                    const isActive = activeLeague === String(league.id);
                    return (
                      <motion.button
                        key={league.id}
                        onClick={() => onLeagueChange(String(league.id))}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: index * 0.02,
                            duration: duration.fast,
                            ease: easing.easeOut,
                          },
                        }}
                        whileHover={{ x: 2 }}
                        transition={{ duration: duration.micro, ease: easing.ease }}
                        className="block w-full text-left"
                      >
                        <div className={`
                          rounded-md py-3 px-3 cursor-pointer relative transition-colors
                          ${isActive ? "bg-neutral-50" : "hover:bg-neutral-50"}
                        `}>
                          <div className="flex items-center gap-x-2.5 min-w-0">
                             <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                              <Image
                                src={league.logo}
                                alt={league.name}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            </div>
                            <p className="pr-4 whitespace-nowrap truncate text-[14px] font-medium text-[#1a1a2e]">
                              {league.name}
                            </p>
                          </div>
                          {league.fixtureCount != null && league.fixtureCount > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-bold">
                              {league.fixtureCount}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </aside>
    {/* Top fade mask */}
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, white 0%, transparent 100%)" }} />
    {/* Bottom fade mask */}
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10" style={{ background: "linear-gradient(to top, white 0%, transparent 100%)" }} />
    </div>
  );
}
