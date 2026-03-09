import { apiClient } from "../client";
import { db } from "@/lib/db";
import type { ApiLeaguesRawResponse, ApiLeaguesResponse, ApiLeague } from "@/types/api";

/** GET /api/leagues — all 30 tracked leagues with season info.
 *  The backend passes through raw API-Football response objects, so we
 *  flatten them into a simpler shape for the rest of the frontend.
 *  After a successful fetch, leagues are persisted to IndexedDB via Dexie
 *  so subsequent page loads can render the sidebar instantly. */
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

  // Persist to IndexedDB in the background (fire & forget)
  try {
    await db.transaction("rw", db.leagues, db.cacheMeta, async () => {
      await db.leagues.clear();
      await db.leagues.bulkPut(leagues);
      await db.cacheMeta.put({ key: "leagues", updatedAt: Date.now() });
    });
  } catch {
    // IndexedDB may be unavailable (SSR, private browsing) — not critical
  }

  return {
    data: leagues,
    count: leagues.length,
    trackedIds: data.trackedIds ?? [],
  };
}

/** Read cached leagues from IndexedDB. Returns undefined if cache is empty. */
export async function getCachedLeagues(): Promise<ApiLeaguesResponse | undefined> {
  try {
    const leagues = await db.leagues.toArray();
    if (leagues.length === 0) return undefined;
    return {
      data: leagues,
      count: leagues.length,
      trackedIds: leagues.map((l) => l.id),
    };
  } catch {
    return undefined;
  }
}
