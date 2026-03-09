"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, TrendingUp, Award } from "lucide-react";
import { useFixtureOddsCompare } from "@/lib/hooks/use-fixtures";
import { easing, duration } from "@/lib/animations";
import type { ApiOutcomeComparison, ApiOddsComparison } from "@/types/api";

interface OddsComparisonProps {
  fixtureId: number;
}

export function OddsComparison({ fixtureId }: OddsComparisonProps) {
  const { data, isLoading } = useFixtureOddsCompare(fixtureId, fixtureId > 0);
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#f0f0f0] rounded-[12px] mb-6 overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <div className="skeleton h-4 w-40 rounded mb-1" />
          <div className="skeleton h-3 w-64 rounded" />
        </div>
        <div className="h-px bg-[#f0f0f0]" />
        <div className="p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-10 flex-1 rounded-[8px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const h2hMarket = data.markets?.["h2h"];
  if (!h2hMarket || h2hMarket.outcomes.length === 0) return null;

  const totalBookmakers = h2hMarket.bookmakerCount;
  const hasValueBets = h2hMarket.valueBets.length > 0;

  return (
    <div className="bg-white border border-[#f0f0f0] rounded-[12px] mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        {/* 3D odds icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="4"
            width="8"
            height="16"
            rx="2"
            fill="#1552f0"
            opacity="0.15"
          />
          <rect
            x="14"
            y="4"
            width="8"
            height="16"
            rx="2"
            fill="#1552f0"
            opacity="0.15"
          />
          <path
            d="M6 8v8M18 8v8"
            stroke="#1552f0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 12h4"
            stroke="#1552f0"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-[14px] font-bold text-[#1a1a2e]">
            Odds Comparison
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-[#999] bg-[#f5f5f5] px-2 py-0.5 rounded-full">
          {totalBookmakers} bookmaker{totalBookmakers !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="h-px bg-[#f0f0f0]" />

      {/* Value bets banner */}
      {hasValueBets && (
        <div className="mx-5 mt-4 mb-2 flex items-center gap-2 px-3 py-2 bg-[#00c853]/5 border border-[#00c853]/15 rounded-[8px]">
          <TrendingUp className="w-3.5 h-3.5 text-[#00c853] shrink-0" />
          <span className="text-[11px] font-semibold text-[#00c853]">
            {h2hMarket.valueBets.length} value bet
            {h2hMarket.valueBets.length !== 1 ? "s" : ""} detected
          </span>
        </div>
      )}

      {/* Outcome rows */}
      <div className="px-5 py-4 space-y-2">
        {h2hMarket.outcomes.map((outcome) => (
          <OutcomeRow
            key={outcome.outcome}
            outcome={outcome}
            expanded={expandedOutcome === outcome.outcome}
            onToggle={() =>
              setExpandedOutcome(
                expandedOutcome === outcome.outcome
                  ? null
                  : outcome.outcome,
              )
            }
          />
        ))}
      </div>

      {/* Totals market (if available) */}
      {data.markets?.["totals"] &&
        data.markets["totals"].outcomes.length > 0 && (
          <>
            <div className="h-px bg-[#f0f0f0]" />
            <div className="px-5 py-4">
              <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                Over/Under
              </div>
              <div className="space-y-2">
                {data.markets["totals"].outcomes.map((outcome) => (
                  <OutcomeRow
                    key={outcome.outcome}
                    outcome={outcome}
                    expanded={expandedOutcome === `totals-${outcome.outcome}`}
                    onToggle={() =>
                      setExpandedOutcome(
                        expandedOutcome === `totals-${outcome.outcome}`
                          ? null
                          : `totals-${outcome.outcome}`,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
    </div>
  );
}

// ─── Outcome row with expandable bookmaker list ─────────────────────

function OutcomeRow({
  outcome,
  expanded,
  onToggle,
}: {
  outcome: ApiOutcomeComparison;
  expanded: boolean;
  onToggle: () => void;
}) {
  const bestPrice = outcome.bestPrice;
  const worstPrice = outcome.worstPrice;
  const hasValueBet = outcome.valueBet !== null;

  return (
    <div>
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors cursor-pointer group"
      >
        {/* Outcome name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-[#1a1a2e] truncate">
            {outcome.outcome}
          </span>
          {hasValueBet && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#00c853]/10 rounded text-[9px] font-bold text-[#00c853] shrink-0">
              <TrendingUp className="w-2.5 h-2.5" />
              +{outcome.valueBet!.edgePercent}%
            </span>
          )}
        </div>

        {/* Best price */}
        {bestPrice && (
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-[#1552f0]">
                {bestPrice.price.toFixed(2)}
              </span>
              <span className="text-[9px] text-[#bbb] font-medium max-w-[60px] truncate">
                {bestPrice.bookmakerName}
              </span>
            </div>
          </div>
        )}

        {/* Spread indicator */}
        {outcome.spread > 0 && (
          <span className="text-[10px] font-medium text-[#999] bg-white px-1.5 py-0.5 rounded border border-[#e8e8e8] shrink-0">
            ±{outcome.spread.toFixed(2)}
          </span>
        )}

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: duration.fast, ease: easing.ease }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#ccc] group-hover:text-[#999] transition-colors" />
        </motion.div>
      </button>

      {/* Expanded bookmaker list */}
      <AnimatePresence>
        {expanded && outcome.bookmakers.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.normal, ease: easing.easeOut }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 pl-3">
              <div className="border-l-2 border-[#f0f0f0] pl-3 space-y-0.5">
                {outcome.bookmakers.map((bk, i) => {
                  const isBest = bestPrice?.bookmakerKey === bk.bookmakerKey;
                  const isWorst =
                    worstPrice?.bookmakerKey === bk.bookmakerKey &&
                    outcome.bookmakers.length > 1;

                  return (
                    <div
                      key={bk.bookmakerKey}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-[6px] ${
                        isBest
                          ? "bg-[#1552f0]/4"
                          : "hover:bg-[#fafafa]"
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <Award className="w-3 h-3 text-[#1552f0]" />
                        )}
                        <span
                          className={`text-[12px] ${
                            isBest
                              ? "font-bold text-[#1552f0]"
                              : "font-medium text-[#666]"
                          }`}
                        >
                          {bk.bookmakerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[13px] font-bold ${
                            isBest
                              ? "text-[#1552f0]"
                              : isWorst
                                ? "text-[#ff3d57]"
                                : "text-[#1a1a2e]"
                          }`}
                        >
                          {bk.price.toFixed(2)}
                        </span>
                        {bk.impliedProbability > 0 && (
                          <span className="text-[10px] text-[#bbb] w-[36px] text-right">
                            {(bk.impliedProbability * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
