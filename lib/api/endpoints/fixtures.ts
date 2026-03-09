import { apiClient } from "../client";
import type {
  ApiTodayFixturesResponse,
  ApiUpcomingFixturesResponse,
  ApiFixtureDetail,
  ApiEnrichedFixture,
  ApiListResponse,
  ApiLineup,
  ApiOddsComparison,
} from "@/types/api";

// ─── Query parameter types ─────────────────────────────────────────────

export interface TodayFixturesParams {
  leagueId?: number;
  leagueName?: string;
  status?: string;
  state?: string;
  club?: string;
  hasPrediction?: boolean;
  minConfidence?: number;
}

export interface UpcomingFixturesParams extends TodayFixturesParams {
  from?: string;
  to?: string;
  date?: string;
}

// ─── Endpoint functions ────────────────────────────────────────────────

/** GET /api/fixtures/today — today's fixtures with predictions & team details */
export async function fetchTodayFixtures(
  params?: TodayFixturesParams,
): Promise<ApiTodayFixturesResponse> {
  const { data } = await apiClient.get<ApiTodayFixturesResponse>(
    "/api/fixtures/today",
    { params: cleanParams(params) },
  );
  return data;
}

/** GET /api/fixtures/upcoming — upcoming fixtures with predictions */
export async function fetchUpcomingFixtures(
  params?: UpcomingFixturesParams,
): Promise<ApiUpcomingFixturesResponse> {
  const { data } = await apiClient.get<ApiUpcomingFixturesResponse>(
    "/api/fixtures/upcoming",
    { params: cleanParams(params) },
  );
  return data;
}

/** GET /api/fixtures/live — currently live matches */
export async function fetchLiveFixtures(): Promise<
  ApiListResponse<ApiEnrichedFixture>
> {
  const { data } = await apiClient.get<ApiListResponse<ApiEnrichedFixture>>(
    "/api/fixtures/live",
  );
  return data;
}

/** GET /api/fixtures/:id — full fixture detail with stats, events, lineups, prediction */
export async function fetchFixtureById(
  id: number,
): Promise<ApiFixtureDetail> {
  const { data } = await apiClient.get<ApiFixtureDetail>(
    `/api/fixtures/${id}`,
  );
  return data;
}

/** GET /api/fixtures/:id/prediction — fixture with AI predictions */
export async function fetchFixturePrediction(
  id: number,
): Promise<ApiEnrichedFixture> {
  const { data } = await apiClient.get<ApiEnrichedFixture>(
    `/api/fixtures/${id}/prediction`,
  );
  return data;
}

/** GET /api/fixtures/:id/lineups — confirmed lineups */
export async function fetchFixtureLineups(
  id: number,
): Promise<ApiListResponse<ApiLineup>> {
  const { data } = await apiClient.get<ApiListResponse<ApiLineup>>(
    `/api/fixtures/${id}/lineups`,
  );
  return data;
}

/** GET /api/fixtures/:id/odds — all bookmaker odds for a fixture */
export async function fetchFixtureOdds(id: number): Promise<unknown> {
  const { data } = await apiClient.get(`/api/fixtures/${id}/odds`);
  return data;
}

/** GET /api/fixtures/:id/odds/compare — odds comparison across bookmakers */
export async function fetchFixtureOddsCompare(
  id: number,
): Promise<ApiOddsComparison | null> {
  const { data } = await apiClient.get<ApiOddsComparison | null>(
    `/api/fixtures/${id}/odds/compare`,
  );
  return data;
}

// ─── Helpers ───────────────────────────────────────────────────────────

/** Strip undefined values so axios doesn't send `?key=undefined` */
function cleanParams<T extends object>(
  params?: T,
): Record<string, unknown> | undefined {
  if (!params) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}
