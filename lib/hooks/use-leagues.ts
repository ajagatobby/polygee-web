"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { leagueKeys } from "@/lib/api/query-keys";
import { fetchLeagues, getCachedLeagues } from "@/lib/api/endpoints/leagues";
import type { ApiLeaguesResponse } from "@/types/api";

/** All 30 tracked leagues with season info.
 *  Uses Dexie (IndexedDB) as placeholderData so the sidebar renders
 *  instantly from cache, then silently refreshes from the API. */
export function useLeagues() {
  const [cachedData, setCachedData] = useState<ApiLeaguesResponse | undefined>(undefined);

  // Load cached leagues from IndexedDB on mount (async, fires once)
  useEffect(() => {
    let cancelled = false;
    getCachedLeagues().then((cached) => {
      if (!cancelled && cached) {
        setCachedData(cached);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useQuery({
    queryKey: leagueKeys.list(),
    queryFn: fetchLeagues,
    staleTime: 30 * 60 * 1000, // leagues rarely change
    gcTime: 60 * 60 * 1000,
    placeholderData: cachedData,
  });
}
