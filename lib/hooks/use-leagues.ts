"use client";

import { useQuery } from "@tanstack/react-query";
import { leagueKeys } from "@/lib/api/query-keys";
import { fetchLeagues } from "@/lib/api/endpoints/leagues";

/** All 30 tracked leagues with season info */
export function useLeagues() {
  return useQuery({
    queryKey: leagueKeys.list(),
    queryFn: fetchLeagues,
    staleTime: 30 * 60 * 1000, // leagues rarely change
    gcTime: 60 * 60 * 1000,
  });
}
