"use client";

import { useQuery } from "@tanstack/react-query";
import { predictionKeys } from "@/lib/api/query-keys";
import {
  fetchPredictions,
  fetchTodayPredictions,
  fetchUpcomingPredictions,
  fetchBullishPredictions,
  fetchAccuracyStats,
  fetchDailyBreakdown,
  fetchPerformanceFeedback,
  fetchPredictionsByFixture,
  type PredictionListParams,
  type PredictionsByMatchDateParams,
  type BullishParams,
} from "@/lib/api/endpoints/predictions";

/** Paginated predictions with filters */
export function usePredictions(params?: PredictionListParams) {
  return useQuery({
    queryKey: predictionKeys.list(params),
    queryFn: () => fetchPredictions(params),
  });
}

/** Today's predictions (by match date) */
export function useTodayPredictions(params?: PredictionsByMatchDateParams) {
  return useQuery({
    queryKey: predictionKeys.today(params),
    queryFn: () => fetchTodayPredictions(params),
  });
}

/** Upcoming predictions (by match date) */
export function useUpcomingPredictions(params?: PredictionsByMatchDateParams) {
  return useQuery({
    queryKey: predictionKeys.upcoming(params),
    queryFn: () => fetchUpcomingPredictions(params),
  });
}

/** Highest-conviction "bullish" picks */
export function useBullishPredictions(params?: BullishParams) {
  return useQuery({
    queryKey: predictionKeys.bullish(params),
    queryFn: () => fetchBullishPredictions(params),
  });
}

/** Predictions for a specific fixture */
export function usePredictionsByFixture(fixtureId: number, enabled = true) {
  return useQuery({
    queryKey: predictionKeys.byFixture(fixtureId),
    queryFn: () => fetchPredictionsByFixture(fixtureId),
    enabled: enabled && fixtureId > 0,
  });
}

/** Model accuracy statistics */
export function useAccuracyStats() {
  return useQuery({
    queryKey: predictionKeys.accuracy(),
    queryFn: fetchAccuracyStats,
    staleTime: 5 * 60 * 1000, // accuracy doesn't change often
  });
}

/** Daily performance breakdown */
export function useDailyBreakdown(date?: string) {
  return useQuery({
    queryKey: predictionKeys.dailyBreakdown(date),
    queryFn: () => fetchDailyBreakdown(date),
  });
}

/** Performance feedback with bias analysis */
export function usePerformanceFeedback() {
  return useQuery({
    queryKey: predictionKeys.performanceFeedback(),
    queryFn: fetchPerformanceFeedback,
    staleTime: 10 * 60 * 1000, // doesn't change often
  });
}
