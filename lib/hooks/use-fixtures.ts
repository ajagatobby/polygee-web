"use client";

import { useQuery } from "@tanstack/react-query";
import { fixtureKeys } from "@/lib/api/query-keys";
import {
  fetchTodayFixtures,
  fetchUpcomingFixtures,
  fetchLiveFixtures,
  fetchFixtureById,
  fetchFixturePrediction,
  fetchFixtureLineups,
  fetchFixtureOdds,
  fetchFixtureOddsCompare,
  type TodayFixturesParams,
  type UpcomingFixturesParams,
} from "@/lib/api/endpoints/fixtures";

/** Today's fixtures enriched with predictions, lineups, injuries */
export function useTodayFixtures(params?: TodayFixturesParams) {
  return useQuery({
    queryKey: fixtureKeys.today(params),
    queryFn: () => fetchTodayFixtures(params),
    staleTime: 2 * 60 * 1000, // 2 min — predictions don't update very often
    gcTime: 10 * 60 * 1000, // keep in cache 10 min
    refetchOnWindowFocus: true,
  });
}

/** Upcoming fixtures (default: next 7 days) */
export function useUpcomingFixtures(params?: UpcomingFixturesParams) {
  return useQuery({
    queryKey: fixtureKeys.upcoming(params),
    queryFn: () => fetchUpcomingFixtures(params),
    staleTime: 5 * 60 * 1000, // 5 min — not time-sensitive
    gcTime: 15 * 60 * 1000,
  });
}

/** Currently live matches — polls every 30s when enabled */
export function useLiveFixtures(enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.live(),
    queryFn: fetchLiveFixtures,
    enabled,
    refetchInterval: 30_000,
    staleTime: 10_000,
    gcTime: 2 * 60 * 1000,
  });
}

/** Full fixture detail (stats, events, lineups, prediction) */
export function useFixtureDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.detail(id),
    queryFn: () => fetchFixtureById(id),
    enabled: enabled && id > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/** Fixture with AI prediction — used on prediction detail page */
export function useFixturePrediction(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.prediction(id),
    queryFn: () => fetchFixturePrediction(id),
    enabled: enabled && id > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/** Confirmed lineups for a fixture */
export function useFixtureLineups(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.lineups(id),
    queryFn: () => fetchFixtureLineups(id),
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // lineups don't change once set
    gcTime: 30 * 60 * 1000,
  });
}

/** Bookmaker odds for a fixture */
export function useFixtureOdds(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.odds(id),
    queryFn: () => fetchFixtureOdds(id),
    enabled: enabled && id > 0,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days — odds rarely need re-fetching
    gcTime: 60 * 24 * 60 * 60 * 1000, // 60 days
  });
}

/** Odds comparison across bookmakers */
export function useFixtureOddsCompare(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.oddsCompare(id),
    queryFn: () => fetchFixtureOddsCompare(id),
    enabled: enabled && id > 0,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    gcTime: 60 * 24 * 60 * 60 * 1000, // 60 days
  });
}
