import { apiClient } from "../client";
import type {
  ApiPrediction,
  ApiPaginatedResponse,
  ApiAccuracyStats,
} from "@/types/api";

// ─── Query parameter types ─────────────────────────────────────────────

export interface PredictionListParams {
  predictionType?: string;
  leagueId?: number;
  minConfidence?: number;
  date?: string;
  unresolved?: boolean;
  page?: number;
  limit?: number;
}

export interface PredictionsByMatchDateParams {
  leagueId?: number;
  leagueName?: string;
  minConfidence?: number;
  unresolved?: boolean;
  days?: number;
  from?: string;
  to?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface BullishParams {
  limit?: number;
  minConfidence?: number;
  minDominantProb?: number;
}

// ─── Endpoint functions ────────────────────────────────────────────────

/** GET /api/predictions — paginated predictions with filters */
export async function fetchPredictions(
  params?: PredictionListParams,
): Promise<ApiPaginatedResponse<ApiPrediction>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<ApiPrediction>>(
    "/api/predictions",
    { params: cleanParams(params) },
  );
  return data;
}

/** GET /api/predictions/today — predictions for today's matches */
export async function fetchTodayPredictions(
  params?: PredictionsByMatchDateParams,
): Promise<ApiPaginatedResponse<ApiPrediction> & { dateRange: { from: string; to: string } }> {
  const { data } = await apiClient.get("/api/predictions/today", {
    params: cleanParams(params),
  });
  return data;
}

/** GET /api/predictions/upcoming — predictions for upcoming matches */
export async function fetchUpcomingPredictions(
  params?: PredictionsByMatchDateParams,
): Promise<ApiPaginatedResponse<ApiPrediction> & { dateRange: { from: string; to: string } }> {
  const { data } = await apiClient.get("/api/predictions/upcoming", {
    params: cleanParams(params),
  });
  return data;
}

/** GET /api/predictions/bullish — highest-conviction picks */
export async function fetchBullishPredictions(
  params?: BullishParams,
): Promise<{ data: ApiPrediction[]; count: number }> {
  const { data } = await apiClient.get("/api/predictions/bullish", {
    params: cleanParams(params),
  });
  return data;
}

/** GET /api/predictions/accuracy — model accuracy statistics */
export async function fetchAccuracyStats(): Promise<ApiAccuracyStats> {
  const { data } = await apiClient.get<ApiAccuracyStats>(
    "/api/predictions/accuracy",
  );
  return data;
}

/** GET /api/predictions/daily-breakdown — daily performance breakdown */
export async function fetchDailyBreakdown(
  date?: string,
): Promise<unknown> {
  const { data } = await apiClient.get("/api/predictions/daily-breakdown", {
    params: date ? { date } : undefined,
  });
  return data;
}

/** GET /api/predictions/performance-feedback — bias & calibration analysis */
export async function fetchPerformanceFeedback(): Promise<unknown> {
  const { data } = await apiClient.get(
    "/api/predictions/performance-feedback",
  );
  return data;
}

/** GET /api/predictions/:fixtureId — predictions for a specific fixture */
export async function fetchPredictionsByFixture(
  fixtureId: number,
): Promise<ApiPrediction[]> {
  const { data } = await apiClient.get<ApiPrediction[]>(
    `/api/predictions/${fixtureId}`,
  );
  return data;
}

// ─── Helpers ───────────────────────────────────────────────────────────

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
