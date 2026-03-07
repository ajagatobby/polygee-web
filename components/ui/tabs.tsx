"use client";

import { motion } from "motion/react";
import { easing, duration } from "@/lib/animations";

interface Tab {
  id: string;
  label: string;
  count?: number;
  /** Optional dot indicator (e.g. live pulse) */
  dot?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Unique layout group id — required when multiple Tabs instances exist on screen */
  layoutId?: string;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  layoutId = "tab-indicator",
  className = "",
}: TabsProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative px-4 py-2.5 cursor-pointer outline-none group"
            >
              {/* Sliding background pill */}
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[8px] bg-[#f5f5f5]"
                  style={{ originY: "top" }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Tab content */}
              <span
                className={`
                  relative z-10 flex items-center gap-1.5 text-[13px] font-medium
                  transition-colors
                  ${isActive
                    ? "text-[#1a1a2e]"
                    : "text-[#999] group-hover:text-[#666]"
                  }
                `}
                style={{
                  transitionDuration: `${duration.fast * 1000}ms`,
                  transitionTimingFunction: `cubic-bezier(${easing.ease.join(",")})`,
                }}
              >
                {tab.label}

                {/* Count badge */}
                {tab.count !== undefined && (
                  <span
                    className={`
                      text-[10px] font-semibold leading-none px-[6px] py-[3px] rounded-full
                      transition-colors
                      ${isActive
                        ? "bg-[#1a1a2e]/8 text-[#1a1a2e]"
                        : "bg-[#f0f0f0] text-[#bbb] group-hover:text-[#999]"
                      }
                    `}
                    style={{
                      transitionDuration: `${duration.fast * 1000}ms`,
                    }}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Live dot */}
                {tab.dot && (
                  <span className="relative flex h-[5px] w-[5px]">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff3b30] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#ff3b30]" />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
