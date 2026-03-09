import { apiClient } from "../client";
import type { ApiTeamWithForm } from "@/types/api";

export interface TeamHistoryParams {
  leagueId?: number;
  limit?: number;
  offset?: number;
}

/** GET /api/teams/:id — team details with form data */
export async function fetchTeamById(id: number): Promise<ApiTeamWithForm> {
  const { data } = await apiClient.get<ApiTeamWithForm>(`/api/teams/${id}`);
  return data;
}

/** GET /api/teams/:id/history — match history with stats */
export async function fetchTeamHistory(
  id: number,
  params?: TeamHistoryParams,
): Promise<{
  team: ApiTeamWithForm["team"];
  matches: unknown[];
  total: number;
  page: { limit: number; offset: number };
}> {
  const { data } = await apiClient.get(`/api/teams/${id}/history`, {
    params: params ?? undefined,
  });
  return data;
}
