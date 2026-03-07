"use client";

import Link from "next/link";
import { TrendingUp, Users, Clock } from "lucide-react";
import { Card, Badge, ProgressBar } from "@/components/ui";
import { Prediction } from "@/types";
import { formatVolume, formatDate } from "@/lib/mock-data";

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const topOutcome = prediction.outcomes.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  const probabilityColor =
    topOutcome.probability >= 50
      ? "green"
      : topOutcome.probability >= 35
      ? "amber"
      : "red";

  return (
    <Link href={`/prediction/${prediction.id}`}>
      <Card hoverable padding="none" className="overflow-hidden group">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{prediction.league.logo}</span>
              <span className="text-xs font-medium text-text-tertiary">
                {prediction.league.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {prediction.status === "live" && (
                <Badge variant="live" dot>
                  LIVE
                </Badge>
              )}
              {prediction.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="info" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Match Teams */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{prediction.homeTeam.logo}</span>
                <span className="text-sm font-semibold text-text-primary truncate">
                  {prediction.homeTeam.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{prediction.awayTeam.logo}</span>
                <span className="text-sm font-semibold text-text-primary truncate">
                  {prediction.awayTeam.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-green">
                {topOutcome.probability}%
              </div>
              <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-wide">
                {topOutcome.label.split(" ").slice(0, -1).join(" ")}
              </div>
            </div>
          </div>

          {/* Outcome Bars */}
          <div className="space-y-2">
            {prediction.outcomes.map((outcome, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-text-secondary w-20 truncate">
                  {outcome.label}
                </span>
                <ProgressBar
                  value={outcome.probability}
                  color={
                    i === 0 ? "green" : i === 1 ? "amber" : "red"
                  }
                  size="sm"
                  className="flex-1"
                />
                <span className="text-xs font-semibold text-text-primary w-10 text-right">
                  {outcome.probability}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-bg-secondary/50 border-t border-border-secondary flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-text-tertiary">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[11px] font-medium">
                {formatVolume(prediction.totalVolume)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-text-tertiary">
              <Users className="w-3 h-3" />
              <span className="text-[11px] font-medium">
                {prediction.participantsCount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-text-tertiary">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] font-medium">
              {formatDate(prediction.matchDate)} {prediction.matchTime}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
