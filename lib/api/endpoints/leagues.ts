import { apiClient } from "../client";
import type { ApiLeaguesRawResponse, ApiLeaguesResponse, ApiLeague } from "@/types/api";

/** GET /api/leagues — all 30 tracked leagues with season info.
 *  The backend passes through raw API-Football response objects, so we
 *  flatten them into a simpler shape for the rest of the frontend. */
export async function fetchLeagues(): Promise<ApiLeaguesResponse> {
  const { data } = await apiClient.get<ApiLeaguesRawResponse>("/api/leagues");

  const leagues: ApiLeague[] = (data.data ?? []).map((item) => {
    const currentSeason = item.seasons?.find((s) => s.current);
    return {
      id: item.league.id,
      name: item.league.name,
      country: item.country?.name ?? "",
      logo: item.league.logo,
      season: currentSeason?.year ?? new Date().getFullYear(),
    };
  });

  return {
    data: leagues,
    count: leagues.length,
    trackedIds: data.trackedIds ?? [],
  };
}
