// ─── API Types ─────────────────────────────────────────────────────────
// Mirror backend response shapes from the polygentic-backend API.
// These represent what the API actually returns (camelCase from Drizzle).

// ─── Teams ─────────────────────────────────────────────────────────────

export interface ApiTeam {
  id: number;
  name: string;
  shortName: string | null;
  logo: string | null;
  country: string | null;
  founded: number | null;
  venueName: string | null;
  venueCapacity: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Team kit colors from lineup data (jersey primary, number, border) */
export interface ApiTeamColors {
  player: { primary: string; number: string; border: string };
  goalkeeper: { primary: string; number: string; border: string };
}

/** Slim team shape returned inline in fixture responses */
export interface ApiTeamSummary {
  id: number;
  name: string | null;
  shortName: string | null;
  logo: string | null;
  teamColors?: ApiTeamColors | null;
  injuries?: ApiInjurySummary[];
}

// ─── Fixtures ──────────────────────────────────────────────────────────

export interface ApiFixture {
  id: number;
  leagueId: number;
  leagueName: string | null;
  leagueCountry: string | null;
  season: number | null;
  round: string | null;
  homeTeamId: number;
  awayTeamId: number;
  date: string;
  timestamp: number | null;
  venueName: string | null;
  venueCity: string | null;
  referee: string | null;
  status: string; // NS, 1H, HT, 2H, FT, AET, PEN, PST, CANC, etc.
  statusLong: string | null;
  elapsed: number | null;
  goalsHome: number | null;
  goalsAway: number | null;
  scoreHalftimeHome: number | null;
  scoreHalftimeAway: number | null;
  scoreFulltimeHome: number | null;
  scoreFulltimeAway: number | null;
  scoreExtratimeHome: number | null;
  scoreExtratimeAway: number | null;
  scorePenaltyHome: number | null;
  scorePenaltyAway: number | null;
  oddsApiEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Slim fixture shape returned from /fixtures/today and /fixtures/upcoming */
export interface ApiFixtureSummary {
  id: number;
  date: string;
  status: string;
  statusLong: string | null;
  elapsed: number | null;
  round: string | null;
  referee: string | null;
  venueName: string | null;
  venueCity: string | null;
  leagueId: number;
  leagueName: string | null;
  leagueCountry: string | null;
  season: number | null;
  goalsHome: number | null;
  goalsAway: number | null;
}

// ─── Predictions ───────────────────────────────────────────────────────

export type PredictionType = "daily" | "pre_match" | "on_demand";

export interface ApiPrediction {
  id: number;
  fixtureId: number;
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeWinProb: string; // numeric returned as string
  drawProb: string;
  awayWinProb: string;
  predictedHomeGoals: string | null;
  predictedAwayGoals: string | null;
  confidence: number | null; // 1-10
  predictionType: PredictionType;
  keyFactors: string[] | null;
  riskFactors: string[] | null;
  valueBets: ApiValueBet[] | null;
  matchContext: Record<string, unknown> | null;
  researchContext: Record<string, unknown> | null;
  detailedAnalysis: string | null;
  modelVersion: string | null;
  actualHomeGoals: number | null;
  actualAwayGoals: number | null;
  actualResult: "home_win" | "draw" | "away_win" | null;
  wasCorrect: boolean | null;
  probabilityAccuracy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  // Enriched fields from backend
  homeTeamName?: string | null;
  awayTeamName?: string | null;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  leagueName?: string | null;
  leagueId?: number | null;
  matchDate?: string | null;
}

export interface ApiValueBet {
  outcome: string;
  predictedProb?: number | null;
  bookmakerOdds?: number | null;
  impliedProb?: number | null;
  edge?: number | null;
  bookmaker?: string | null;
}

/** Inline prediction returned from /fixtures/today and /fixtures/:id/prediction */
export interface ApiPredictionSummary {
  id: number;
  predictionType: PredictionType;
  homeWinProb: string;
  drawProb: string;
  awayWinProb: string;
  predictedHomeGoals: string | null;
  predictedAwayGoals: string | null;
  confidence: number | null;
  keyFactors: string[] | null;
  riskFactors: string[] | null;
  valueBets: ApiValueBet[] | null;
  detailedAnalysis: string | null;
  researchContext: {
    combinedResearch?: string;
    citations?: string[];
  } | null;
  matchContext: Record<string, unknown> | null;
  actualResult: string | null;
  wasCorrect: boolean | null;
  probabilityAccuracy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/** Compact prediction in allPredictions array */
export interface ApiPredictionCompact {
  id: number;
  predictionType: PredictionType;
  homeWinProb: string;
  drawProb: string;
  awayWinProb: string;
  confidence: number | null;
  createdAt: string;
}

// ─── Lineup ────────────────────────────────────────────────────────────

export interface ApiLineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface ApiLineup {
  teamId: number;
  teamName: string | null;
  formation: string | null;
  coachName: string | null;
  startXI: ApiLineupPlayer[] | null;
  substitutes: ApiLineupPlayer[] | null;
}

// ─── Injuries ──────────────────────────────────────────────────────────

export interface ApiInjurySummary {
  playerId: number;
  playerName: string;
  type: string | null;
  reason: string | null;
}

// ─── Fixture Statistics ────────────────────────────────────────────────

export interface ApiFixtureStatistics {
  id: number;
  fixtureId: number;
  teamId: number;
  shotsOnGoal: number | null;
  shotsOffGoal: number | null;
  totalShots: number | null;
  blockedShots: number | null;
  shotsInsideBox: number | null;
  shotsOutsideBox: number | null;
  fouls: number | null;
  cornerKicks: number | null;
  offsides: number | null;
  possession: string | null;
  yellowCards: number | null;
  redCards: number | null;
  goalkeeperSaves: number | null;
  totalPasses: number | null;
  passesAccurate: number | null;
  passesPct: string | null;
  expectedGoals: string | null;
}

// ─── Fixture Events ────────────────────────────────────────────────────

export interface ApiFixtureEvent {
  id: number;
  fixtureId: number;
  teamId: number;
  playerId: number | null;
  playerName: string | null;
  assistId: number | null;
  assistName: string | null;
  type: string;
  detail: string | null;
  elapsed: number;
  extraTime: number | null;
  comments: string | null;
}

// ─── Enriched fixture response from /fixtures/today ────────────────────

export interface ApiEnrichedFixture {
  fixture: ApiFixtureSummary;
  homeTeam: ApiTeamSummary;
  awayTeam: ApiTeamSummary;
  lineups: ApiLineup[] | null;
  prediction: ApiPredictionSummary | null;
  allPredictions: ApiPredictionCompact[];
}

// ─── Fixture detail response from /fixtures/:id ────────────────────────

export interface ApiFixtureDetail {
  fixture: ApiFixture;
  statistics: ApiFixtureStatistics[];
  events: ApiFixtureEvent[];
  injuries: ApiInjurySummary[];
  lineups: ApiLineup[];
  prediction: ApiPrediction | null;
}

// ─── Alerts ────────────────────────────────────────────────────────────

export type AlertType =
  | "high_confidence"
  | "value_bet"
  | "live_event"
  | "lineup_change";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface ApiAlert {
  id: number;
  predictionId: number | null;
  fixtureId: number | null;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  acknowledged: boolean;
  createdAt: string;
}

// ─── Leagues ───────────────────────────────────────────────────────────

/** Raw league item from API-Football (passed through untransformed by backend) */
export interface ApiLeagueRaw {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

/** Flattened league shape used throughout the frontend */
export interface ApiLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
  fixtureCount?: number;
}

// ─── Team form ─────────────────────────────────────────────────────────

export interface ApiTeamForm {
  id: number;
  teamId: number;
  leagueId: number;
  season: number;
  formString: string | null;
  last5Wins: number | null;
  last5Draws: number | null;
  last5Losses: number | null;
  last5GoalsFor: number | null;
  last5GoalsAgainst: number | null;
  homeWins: number | null;
  homeDraws: number | null;
  homeLosses: number | null;
  awayWins: number | null;
  awayDraws: number | null;
  awayLosses: number | null;
  goalsForAvg: string | null;
  goalsAgainstAvg: string | null;
  cleanSheets: number | null;
  failedToScore: number | null;
  attackRating: string | null;
  defenseRating: string | null;
  leaguePosition: number | null;
  points: number | null;
}

export interface ApiTeamWithForm {
  team: ApiTeam;
  form: ApiTeamForm[];
}

// ─── Odds ──────────────────────────────────────────────────────────────

export interface ApiBookmakerOdds {
  id: number;
  oddsApiEventId: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  bookmakerKey: string;
  bookmakerName: string | null;
  marketKey: string;
  outcomes: Record<string, unknown>;
  impliedProbabilities: Record<string, unknown> | null;
  trueProbabilities: Record<string, unknown> | null;
  overround: string | null;
  lastUpdate: string | null;
}

// ─── Users / Auth ──────────────────────────────────────────────────────

export type UserRole = "user" | "admin";
export type SubscriptionTier = "free" | "pro";
export type SubscriptionStatus =
  | "none"
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";

export interface ApiUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoUrl: string | null;
  provider: string | null;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPeriodEnd: string | null;
  requestCount: number;
  lastActiveAt: string | null;
  createdAt: string;
}

export interface ApiRegisterResponse {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: string;
  message: string;
}

export interface ApiRefreshResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

// ─── Accuracy ──────────────────────────────────────────────────────────

export interface ApiAccuracyStats {
  totalResolved: number;
  correct: number;
  accuracy: number;
  avgBrierScore: number;
  byType: Record<
    string,
    { total: number; correct: number; accuracy: number }
  >;
}

// ─── Daily Breakdown ───────────────────────────────────────────────────

export interface ApiDailyBreakdownPrediction {
  predictionId: number;
  fixtureId: number;
  matchDate: string;
  matchStatus: string;
  league: { id: number; name: string | null; country: string | null };
  homeTeam: { id: number; name: string | null; logo: string | null };
  awayTeam: { id: number; name: string | null; logo: string | null };
  predicted: {
    result: string;
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
    homeGoals: number | null;
    awayGoals: number | null;
    confidence: number | null;
  };
  actual: {
    result: string | null;
    homeGoals: number | null;
    awayGoals: number | null;
  };
  wasCorrect: boolean | null;
  brierScore: number | null;
  predictionType: string;
  polymarketLink: string | null;
  createdAt: string;
}

export interface ApiResultBreakdown {
  predicted: number;
  correct: number;
  accuracy: number;
}

export interface ApiDailyBreakdown {
  date: string;
  summary: {
    total: number;
    resolved: number;
    correct: number;
    incorrect: number;
    pending: number;
    accuracy: number;
    avgConfidence: number;
    avgBrierScore: number | null;
  };
  byResult: {
    home_win: ApiResultBreakdown;
    draw: ApiResultBreakdown;
    away_win: ApiResultBreakdown;
  };
  predictions: ApiDailyBreakdownPrediction[];
}

// ─── Performance Feedback ──────────────────────────────────────────────

export interface ApiConfidenceBucket {
  total: number;
  correct: number;
  accuracy: number;
}

export interface ApiPerformanceFeedback {
  totalResolved: number;
  overallAccuracy: number;
  avgBrierScore: number;
  byResult: {
    home_win: ApiResultBreakdown;
    draw: ApiResultBreakdown;
    away_win: ApiResultBreakdown;
  };
  avgProbabilities: {
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
  };
  actualDistribution: {
    homeWinPct: number;
    drawPct: number;
    awayWinPct: number;
  };
  biasInsights: string[];
  confidenceCalibration: {
    highConfidence: ApiConfidenceBucket;
    medConfidence: ApiConfidenceBucket;
    lowConfidence: ApiConfidenceBucket;
  };
  leagueBreakdown: Record<
    string,
    { total: number; correct: number; accuracy: number }
  >;
}

// ─── Odds Comparison ───────────────────────────────────────────────────

export interface ApiBookmakerPrice {
  bookmakerKey: string;
  bookmakerName: string;
  price: number;
  impliedProbability: number;
  overround: number | null;
  lastUpdate: string | null;
}

export interface ApiValueBetOdds {
  bookmakerKey: string;
  bookmakerName: string;
  price: number;
  edgePercent: number;
  consensusProbability: number;
  impliedProbability: number;
}

export interface ApiOutcomeComparison {
  outcome: string;
  bestPrice: { bookmakerKey: string; bookmakerName: string; price: number } | null;
  worstPrice: { bookmakerKey: string; bookmakerName: string; price: number } | null;
  spread: number;
  bookmakerCount: number;
  consensusProbability: number | null;
  valueBet: ApiValueBetOdds | null;
  bookmakers: ApiBookmakerPrice[];
}

export interface ApiMarketComparison {
  marketKey: string;
  bookmakerCount: number;
  outcomes: ApiOutcomeComparison[];
  valueBets: ApiValueBetOdds[];
}

export interface ApiOddsComparison {
  fixtureId: number;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  markets: Record<string, ApiMarketComparison>;
}

// ─── Paginated responses ───────────────────────────────────────────────

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiListResponse<T> {
  data: T[];
  count: number;
}

export interface ApiTodayFixturesResponse {
  data: ApiEnrichedFixture[];
  count: number;
  date: string;
  filters: Record<string, unknown>;
}

export interface ApiUpcomingFixturesResponse {
  data: ApiEnrichedFixture[];
  count: number;
  filters: Record<string, unknown>;
}

/** Raw response from GET /api/leagues (backend passes API-Football data through) */
export interface ApiLeaguesRawResponse {
  data: ApiLeagueRaw[];
  count: number;
  trackedIds: number[];
}

/** Transformed response used by the frontend */
export interface ApiLeaguesResponse {
  data: ApiLeague[];
  count: number;
  trackedIds: number[];
}

// ─── WebSocket Live Events ─────────────────────────────────────────────

/** State of a single live match from the WebSocket */
export interface LiveFixtureState {
  fixtureId: number;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamId: number;
  awayTeamName: string;
  leagueId: number;
  leagueName: string;
  status: string;
  elapsed: number | null;
  goalsHome: number | null;
  goalsAway: number | null;
  events: unknown[];
  raw: unknown;
}

/** Payload for the periodic 'match-update' event */
export interface LiveMatchUpdatePayload {
  matches: LiveFixtureState[];
  count: number;
  timestamp: string;
}

/** Payload for goal/red-card/match-start/match-end events */
export interface LiveEventPayload {
  fixtureId: number;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamId: number;
  awayTeamName: string;
  leagueId: number;
  leagueName: string;
  detail: string;
  data: Record<string, unknown>;
  timestamp: string;
}

/** All WebSocket event types */
export type LiveEventType =
  | "match-update"
  | "goal"
  | "red-card"
  | "match-start"
  | "match-end";

/** Discriminated message from the WebSocket */
export interface LiveSocketMessage {
  event: LiveEventType;
  data: LiveMatchUpdatePayload | LiveEventPayload;
}
