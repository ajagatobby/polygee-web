"use client";

import { Users } from "lucide-react";
import type { ApiLineup, ApiLineupPlayer } from "@/types/api";

interface MatchLineupsProps {
  lineups: ApiLineup[];
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
}

/** Position label abbreviation → full name */
function posLabel(pos: string): string {
  switch (pos) {
    case "G":
      return "GK";
    case "D":
      return "DEF";
    case "M":
      return "MID";
    case "F":
      return "FWD";
    default:
      return pos;
  }
}

/** Position sort order: GK → DEF → MID → FWD */
function posOrder(pos: string): number {
  switch (pos) {
    case "G":
      return 0;
    case "D":
      return 1;
    case "M":
      return 2;
    case "F":
      return 3;
    default:
      return 4;
  }
}

/** Position badge color */
function posColor(pos: string): { bg: string; text: string } {
  switch (pos) {
    case "G":
      return { bg: "#fff3e0", text: "#e65100" };
    case "D":
      return { bg: "#e3f2fd", text: "#1565c0" };
    case "M":
      return { bg: "#e8f5e9", text: "#2e7d32" };
    case "F":
      return { bg: "#fce4ec", text: "#c62828" };
    default:
      return { bg: "#f5f5f5", text: "#666" };
  }
}

/** Group players by position, sorted GK → DEF → MID → FWD */
function groupByPosition(
  players: ApiLineupPlayer[]
): { position: string; label: string; players: ApiLineupPlayer[] }[] {
  const groups: Record<string, ApiLineupPlayer[]> = {};

  for (const p of players) {
    const key = p.pos || "?";
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => posOrder(a) - posOrder(b))
    .map(([pos, players]) => ({
      position: pos,
      label: posLabel(pos),
      players: players.sort((a, b) => a.number - b.number),
    }));
}

function TeamLineup({
  lineup,
  teamName,
  teamLogo,
}: {
  lineup: ApiLineup;
  teamName: string;
  teamLogo: string | null;
}) {
  const startXI = lineup.startXI ?? [];
  const subs = lineup.substitutes ?? [];
  const grouped = groupByPosition(startXI);

  return (
    <div className="flex-1 min-w-0">
      {/* Team header */}
      <div className="flex items-center gap-2.5 mb-3">
        {teamLogo ? (
          <img
            src={teamLogo}
            alt={teamName}
            className="w-6 h-6 object-contain shrink-0"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#e8e8e8] shrink-0" />
        )}
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-[#1a1a2e] truncate">
            {teamName}
          </div>
          {lineup.formation && (
            <div className="text-[11px] text-[#999] font-medium">
              {lineup.formation}
            </div>
          )}
        </div>
      </div>

      {/* Coach */}
      {lineup.coachName && (
        <div className="flex items-center gap-1.5 mb-3 text-[11px] text-[#999]">
          <span className="font-medium">Coach:</span>
          <span className="text-[#666] font-semibold">{lineup.coachName}</span>
        </div>
      )}

      {/* Starting XI grouped by position */}
      {grouped.length > 0 && (
        <div className="space-y-3">
          {grouped.map((group) => (
            <div key={group.position}>
              <div className="text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1.5">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.players.map((player) => {
                  const color = posColor(player.pos);
                  return (
                    <div
                      key={player.id}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-[6px] hover:bg-[#fafafa] transition-colors"
                    >
                      {/* Number */}
                      <span className="text-[11px] font-bold text-[#bbb] w-5 text-right shrink-0 tabular-nums">
                        {player.number}
                      </span>
                      {/* Player photo */}
                      <img
                        src={`https://media.api-sports.io/football/players/${player.id}.png`}
                        alt={player.name}
                        className="w-6 h-6 rounded-full object-cover bg-[#f0f0f0] shrink-0"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.src = "";
                          el.className =
                            "w-6 h-6 rounded-full bg-[#e8e8e8] shrink-0";
                        }}
                      />
                      {/* Name */}
                      <span className="text-[12px] font-medium text-[#1a1a2e] truncate flex-1">
                        {player.name}
                      </span>
                      {/* Position badge */}
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          backgroundColor: color.bg,
                          color: color.text,
                        }}
                      >
                        {posLabel(player.pos)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Substitutes */}
      {subs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
          <div className="text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1.5">
            Substitutes
          </div>
          <div className="space-y-0.5">
            {subs
              .sort((a, b) => posOrder(a.pos) - posOrder(b.pos))
              .map((player) => {
                const color = posColor(player.pos);
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-[6px] hover:bg-[#fafafa] transition-colors"
                  >
                    <span className="text-[11px] font-bold text-[#ccc] w-5 text-right shrink-0 tabular-nums">
                      {player.number}
                    </span>
                    <img
                      src={`https://media.api-sports.io/football/players/${player.id}.png`}
                      alt={player.name}
                      className="w-6 h-6 rounded-full object-cover bg-[#f0f0f0] shrink-0"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.src = "";
                        el.className =
                          "w-6 h-6 rounded-full bg-[#e8e8e8] shrink-0";
                      }}
                    />
                    <span className="text-[12px] text-[#808080] truncate flex-1">
                      {player.name}
                    </span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 opacity-60"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {posLabel(player.pos)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {startXI.length === 0 && subs.length === 0 && (
        <div className="text-center py-6">
          <p className="text-[11px] text-[#bbb]">Lineup not available</p>
        </div>
      )}
    </div>
  );
}

export function MatchLineups({
  lineups,
  homeTeamId,
  awayTeamId,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
}: MatchLineupsProps) {
  if (!lineups || lineups.length === 0) return null;

  // Match lineups to home/away by teamId
  const homeLineup = lineups.find((l) => l.teamId === homeTeamId);
  const awayLineup = lineups.find((l) => l.teamId === awayTeamId);

  if (!homeLineup && !awayLineup) return null;

  return (
    <div className="bg-white border border-[#f0f0f0] rounded-[12px] mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Users className="w-4 h-4 text-[#1552f0]" />
        <h3 className="text-[14px] font-bold text-[#1a1a2e]">Lineups</h3>
        {(homeLineup?.formation || awayLineup?.formation) && (
          <span className="text-[11px] text-[#999] font-medium ml-auto">
            {homeLineup?.formation ?? "—"} vs {awayLineup?.formation ?? "—"}
          </span>
        )}
      </div>

      {/* Two-column lineup panels */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-0">
        {homeLineup && (
          <div className="flex-1 px-5 pb-5 md:border-r md:border-[#f0f0f0]">
            <TeamLineup
              lineup={homeLineup}
              teamName={homeTeamName}
              teamLogo={homeTeamLogo}
            />
          </div>
        )}
        {awayLineup && (
          <div className="flex-1 px-5 pb-5 border-t md:border-t-0 border-[#f0f0f0] pt-4 md:pt-0">
            <TeamLineup
              lineup={awayLineup}
              teamName={awayTeamName}
              teamLogo={awayTeamLogo}
            />
          </div>
        )}
      </div>
    </div>
  );
}
