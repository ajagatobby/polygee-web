import { League, Team, Prediction, Fixture, LeagueTab, SidebarLeague } from "@/types";

// Leagues
export const leagues: League[] = [
  { id: "pl", name: "Premier League", country: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", slug: "premier-league" },
  { id: "ll", name: "La Liga", country: "Spain", logo: "🇪🇸", slug: "la-liga" },
  { id: "bl", name: "Bundesliga", country: "Germany", logo: "🇩🇪", slug: "bundesliga" },
  { id: "sa", name: "Serie A", country: "Italy", logo: "🇮🇹", slug: "serie-a" },
  { id: "l1", name: "Ligue 1", country: "France", logo: "🇫🇷", slug: "ligue-1" },
  { id: "ucl", name: "Champions League", country: "Europe", logo: "⭐", slug: "champions-league" },
];

export const leagueTabs: LeagueTab[] = [
  { id: "all", name: "All Leagues", slug: "all", count: 24 },
  { id: "pl", name: "Premier League", slug: "premier-league", count: 8 },
  { id: "ll", name: "La Liga", slug: "la-liga", count: 5 },
  { id: "bl", name: "Bundesliga", slug: "bundesliga", count: 4 },
  { id: "sa", name: "Serie A", slug: "serie-a", count: 4 },
  { id: "ucl", name: "Champions League", slug: "champions-league", count: 3 },
];

export const sidebarLeagues: SidebarLeague[] = [
  {
    id: "soccer",
    name: "Soccer",
    slug: "soccer",
    logo: "⚽",
    count: 0,
    expanded: true,
    children: [
      { id: "ucl", name: "UCL", slug: "champions-league", logo: "⭐", count: 40 },
      { id: "ll", name: "La Liga", slug: "la-liga", logo: "🇪🇸", count: 53 },
      { id: "bl", name: "Bundesliga", slug: "bundesliga", logo: "🇩🇪", count: 48 },
      { id: "sa", name: "Serie A", slug: "serie-a", logo: "🇮🇹", count: 41 },
      { id: "l1", name: "Ligue 1", slug: "ligue-1", logo: "🇫🇷", count: 48 },
      { id: "mls", name: "MLS", slug: "mls", logo: "🇺🇸", count: 90 },
      { id: "pl", name: "EPL", slug: "premier-league", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", count: 20 },
      { id: "ere", name: "Eredivisie", slug: "eredivisie", logo: "🇳🇱", count: 34 },
      { id: "spl", name: "Saudi Pro League", slug: "saudi-pro-league", logo: "🇸🇦", count: 33 },
      { id: "tur", name: "Super Lig", slug: "super-lig", logo: "🇹🇷", count: 51 },
      { id: "uel", name: "UEL", slug: "europa-league", logo: "⭐", count: 32 },
      { id: "uecl", name: "Conference League", slug: "conference-league", logo: "⭐", count: 32 },
      { id: "kor", name: "K-League", slug: "k-league", logo: "🇰🇷", count: 48 },
      { id: "jpn", name: "J. League", slug: "j-league", logo: "🇯🇵", count: 80 },
      { id: "bra", name: "Serie A Brazil", slug: "serie-a-brazil", logo: "🇧🇷", count: 80 },
      { id: "arg", name: "Primera Division", slug: "primera-division", logo: "🇦🇷", count: 0 },
      { id: "col", name: "Colombia Primera A", slug: "colombia-primera", logo: "🇨🇴", count: 116 },
    ],
  },
];

// Teams with colors for Polymarket-style price buttons
const teams: Record<string, Team> = {
  arsenal: { id: "ars", name: "Arsenal", shortName: "ARS", logo: "🔴", color: "#EF0107", record: "12-3-2" },
  chelsea: { id: "che", name: "Chelsea", shortName: "CHE", logo: "🔵", color: "#034694", record: "9-5-3" },
  liverpool: { id: "liv", name: "Liverpool", shortName: "LIV", logo: "🔴", color: "#C8102E", record: "13-2-2" },
  manCity: { id: "mci", name: "Manchester City", shortName: "MCI", logo: "🩵", color: "#6CABDD", record: "11-4-2" },
  manUtd: { id: "mun", name: "Manchester United", shortName: "MUN", logo: "🔴", color: "#DA291C", record: "8-5-4" },
  tottenham: { id: "tot", name: "Tottenham Hotspur", shortName: "TOT", logo: "⚪", color: "#132257", record: "8-6-3" },
  newcastle: { id: "new", name: "Newcastle United", shortName: "NEW", logo: "⬛", color: "#241F20", record: "10-4-3" },
  astonVilla: { id: "avl", name: "Aston Villa", shortName: "AVL", logo: "🟣", color: "#670E36", record: "9-3-5" },
  realMadrid: { id: "rma", name: "Real Madrid", shortName: "RMA", logo: "⚪", color: "#FEBE10", record: "11-5-1" },
  barcelona: { id: "bar", name: "FC Barcelona", shortName: "BAR", logo: "🔵🔴", color: "#A50044", record: "12-3-2" },
  atletico: { id: "atm", name: "Atletico Madrid", shortName: "ATM", logo: "🔴⚪", color: "#CB3524", record: "9-6-2" },
  bayern: { id: "bay", name: "Bayern Munich", shortName: "BAY", logo: "🔴", color: "#DC052D", record: "14-1-2" },
  dortmund: { id: "bvb", name: "Borussia Dortmund", shortName: "BVB", logo: "🟡", color: "#FDE100", record: "9-4-4" },
  inter: { id: "int", name: "Inter Milan", shortName: "INT", logo: "🔵⚫", color: "#009BDB", record: "11-4-2" },
  acMilan: { id: "mil", name: "AC Milan", shortName: "MIL", logo: "🔴⚫", color: "#FB090B", record: "8-5-4" },
  juventus: { id: "juv", name: "Juventus", shortName: "JUV", logo: "⬜⬛", color: "#000000", record: "10-5-2" },
  psg: { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", logo: "🔵🔴", color: "#004170", record: "13-2-2" },
};

// Predictions with Polymarket-style market data
export const predictions: Prediction[] = [
  {
    id: "pred-1",
    league: leagues[0],
    homeTeam: teams.arsenal,
    awayTeam: teams.chelsea,
    matchDate: "2026-03-14",
    matchTime: "15:00",
    venue: "Emirates Stadium",
    status: "upcoming",
    moneyline: { home: 52, draw: 24, away: 24 },
    spread: { homeLabel: "ARS -1.5", homePrice: 35, awayLabel: "CHE +1.5", awayPrice: 65 },
    total: { overLabel: "O 2.5", overPrice: 62, underLabel: "U 2.5", underPrice: 38 },
    outcomes: [
      { label: "Arsenal Win", probability: 52, odds: 1.85 },
      { label: "Draw", probability: 24, odds: 3.75 },
      { label: "Chelsea Win", probability: 24, odds: 3.90 },
    ],
    totalVolume: 284500,
    participantsCount: 1243,
    description: "North London hosts the Blues in this high-stakes Premier League clash. Arsenal's home form has been exceptional this season with 12 wins in 14 home matches.",
    aiConfidence: 78,
    tags: ["Top Match", "London Derby"],
    matchCount: 12,
    probabilityHistory: [48, 45, 50, 47, 52, 55, 51, 53, 50, 52],
    aiPick: { team: "home", confidence: 78 },
  },
  {
    id: "pred-2",
    league: leagues[0],
    homeTeam: teams.liverpool,
    awayTeam: teams.manCity,
    matchDate: "2026-03-15",
    matchTime: "17:30",
    venue: "Anfield",
    status: "upcoming",
    moneyline: { home: 45, draw: 27, away: 28 },
    spread: { homeLabel: "LIV -0.5", homePrice: 48, awayLabel: "MCI +0.5", awayPrice: 52 },
    total: { overLabel: "O 3.5", overPrice: 44, underLabel: "U 3.5", underPrice: 56 },
    outcomes: [
      { label: "Liverpool Win", probability: 45, odds: 2.10 },
      { label: "Draw", probability: 27, odds: 3.40 },
      { label: "Man City Win", probability: 28, odds: 3.25 },
    ],
    totalVolume: 512300,
    participantsCount: 2891,
    description: "The biggest match in English football. Liverpool vs Manchester City at Anfield.",
    aiConfidence: 72,
    tags: ["Title Decider", "Featured"],
    matchCount: 15,
    probabilityHistory: [42, 44, 40, 43, 46, 44, 48, 45, 43, 45],
    aiPick: { team: "home", confidence: 72 },
  },
  {
    id: "pred-3",
    league: leagues[1],
    homeTeam: teams.realMadrid,
    awayTeam: teams.barcelona,
    matchDate: "2026-03-16",
    matchTime: "21:00",
    venue: "Santiago Bernabeu",
    status: "upcoming",
    moneyline: { home: 40, draw: 25, away: 35 },
    spread: { homeLabel: "RMA -0.5", homePrice: 42, awayLabel: "BAR +0.5", awayPrice: 58 },
    total: { overLabel: "O 2.5", overPrice: 68, underLabel: "U 2.5", underPrice: 32 },
    outcomes: [
      { label: "Real Madrid Win", probability: 40, odds: 2.35 },
      { label: "Draw", probability: 25, odds: 3.60 },
      { label: "Barcelona Win", probability: 35, odds: 2.70 },
    ],
    totalVolume: 891200,
    participantsCount: 4562,
    description: "El Clasico at the newly renovated Bernabeu.",
    aiConfidence: 65,
    tags: ["El Clasico", "Featured"],
    matchCount: 18,
    probabilityHistory: [38, 36, 40, 42, 39, 37, 41, 40, 38, 40],
    aiPick: { team: "home", confidence: 65 },
  },
  {
    id: "pred-4",
    league: leagues[2],
    homeTeam: teams.bayern,
    awayTeam: teams.dortmund,
    matchDate: "2026-03-15",
    matchTime: "18:30",
    venue: "Allianz Arena",
    status: "upcoming",
    moneyline: { home: 58, draw: 22, away: 20 },
    spread: { homeLabel: "BAY -1.5", homePrice: 40, awayLabel: "BVB +1.5", awayPrice: 60 },
    total: { overLabel: "O 3.5", overPrice: 55, underLabel: "U 3.5", underPrice: 45 },
    outcomes: [
      { label: "Bayern Win", probability: 58, odds: 1.65 },
      { label: "Draw", probability: 22, odds: 4.00 },
      { label: "Dortmund Win", probability: 20, odds: 4.50 },
    ],
    totalVolume: 345600,
    participantsCount: 1876,
    description: "Der Klassiker - Germany's biggest rivalry.",
    aiConfidence: 82,
    tags: ["Der Klassiker"],
    matchCount: 10,
    probabilityHistory: [55, 52, 58, 60, 56, 59, 57, 61, 58, 58],
    aiPick: { team: "home", confidence: 82 },
  },
  {
    id: "pred-5",
    league: leagues[3],
    homeTeam: teams.inter,
    awayTeam: teams.acMilan,
    matchDate: "2026-03-14",
    matchTime: "20:45",
    venue: "San Siro",
    status: "live",
    homeScore: 1,
    awayScore: 1,
    moneyline: { home: 48, draw: 26, away: 26 },
    spread: { homeLabel: "INT -0.5", homePrice: 50, awayLabel: "MIL +0.5", awayPrice: 50 },
    total: { overLabel: "O 2.5", overPrice: 55, underLabel: "U 2.5", underPrice: 45 },
    outcomes: [
      { label: "Inter Win", probability: 48, odds: 1.95 },
      { label: "Draw", probability: 26, odds: 3.50 },
      { label: "AC Milan Win", probability: 26, odds: 3.60 },
    ],
    totalVolume: 278900,
    participantsCount: 1567,
    description: "The Derby della Madonnina - Milan's most heated rivalry.",
    aiConfidence: 71,
    tags: ["Derby", "Live"],
    matchCount: 8,
    probabilityHistory: [50, 46, 48, 52, 49, 47, 50, 48, 46, 48],
    aiPick: { team: "home", confidence: 71 },
  },
  {
    id: "pred-6",
    league: leagues[0],
    homeTeam: teams.manUtd,
    awayTeam: teams.tottenham,
    matchDate: "2026-03-16",
    matchTime: "14:00",
    venue: "Old Trafford",
    status: "upcoming",
    moneyline: { home: 38, draw: 30, away: 32 },
    spread: { homeLabel: "MUN -0.5", homePrice: 40, awayLabel: "TOT +0.5", awayPrice: 60 },
    total: { overLabel: "O 2.5", overPrice: 58, underLabel: "U 2.5", underPrice: 42 },
    outcomes: [
      { label: "Man United Win", probability: 38, odds: 2.50 },
      { label: "Draw", probability: 30, odds: 3.10 },
      { label: "Tottenham Win", probability: 32, odds: 2.90 },
    ],
    totalVolume: 198400,
    participantsCount: 987,
    description: "Manchester United welcome Tottenham to Old Trafford.",
    aiConfidence: 61,
    tags: ["Top 4 Battle"],
    matchCount: 9,
    probabilityHistory: [35, 37, 36, 40, 38, 35, 39, 37, 38, 38],
    aiPick: { team: "home", confidence: 61 },
  },
  {
    id: "pred-7",
    league: leagues[5],
    homeTeam: teams.arsenal,
    awayTeam: teams.realMadrid,
    matchDate: "2026-03-18",
    matchTime: "21:00",
    venue: "Emirates Stadium",
    status: "upcoming",
    moneyline: { home: 35, draw: 28, away: 37 },
    spread: { homeLabel: "ARS +0.5", homePrice: 55, awayLabel: "RMA -0.5", awayPrice: 45 },
    total: { overLabel: "O 2.5", overPrice: 52, underLabel: "U 2.5", underPrice: 48 },
    outcomes: [
      { label: "Arsenal Win", probability: 35, odds: 2.70 },
      { label: "Draw", probability: 28, odds: 3.30 },
      { label: "Real Madrid Win", probability: 37, odds: 2.55 },
    ],
    totalVolume: 623400,
    participantsCount: 3214,
    description: "Champions League quarter-final first leg.",
    aiConfidence: 58,
    tags: ["UCL", "Quarter-Final"],
    matchCount: 14,
    probabilityHistory: [32, 30, 35, 33, 36, 34, 37, 35, 33, 35],
    aiPick: { team: "away", confidence: 58 },
  },
  {
    id: "pred-8",
    league: leagues[0],
    homeTeam: teams.newcastle,
    awayTeam: teams.astonVilla,
    matchDate: "2026-03-14",
    matchTime: "15:00",
    venue: "St James' Park",
    status: "upcoming",
    moneyline: { home: 50, draw: 26, away: 24 },
    spread: { homeLabel: "NEW -1.5", homePrice: 30, awayLabel: "AVL +1.5", awayPrice: 70 },
    total: { overLabel: "O 2.5", overPrice: 60, underLabel: "U 2.5", underPrice: 40 },
    outcomes: [
      { label: "Newcastle Win", probability: 50, odds: 1.90 },
      { label: "Draw", probability: 26, odds: 3.50 },
      { label: "Aston Villa Win", probability: 24, odds: 3.80 },
    ],
    totalVolume: 145200,
    participantsCount: 654,
    description: "Newcastle United host Aston Villa at St James' Park.",
    aiConfidence: 74,
    tags: ["European Race"],
    matchCount: 6,
    probabilityHistory: [46, 48, 50, 47, 52, 49, 51, 50, 48, 50],
    aiPick: { team: "home", confidence: 74 },
  },
  {
    id: "pred-9",
    league: leagues[1],
    homeTeam: teams.atletico,
    awayTeam: teams.realMadrid,
    matchDate: "2026-03-22",
    matchTime: "21:00",
    venue: "Metropolitano",
    status: "upcoming",
    moneyline: { home: 30, draw: 28, away: 42 },
    spread: { homeLabel: "ATM +0.5", homePrice: 55, awayLabel: "RMA -0.5", awayPrice: 45 },
    total: { overLabel: "O 2.5", overPrice: 48, underLabel: "U 2.5", underPrice: 52 },
    outcomes: [
      { label: "Atletico Win", probability: 30, odds: 3.10 },
      { label: "Draw", probability: 28, odds: 3.30 },
      { label: "Real Madrid Win", probability: 42, odds: 2.25 },
    ],
    totalVolume: 367800,
    participantsCount: 1923,
    description: "The Madrid Derby at the Metropolitano.",
    aiConfidence: 67,
    tags: ["Madrid Derby"],
    matchCount: 11,
    probabilityHistory: [28, 30, 26, 32, 29, 31, 28, 30, 29, 30],
    aiPick: { team: "away", confidence: 67 },
  },
  {
    id: "pred-10",
    league: leagues[5],
    homeTeam: teams.barcelona,
    awayTeam: teams.bayern,
    matchDate: "2026-03-19",
    matchTime: "21:00",
    venue: "Camp Nou",
    status: "upcoming",
    moneyline: { home: 42, draw: 26, away: 32 },
    spread: { homeLabel: "BAR -0.5", homePrice: 45, awayLabel: "BAY +0.5", awayPrice: 55 },
    total: { overLabel: "O 3.5", overPrice: 50, underLabel: "U 3.5", underPrice: 50 },
    outcomes: [
      { label: "Barcelona Win", probability: 42, odds: 2.25 },
      { label: "Draw", probability: 26, odds: 3.50 },
      { label: "Bayern Win", probability: 32, odds: 2.90 },
    ],
    totalVolume: 534100,
    participantsCount: 2678,
    description: "Champions League quarter-final.",
    aiConfidence: 63,
    tags: ["UCL", "Quarter-Final"],
    matchCount: 16,
    probabilityHistory: [40, 38, 42, 44, 41, 43, 40, 42, 41, 42],
    aiPick: { team: "home", confidence: 63 },
  },
  {
    id: "pred-11",
    league: leagues[3],
    homeTeam: teams.juventus,
    awayTeam: teams.inter,
    matchDate: "2026-03-21",
    matchTime: "20:45",
    venue: "Allianz Stadium",
    status: "upcoming",
    moneyline: { home: 36, draw: 30, away: 34 },
    spread: { homeLabel: "JUV +0.5", homePrice: 52, awayLabel: "INT -0.5", awayPrice: 48 },
    total: { overLabel: "O 2.5", overPrice: 45, underLabel: "U 2.5", underPrice: 55 },
    outcomes: [
      { label: "Juventus Win", probability: 36, odds: 2.60 },
      { label: "Draw", probability: 30, odds: 3.10 },
      { label: "Inter Win", probability: 34, odds: 2.75 },
    ],
    totalVolume: 289700,
    participantsCount: 1456,
    description: "The Derby d'Italia.",
    aiConfidence: 59,
    tags: ["Derby d'Italia"],
    matchCount: 7,
    probabilityHistory: [34, 36, 33, 38, 35, 37, 34, 36, 35, 36],
    aiPick: { team: "home", confidence: 59 },
  },
  {
    id: "pred-12",
    league: leagues[0],
    homeTeam: teams.liverpool,
    awayTeam: teams.arsenal,
    matchDate: "2026-03-28",
    matchTime: "17:30",
    venue: "Anfield",
    status: "upcoming",
    moneyline: { home: 44, draw: 28, away: 28 },
    spread: { homeLabel: "LIV -0.5", homePrice: 46, awayLabel: "ARS +0.5", awayPrice: 54 },
    total: { overLabel: "O 2.5", overPrice: 65, underLabel: "U 2.5", underPrice: 35 },
    outcomes: [
      { label: "Liverpool Win", probability: 44, odds: 2.15 },
      { label: "Draw", probability: 28, odds: 3.30 },
      { label: "Arsenal Win", probability: 28, odds: 3.30 },
    ],
    totalVolume: 478200,
    participantsCount: 2345,
    description: "Two title contenders meet at Anfield.",
    aiConfidence: 69,
    tags: ["Title Race", "Featured"],
    matchCount: 13,
    probabilityHistory: [40, 42, 44, 41, 46, 43, 45, 44, 42, 44],
    aiPick: { team: "home", confidence: 69 },
  },
];

// Fixtures
export const fixtures: Fixture[] = [
  { id: "fix-1", league: leagues[0], homeTeam: teams.arsenal, awayTeam: teams.chelsea, matchDate: "2026-03-14", matchTime: "15:00", venue: "Emirates Stadium", status: "scheduled", matchday: 29 },
  { id: "fix-2", league: leagues[0], homeTeam: teams.newcastle, awayTeam: teams.astonVilla, matchDate: "2026-03-14", matchTime: "15:00", venue: "St James' Park", status: "scheduled", matchday: 29 },
  { id: "fix-3", league: leagues[3], homeTeam: teams.inter, awayTeam: teams.acMilan, matchDate: "2026-03-14", matchTime: "20:45", venue: "San Siro", status: "live", homeScore: 1, awayScore: 1, matchday: 28 },
  { id: "fix-4", league: leagues[0], homeTeam: teams.liverpool, awayTeam: teams.manCity, matchDate: "2026-03-15", matchTime: "17:30", venue: "Anfield", status: "scheduled", matchday: 29, broadcast: "Sky Sports" },
  { id: "fix-5", league: leagues[2], homeTeam: teams.bayern, awayTeam: teams.dortmund, matchDate: "2026-03-15", matchTime: "18:30", venue: "Allianz Arena", status: "scheduled", matchday: 26, broadcast: "DAZN" },
  { id: "fix-6", league: leagues[1], homeTeam: teams.realMadrid, awayTeam: teams.barcelona, matchDate: "2026-03-16", matchTime: "21:00", venue: "Santiago Bernabeu", status: "scheduled", matchday: 28, broadcast: "DAZN" },
  { id: "fix-7", league: leagues[0], homeTeam: teams.manUtd, awayTeam: teams.tottenham, matchDate: "2026-03-16", matchTime: "14:00", venue: "Old Trafford", status: "scheduled", matchday: 29, broadcast: "Sky Sports" },
  { id: "fix-8", league: leagues[5], homeTeam: teams.arsenal, awayTeam: teams.realMadrid, matchDate: "2026-03-18", matchTime: "21:00", venue: "Emirates Stadium", status: "scheduled", matchday: 0, broadcast: "TNT Sports" },
  { id: "fix-9", league: leagues[5], homeTeam: teams.barcelona, awayTeam: teams.bayern, matchDate: "2026-03-19", matchTime: "21:00", venue: "Camp Nou", status: "scheduled", matchday: 0, broadcast: "TNT Sports" },
  { id: "fix-10", league: leagues[3], homeTeam: teams.juventus, awayTeam: teams.inter, matchDate: "2026-03-21", matchTime: "20:45", venue: "Allianz Stadium", status: "scheduled", matchday: 29 },
  { id: "fix-11", league: leagues[1], homeTeam: teams.atletico, awayTeam: teams.realMadrid, matchDate: "2026-03-22", matchTime: "21:00", venue: "Metropolitano", status: "scheduled", matchday: 29 },
  { id: "fix-12", league: leagues[0], homeTeam: teams.liverpool, awayTeam: teams.arsenal, matchDate: "2026-03-28", matchTime: "17:30", venue: "Anfield", status: "scheduled", matchday: 30, broadcast: "Sky Sports" },
  { id: "fix-13", league: leagues[0], homeTeam: teams.chelsea, awayTeam: teams.manCity, matchDate: "2026-03-10", matchTime: "16:30", venue: "Stamford Bridge", status: "completed", homeScore: 2, awayScore: 1, matchday: 28 },
  { id: "fix-14", league: leagues[0], homeTeam: teams.tottenham, awayTeam: teams.newcastle, matchDate: "2026-03-10", matchTime: "14:00", venue: "Tottenham Hotspur Stadium", status: "completed", homeScore: 0, awayScore: 0, matchday: 28 },
  { id: "fix-15", league: leagues[1], homeTeam: teams.barcelona, awayTeam: teams.atletico, matchDate: "2026-03-09", matchTime: "21:00", venue: "Camp Nou", status: "completed", homeScore: 3, awayScore: 1, matchday: 27 },
];

// Helper functions
export function formatVolume(volume: number): string {
  if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
  if (volume >= 1000) return `$${(volume / 1000).toFixed(2)}K`;
  return `$${volume}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function getPredictionsByLeague(leagueSlug: string): Prediction[] {
  if (leagueSlug === "all") return predictions;
  return predictions.filter((p) => p.league.slug === leagueSlug);
}

export function getFixturesByLeague(leagueSlug: string): Fixture[] {
  if (leagueSlug === "all") return fixtures;
  return fixtures.filter((f) => f.league.slug === leagueSlug);
}

export function getPredictionById(id: string): Prediction | undefined {
  return predictions.find((p) => p.id === id);
}
