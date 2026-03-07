"use client";

import { Tabs } from "@/components/ui";
import { leagueTabs } from "@/lib/mock-data";

interface LeagueTabsProps {
  activeLeague: string;
  onLeagueChange: (leagueId: string) => void;
  className?: string;
}

export function LeagueTabs({
  activeLeague,
  onLeagueChange,
  className = "",
}: LeagueTabsProps) {
  const tabs = leagueTabs.map((lt) => ({
    id: lt.id,
    label: lt.name,
    count: lt.count,
  }));

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeLeague}
      onTabChange={onLeagueChange}
      className={className}
    />
  );
}
