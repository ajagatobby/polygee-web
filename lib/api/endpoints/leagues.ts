import { apiClient } from "../client";
import type { ApiLeaguesResponse } from "@/types/api";

/** GET /api/leagues — all 30 tracked leagues with season info */
export async function fetchLeagues(): Promise<ApiLeaguesResponse> {
  const { data } = await apiClient.get<ApiLeaguesResponse>("/api/leagues");
  return data;
}
