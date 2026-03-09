"use client";

import { useQuery } from "@tanstack/react-query";
import { teamKeys } from "@/lib/api/query-keys";
import {
  fetchTeamById,
  fetchTeamHistory,
  type TeamHistoryParams,
} from "@/lib/api/endpoints/teams";

/** Team details with form data */
export function useTeam(id: number, enabled = true) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => fetchTeamById(id),
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // team data doesn't change often
  });
}

/** Team match history with stats */
export function useTeamHistory(
  id: number,
  params?: TeamHistoryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: teamKeys.history(id, params),
    queryFn: () => fetchTeamHistory(id, params),
    enabled: enabled && id > 0,
  });
}
