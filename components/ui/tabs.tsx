"use client";

import { useState, useRef, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const tabsContainer = tabsRef.current;
    if (!tabsContainer) return;

    const activeElement = tabsContainer.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLButtonElement | null;

    if (activeElement) {
      const containerRect = tabsContainer.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left + tabsContainer.scrollLeft,
        width: activeRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={tabsRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-px"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-3.5 py-2 text-sm font-medium whitespace-nowrap
              rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.id
                  ? "text-text-primary bg-bg-card shadow-[var(--shadow-sm)] border border-border-secondary"
                  : "text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary/50"
              }
            `}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`
                    text-[10px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-full)]
                    ${
                      activeTab === tab.id
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "bg-bg-tertiary text-text-tertiary"
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
