// ─── Date formatting ───────────────────────────────────────────────────

/** "Today", "Tomorrow", or "Mon, Jan 15" */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** "Today", "Tomorrow", or "Monday, January 15" */
export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** "3:00 PM" from an ISO date string */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** "Jan 15, 2025, 3:00 PM" */
export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Number formatting ─────────────────────────────────────────────────

/** "$1.23M", "$45.60K", or "$100" */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(2)}K`;
  return `$${volume}`;
}

/** "0.5432" -> 54 (percentage integer) */
export function probToPercent(prob: string | number | null | undefined): number {
  if (prob == null) return 0;
  const n = typeof prob === "string" ? parseFloat(prob) : prob;
  if (isNaN(n)) return 0;
  // If already > 1, it's already a percentage
  if (n > 1) return Math.round(n);
  return Math.round(n * 100);
}

// ─── Match status helpers ──────────────────────────────────────────────

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "INT"]);
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);
const UPCOMING_STATUSES = new Set(["NS", "TBD"]);

export function isMatchLive(status: string): boolean {
  return LIVE_STATUSES.has(status);
}

export function isMatchFinished(status: string): boolean {
  return FINISHED_STATUSES.has(status);
}

export function isMatchUpcoming(status: string): boolean {
  return UPCOMING_STATUSES.has(status);
}

/** Human-readable status label */
export function getStatusLabel(status: string, elapsed: number | null): string {
  if (LIVE_STATUSES.has(status)) {
    if (status === "HT") return "HT";
    if (status === "ET") return "ET";
    if (elapsed != null) return `${elapsed}'`;
    return "Live";
  }
  if (status === "FT") return "FT";
  if (status === "AET") return "AET";
  if (status === "PEN") return "PEN";
  if (status === "PST") return "Postponed";
  if (status === "CANC") return "Cancelled";
  if (status === "ABD") return "Abandoned";
  if (status === "AWD") return "Awarded";
  if (status === "WO") return "Walkover";
  return status;
}

// ─── League logo helpers ───────────────────────────────────────────────

const LOCAL_LEAGUE_LOGOS: Record<number, string> = {
  61: "/leagues/ligue-1.png",
  88: "/leagues/eredivisie.png",
};

/** Get league logo URL — uses local files for leagues with aspect ratio issues */
export function getLeagueLogo(leagueId: number): string {
  if (LOCAL_LEAGUE_LOGOS[leagueId]) return LOCAL_LEAGUE_LOGOS[leagueId];
  return `https://media.api-sports.io/football/leagues/${leagueId}.png`;
}

// ─── Team color helpers ────────────────────────────────────────────────

/** Static color map for popular teams by API-Football team ID */
export const TEAM_COLORS: Record<number, string> = {
  // Premier League
  33: "#EF0107", // Arsenal
  35: "#6C1D45", // Aston Villa
  36: "#e30613", // Bournemouth
  55: "#EE2737", // Brentford
  63: "#0086D4", // Brighton
  38: "#005daa", // Burnley
  39: "#034694", // Chelsea
  40: "#1B458F", // Crystal Palace
  45: "#003399", // Everton
  66: "#0057B8", // Fulham
  71: "#A7D3F3", // Ipswich
  46: "#CC0000", // Leicester City
  47: "#C8102E", // Liverpool
  49: "#6CABDD", // Manchester City
  50: "#DA291C", // Manchester United
  34: "#241F20", // Newcastle
  65: "#d71920", // Nottingham Forest
  41: "#e53233", // Southampton
  51: "#132257", // Tottenham
  48: "#7A263A", // West Ham
  76: "#FBEE23", // Wolverhampton

  // La Liga
  529: "#A50044", // Barcelona
  541: "#FEBE10", // Real Madrid
  530: "#CE1126", // Atletico Madrid
  536: "#005BAB", // Sevilla
  533: "#005999", // Villarreal
  532: "#2B579A", // Real Sociedad
  531: "#E30613", // Athletic Bilbao
  534: "#0070B8", // Las Palmas
  543: "#FBBA00", // Real Betis

  // Serie A
  489: "#E30613", // AC Milan
  496: "#0068A8", // Juventus
  487: "#75B8E8", // Lazio
  492: "#12A0D7", // Napoli
  505: "#10519D", // Inter Milan
  497: "#970038", // Roma
  499: "#482E92", // Fiorentina
  500: "#005EB8", // Atalanta

  // Bundesliga
  157: "#DC052D", // Bayern Munich
  165: "#FDE100", // Borussia Dortmund
  173: "#004D2C", // RB Leipzig
  169: "#E32221", // Bayer Leverkusen
  163: "#E32221", // Freiburg
  161: "#1D9053", // Wolfsburg

  // Ligue 1
  85: "#004170", // Paris Saint-Germain
  91: "#E30613", // Monaco
  80: "#ED1C24", // Lyon
  81: "#009FE3", // Marseille
  79: "#DA291C", // Lille
};

export const DEFAULT_TEAM_COLOR = "#1552f0";

/** Get team color by team ID, falls back to default blue */
export function getTeamColor(teamId: number): string {
  return TEAM_COLORS[teamId] || DEFAULT_TEAM_COLOR;
}

// ─── AI pick helpers ───────────────────────────────────────────────────

/** Determine the AI pick from probabilities */
export function getAiPick(
  homeWinProb: string | null,
  drawProb: string | null,
  awayWinProb: string | null,
): { team: "home" | "draw" | "away"; probability: number } {
  const home = parseFloat(homeWinProb || "0");
  const draw = parseFloat(drawProb || "0");
  const away = parseFloat(awayWinProb || "0");

  if (home >= draw && home >= away) {
    return { team: "home", probability: home };
  }
  if (away >= home && away >= draw) {
    return { team: "away", probability: away };
  }
  return { team: "draw", probability: draw };
}
