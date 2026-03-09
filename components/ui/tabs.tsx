"use client";

import { motion } from "motion/react";

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
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLive = tab.dot && tab.count !== undefined && tab.count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] cursor-pointer outline-none
                text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? "bg-[#1a1a2e] text-white shadow-sm"
                  : "text-[#808080] hover:text-[#1a1a2e] hover:bg-[#f5f5f5]"
                }
              `}
            >
              {/* Animated background for active state */}
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-[8px] bg-[#1a1a2e]"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Label */}
              <span className="relative z-10">{tab.label}</span>

              {/* Live dot */}
              {isLive && (
                <span className="relative z-10 flex h-[6px] w-[6px]">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff3b30] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#ff3b30]" />
                </span>
              )}

              {/* Count badge */}
              {tab.count !== undefined && (
                <span
                  className={`
                    relative z-10 text-[10px] font-bold leading-none min-w-[18px] text-center
                    px-[5px] py-[3px] rounded-full transition-colors duration-150
                    ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#f0f0f0] text-[#bbb]"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
