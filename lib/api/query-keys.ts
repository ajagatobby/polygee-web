/**
 * Centralized query-key factory for TanStack Query.
 *
 * Pattern: `queryKeys.<domain>.<scope>(params)` returns a readonly tuple.
 * Using a factory keeps keys consistent and makes invalidation straightforward.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

// ─── Fixtures ──────────────────────────────────────────────────────────

export const fixtureKeys = {
  all: ["fixtures"] as const,

  lists: () => [...fixtureKeys.all, "list"] as const,

  today: (filters?: object) =>
    [...fixtureKeys.lists(), "today", filters ?? {}] as const,

  upcoming: (filters?: object) =>
    [...fixtureKeys.lists(), "upcoming", filters ?? {}] as const,

  live: () => [...fixtureKeys.lists(), "live"] as const,

  detail: (id: number) => [...fixtureKeys.all, "detail", id] as const,

  prediction: (id: number) =>
    [...fixtureKeys.all, "prediction", id] as const,

  lineups: (id: number) => [...fixtureKeys.all, "lineups", id] as const,

  odds: (id: number) => [...fixtureKeys.all, "odds", id] as const,

  oddsCompare: (id: number) =>
    [...fixtureKeys.all, "odds-compare", id] as const,
};

// ─── Predictions ───────────────────────────────────────────────────────

export const predictionKeys = {
  all: ["predictions"] as const,

  lists: () => [...predictionKeys.all, "list"] as const,

  list: (filters?: object) =>
    [...predictionKeys.lists(), filters ?? {}] as const,

  today: (filters?: object) =>
    [...predictionKeys.lists(), "today", filters ?? {}] as const,

  upcoming: (filters?: object) =>
    [...predictionKeys.lists(), "upcoming", filters ?? {}] as const,

  bullish: (filters?: object) =>
    [...predictionKeys.lists(), "bullish", filters ?? {}] as const,

  byFixture: (fixtureId: number) =>
    [...predictionKeys.all, "fixture", fixtureId] as const,

  accuracy: () => [...predictionKeys.all, "accuracy"] as const,

  dailyBreakdown: (date?: string) =>
    [...predictionKeys.all, "daily-breakdown", date ?? "today"] as const,

  performanceFeedback: () =>
    [...predictionKeys.all, "performance-feedback"] as const,
};

// ─── Teams ─────────────────────────────────────────────────────────────

export const teamKeys = {
  all: ["teams"] as const,

  detail: (id: number) => [...teamKeys.all, "detail", id] as const,

  history: (id: number, filters?: object) =>
    [...teamKeys.all, "history", id, filters ?? {}] as const,
};

// ─── Leagues ───────────────────────────────────────────────────────────

export const leagueKeys = {
  all: ["leagues"] as const,

  list: () => [...leagueKeys.all, "list"] as const,
};

// ─── Alerts ────────────────────────────────────────────────────────────

export const alertKeys = {
  all: ["alerts"] as const,

  list: (filters?: object) =>
    [...alertKeys.all, "list", filters ?? {}] as const,

  unread: () => [...alertKeys.all, "unread"] as const,
};

// ─── Auth / User ───────────────────────────────────────────────────────

export const userKeys = {
  all: ["user"] as const,

  me: () => [...userKeys.all, "me"] as const,
};
