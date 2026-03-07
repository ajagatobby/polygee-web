export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  slug: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  record?: string;
}

export interface MoneylineOdds {
  home: number;   // cents (e.g., 52 = 52¢)
  draw: number;
  away: number;
}

export interface SpreadOdds {
  homeLabel: string;   // e.g., "ARS -1.5"
  homePrice: number;   // cents
  awayLabel: string;   // e.g., "CHE +1.5"
  awayPrice: number;
}

export interface TotalOdds {
  overLabel: string;   // e.g., "O 2.5"
  overPrice: number;
  underLabel: string;  // e.g., "U 2.5"
  underPrice: number;
}

export interface PredictionOutcome {
  label: string;
  probability: number;
  odds: number;
}

export interface Prediction {
  id: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  matchTime: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  homeScore?: number;
  awayScore?: number;
  moneyline: MoneylineOdds;
  spread: SpreadOdds;
  total: TotalOdds;
  outcomes: PredictionOutcome[];
  totalVolume: number;
  participantsCount: number;
  description: string;
  aiConfidence: number;
  tags: string[];
  matchCount?: number;
}

export interface Fixture {
  id: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  matchTime: string;
  venue: string;
  status: "scheduled" | "live" | "completed" | "postponed";
  homeScore?: number;
  awayScore?: number;
  matchday: number;
  broadcast?: string;
}

export interface LeagueTab {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SidebarLeague {
  id: string;
  name: string;
  slug: string;
  logo: string;
  count: number;
  children?: SidebarLeague[];
  expanded?: boolean;
}
