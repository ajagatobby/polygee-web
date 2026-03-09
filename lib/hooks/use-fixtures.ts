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
  });
}

/** Upcoming fixtures (default: next 7 days) */
export function useUpcomingFixtures(params?: UpcomingFixturesParams) {
  return useQuery({
    queryKey: fixtureKeys.upcoming(params),
    queryFn: () => fetchUpcomingFixtures(params),
  });
}

/** Currently live matches — polls every 30s when enabled */
export function useLiveFixtures(enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.live(),
    queryFn: fetchLiveFixtures,
    enabled,
    refetchInterval: 30_000, // poll every 30 seconds
    staleTime: 10_000,
  });
}

/** Full fixture detail (stats, events, lineups, prediction) */
export function useFixtureDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.detail(id),
    queryFn: () => fetchFixtureById(id),
    enabled: enabled && id > 0,
  });
}

/** Fixture with AI prediction */
export function useFixturePrediction(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.prediction(id),
    queryFn: () => fetchFixturePrediction(id),
    enabled: enabled && id > 0,
  });
}

/** Confirmed lineups for a fixture */
export function useFixtureLineups(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.lineups(id),
    queryFn: () => fetchFixtureLineups(id),
    enabled: enabled && id > 0,
  });
}

/** Bookmaker odds for a fixture */
export function useFixtureOdds(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.odds(id),
    queryFn: () => fetchFixtureOdds(id),
    enabled: enabled && id > 0,
  });
}

/** Odds comparison across bookmakers */
export function useFixtureOddsCompare(id: number, enabled = true) {
  return useQuery({
    queryKey: fixtureKeys.oddsCompare(id),
    queryFn: () => fetchFixtureOddsCompare(id),
    enabled: enabled && id > 0,
  });
}
