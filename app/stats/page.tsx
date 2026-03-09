"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/lib/auth-context";
import {
  useAccuracyStats,
  useDailyBreakdown,
  usePerformanceFeedback,
} from "@/lib/hooks/use-predictions";
import { easing, duration } from "@/lib/animations";
import type {
  ApiDailyBreakdownPrediction,
  ApiResultBreakdown,
} from "@/types/api";

function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getResultLabel(result: string): string {
  switch (result) {
    case "home_win":
      return "Home Win";
    case "draw":
      return "Draw";
    case "away_win":
      return "Away Win";
    default:
      return result;
  }
}

function getResultColor(result: string | null): string {
  switch (result) {
    case "home_win":
      return "#1552f0";
    case "draw":
      return "#ff9100";
    case "away_win":
      return "#7c3aed";
    default:
      return "#999";
  }
}

export default function StatsPage() {
  const { isAuthenticated, isPro, loading: authLoading } = useAuth();

  // Date navigation for daily breakdown
  const [dateOffset, setDateOffset] = useState(0);
  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d.toISOString().split("T")[0];
  }, [dateOffset]);

  // Data fetching
  const { data: accuracy, isLoading: accLoading } = useAccuracyStats();
  const { data: daily, isLoading: dailyLoading } =
    useDailyBreakdown(selectedDate);
  const { data: feedback, isLoading: feedbackLoading } =
    usePerformanceFeedback();

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <StatsPageSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || !isPro) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="p-8 bg-white border border-[#f0f0f0] rounded-[16px]">
            <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#e7edfe] mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-[#1552f0]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
              AI Performance Stats
            </h1>
            <p className="text-[14px] text-[#808080] leading-relaxed max-w-[400px] mx-auto mb-6">
              Detailed accuracy stats, daily breakdowns, and AI calibration
              insights are available exclusively for Pro subscribers.
            </p>
            <div className="flex items-center justify-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/sign-in"
                    className="flex items-center h-[40px] px-5 text-[13px] font-medium text-[#1a1a2e] bg-[#f5f5f5] rounded-[8px] hover:bg-[#ebebeb] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center h-[40px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
                  >
                    Sign Up Free
                  </Link>
                </>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center h-[40px] px-6 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
                >
                  View Pro Plans
                </Link>
              )}
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  const overallAccuracy = accuracy?.accuracy ?? 0;
  const accuracyColor =
    overallAccuracy >= 0.6
      ? "#00c853"
      : overallAccuracy >= 0.45
        ? "#ff9100"
        : "#ff3d57";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-5 pb-20 sm:pb-5">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-[#666] transition-colors mb-5 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Predictions
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          {/* 3D chart icon */}
          <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#e7edfe]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="14"
                width="4"
                height="7"
                rx="1"
                fill="#1552f0"
                opacity="0.3"
              />
              <rect
                x="10"
                y="8"
                width="4"
                height="13"
                rx="1"
                fill="#1552f0"
                opacity="0.6"
              />
              <rect
                x="17"
                y="3"
                width="4"
                height="18"
                rx="1"
                fill="#1552f0"
              />
              <line
                x1="2"
                y1="21"
                x2="22"
                y2="21"
                stroke="#1552f0"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              AI Performance
            </h1>
            <p className="text-[13px] text-[#808080]">
              Track record and calibration insights
            </p>
          </div>
        </div>

        {/* Top metrics row */}
        {accLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
              >
                <div className="skeleton h-3 w-16 rounded mb-3" />
                <div className="skeleton h-7 w-20 rounded mb-1" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : accuracy ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {/* Overall Accuracy */}
            <motion.div
              className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, ease: easing.easeOut }}
            >
              <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-2">
                Accuracy
              </div>
              <div className="flex items-end gap-2">
                <span
                  className="text-[28px] font-bold tracking-[-0.02em]"
                  style={{ color: accuracyColor }}
                >
                  {formatPct(overallAccuracy)}
                </span>
              </div>
              <div className="text-[11px] text-[#bbb] mt-1">
                {accuracy.correct}/{accuracy.totalResolved} correct
              </div>
            </motion.div>

            {/* Total Resolved */}
            <motion.div
              className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.easeOut,
                delay: 0.05,
              }}
            >
              <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-2">
                Resolved
              </div>
              <div className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                {accuracy.totalResolved}
              </div>
              <div className="text-[11px] text-[#bbb] mt-1">
                total predictions
              </div>
            </motion.div>

            {/* Avg Brier Score */}
            <motion.div
              className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.easeOut,
                delay: 0.1,
              }}
            >
              <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-2">
                Brier Score
              </div>
              <div className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                {accuracy.avgBrierScore != null
                  ? accuracy.avgBrierScore.toFixed(3)
                  : "—"}
              </div>
              <div className="text-[11px] text-[#bbb] mt-1">
                lower is better
              </div>
            </motion.div>

            {/* By Type */}
            <motion.div
              className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.easeOut,
                delay: 0.15,
              }}
            >
              <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-2">
                By Type
              </div>
              <div className="space-y-1.5">
                {Object.entries(accuracy.byType).map(([type, stats]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#666] capitalize">
                      {type.replace("_", " ")}
                    </span>
                    <span className="text-[12px] font-bold text-[#1a1a2e]">
                      {formatPct(stats.accuracy)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* Two-column: Daily Breakdown + Calibration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Daily Breakdown */}
          <div className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden">
            {/* Date navigation */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                Daily Breakdown
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDateOffset((d) => d - 1)}
                  className="p-1 text-[#999] hover:text-[#666] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[12px] font-semibold text-[#1a1a2e] min-w-[100px] text-center">
                  {formatDate(selectedDate)}
                </span>
                <button
                  onClick={() => setDateOffset((d) => Math.min(d + 1, 0))}
                  disabled={dateOffset >= 0}
                  className="p-1 text-[#999] hover:text-[#666] transition-colors cursor-pointer disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-px bg-[#f0f0f0]" />

            {dailyLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-6 h-6 rounded-full" />
                    <div className="flex-1">
                      <div className="skeleton h-3 w-40 rounded mb-1" />
                      <div className="skeleton h-2.5 w-24 rounded" />
                    </div>
                    <div className="skeleton h-5 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            ) : daily ? (
              <>
                {/* Summary stats */}
                <div className="grid grid-cols-4 gap-px bg-[#f0f0f0]">
                  {[
                    {
                      label: "Total",
                      value: daily.summary.total,
                      color: "#1a1a2e",
                    },
                    {
                      label: "Correct",
                      value: daily.summary.correct,
                      color: "#00c853",
                    },
                    {
                      label: "Wrong",
                      value: daily.summary.incorrect,
                      color: "#ff3d57",
                    },
                    {
                      label: "Pending",
                      value: daily.summary.pending,
                      color: "#ff9100",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white px-3 py-3 text-center"
                    >
                      <div
                        className="text-[18px] font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-medium text-[#999] uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accuracy bar */}
                {daily.summary.resolved > 0 && (
                  <div className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-[#999]">
                        Accuracy
                      </span>
                      <span className="text-[12px] font-bold text-[#1a1a2e]">
                        {formatPct(daily.summary.accuracy)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            daily.summary.accuracy >= 0.6
                              ? "#00c853"
                              : daily.summary.accuracy >= 0.45
                                ? "#ff9100"
                                : "#ff3d57",
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${daily.summary.accuracy * 100}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: easing.easeOut,
                          delay: 0.2,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Per-match results */}
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
                  {daily.predictions.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <Clock className="w-5 h-5 text-[#ccc] mx-auto mb-2" />
                      <p className="text-[12px] text-[#999]">
                        No predictions for this date
                      </p>
                    </div>
                  ) : (
                    daily.predictions.map((p) => (
                      <DailyPredictionRow key={p.predictionId} prediction={p} />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-[12px] text-[#999]">
                  No data available
                </p>
              </div>
            )}
          </div>

          {/* Confidence Calibration */}
          <div className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                Confidence Calibration
              </h2>
              <p className="text-[11px] text-[#999] mt-0.5">
                Do higher confidence predictions actually perform better?
              </p>
            </div>

            <div className="h-px bg-[#f0f0f0]" />

            {feedbackLoading ? (
              <div className="p-5 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton h-3 w-32 rounded mb-2" />
                    <div className="skeleton h-6 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : feedback ? (
              <div className="p-5">
                {/* Calibration bars */}
                <div className="space-y-4 mb-5">
                  {[
                    {
                      label: "High Confidence (8-10)",
                      bucket: feedback.confidenceCalibration.highConfidence,
                      color: "#00c853",
                    },
                    {
                      label: "Medium Confidence (5-7)",
                      bucket: feedback.confidenceCalibration.medConfidence,
                      color: "#ff9100",
                    },
                    {
                      label: "Low Confidence (1-4)",
                      bucket: feedback.confidenceCalibration.lowConfidence,
                      color: "#ff3d57",
                    },
                  ].map(({ label, bucket, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-[#666]">
                          {label}
                        </span>
                        <span className="text-[11px] text-[#999]">
                          {bucket.correct}/{bucket.total} ({formatPct(bucket.accuracy)})
                        </span>
                      </div>
                      <div className="h-3 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.max(bucket.accuracy * 100, 2)}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: easing.easeOut,
                            delay: 0.3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Predicted vs Actual Distribution */}
                <div className="mb-5">
                  <h3 className="text-[12px] font-bold text-[#1a1a2e] mb-3">
                    Predicted vs Actual Distribution
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "Home Win",
                        predicted: feedback.avgProbabilities.homeWinProb,
                        actual: feedback.actualDistribution.homeWinPct,
                      },
                      {
                        label: "Draw",
                        predicted: feedback.avgProbabilities.drawProb,
                        actual: feedback.actualDistribution.drawPct,
                      },
                      {
                        label: "Away Win",
                        predicted: feedback.avgProbabilities.awayWinProb,
                        actual: feedback.actualDistribution.awayWinPct,
                      },
                    ].map(({ label, predicted, actual }) => {
                      const diff = predicted - actual;
                      const isOver = diff > 0.02;
                      const isUnder = diff < -0.02;
                      return (
                        <div
                          key={label}
                          className="flex items-center gap-3 text-[12px]"
                        >
                          <span className="w-[72px] font-medium text-[#666]">
                            {label}
                          </span>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-[#1552f0] font-semibold w-[44px] text-right">
                              {formatPct(predicted)}
                            </span>
                            <div className="flex-1 h-1.5 bg-[#f0f0f0] rounded-full relative">
                              <div
                                className="absolute top-0 left-0 h-full rounded-full bg-[#1552f0] opacity-30"
                                style={{
                                  width: `${predicted * 100}%`,
                                }}
                              />
                              <div
                                className="absolute top-0 left-0 h-full rounded-full bg-[#00c853]"
                                style={{
                                  width: `${actual * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[#00c853] font-semibold w-[44px]">
                              {formatPct(actual)}
                            </span>
                          </div>
                          {(isOver || isUnder) && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isOver
                                  ? "text-[#ff3d57] bg-[#ff3d57]/8"
                                  : "text-[#ff9100] bg-[#ff9100]/8"
                              }`}
                            >
                              {isOver ? "Over" : "Under"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-[#bbb]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1552f0] opacity-30" />
                      Predicted
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00c853]" />
                      Actual
                    </span>
                  </div>
                </div>

                {/* Bias Insights */}
                {feedback.biasInsights.length > 0 && (
                  <div>
                    <h3 className="text-[12px] font-bold text-[#1a1a2e] mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#ff9100]" />
                      AI Bias Insights
                    </h3>
                    <div className="space-y-1.5">
                      {feedback.biasInsights.slice(0, 4).map((insight, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-[#666] leading-relaxed px-3 py-2 bg-[#fff8f0] border border-[#ffecd6] rounded-[8px]"
                        >
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-[12px] text-[#999]">
                  Not enough data yet for calibration analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* League Breakdown */}
        {feedback && Object.keys(feedback.leagueBreakdown).length > 0 && (
          <div className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-6">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                League Breakdown
              </h2>
              <p className="text-[11px] text-[#999] mt-0.5">
                Accuracy by competition
              </p>
            </div>

            <div className="h-px bg-[#f0f0f0]" />

            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-[10px] font-semibold text-[#999] uppercase tracking-[0.05em]">
                    <th className="text-left px-5 py-3">League</th>
                    <th className="text-center px-3 py-3 w-20">Predictions</th>
                    <th className="text-center px-3 py-3 w-16">Correct</th>
                    <th className="text-center px-3 py-3 w-20">Accuracy</th>
                    <th className="px-5 py-3 w-32"></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(feedback.leagueBreakdown)
                    .sort(([, a], [, b]) => b.total - a.total)
                    .map(([league, stats]) => (
                      <tr
                        key={league}
                        className="border-t border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-[#1a1a2e]">
                          {league}
                        </td>
                        <td className="text-center px-3 py-3 text-[#666]">
                          {stats.total}
                        </td>
                        <td className="text-center px-3 py-3 text-[#666]">
                          {stats.correct}
                        </td>
                        <td className="text-center px-3 py-3">
                          <span
                            className="font-bold"
                            style={{
                              color:
                                stats.accuracy >= 0.6
                                  ? "#00c853"
                                  : stats.accuracy >= 0.45
                                    ? "#ff9100"
                                    : "#ff3d57",
                            }}
                          >
                            {formatPct(stats.accuracy)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${stats.accuracy * 100}%`,
                                backgroundColor:
                                  stats.accuracy >= 0.6
                                    ? "#00c853"
                                    : stats.accuracy >= 0.45
                                      ? "#ff9100"
                                      : "#ff3d57",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Result Type Accuracy */}
        {feedback && (
          <div className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-6">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-[14px] font-bold text-[#1a1a2e]">
                Accuracy by Predicted Result
              </h2>
            </div>

            <div className="h-px bg-[#f0f0f0]" />

            <div className="grid grid-cols-3 gap-px bg-[#f0f0f0]">
              {(
                [
                  { key: "home_win", label: "Home Win", color: "#1552f0" },
                  { key: "draw", label: "Draw", color: "#ff9100" },
                  { key: "away_win", label: "Away Win", color: "#7c3aed" },
                ] as const
              ).map(({ key, label, color }) => {
                const r = feedback.byResult[key];
                return (
                  <div key={key} className="bg-white p-4 text-center">
                    <div
                      className="text-[10px] font-bold uppercase tracking-[0.05em] mb-2"
                      style={{ color }}
                    >
                      {label}
                    </div>
                    <div className="text-[24px] font-bold text-[#1a1a2e]">
                      {formatPct(r.accuracy)}
                    </div>
                    <div className="text-[10px] text-[#999] mt-0.5">
                      {r.correct}/{r.predicted} correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}

// ─── Daily prediction row ────────────────────────────────────────────

function DailyPredictionRow({
  prediction: p,
}: {
  prediction: ApiDailyBreakdownPrediction;
}) {
  const resultColor = getResultColor(p.predicted.result);

  return (
    <Link
      href={`/prediction/${p.fixtureId}`}
      className="flex items-center gap-3 px-5 py-3 hover:bg-[#fafafa] transition-colors border-t border-[#f5f5f5] first:border-t-0"
    >
      {/* Result indicator */}
      <div className="shrink-0">
        {p.wasCorrect === true ? (
          <CheckCircle2 className="w-5 h-5 text-[#00c853]" />
        ) : p.wasCorrect === false ? (
          <XCircle className="w-5 h-5 text-[#ff3d57]" />
        ) : (
          <Clock className="w-4 h-4 text-[#ff9100]" />
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {p.homeTeam.logo && (
            <img
              src={p.homeTeam.logo}
              alt=""
              className="w-4 h-4 object-contain"
            />
          )}
          <span className="text-[12px] font-semibold text-[#1a1a2e] truncate">
            {p.homeTeam.name}
          </span>
          <span className="text-[11px] text-[#ccc] font-medium">vs</span>
          {p.awayTeam.logo && (
            <img
              src={p.awayTeam.logo}
              alt=""
              className="w-4 h-4 object-contain"
            />
          )}
          <span className="text-[12px] font-semibold text-[#1a1a2e] truncate">
            {p.awayTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              color: resultColor,
              backgroundColor: resultColor + "14",
            }}
          >
            {getResultLabel(p.predicted.result)}
          </span>
          {p.actual.result && (
            <>
              <span className="text-[10px] text-[#ccc]">→</span>
              <span className="text-[10px] font-medium text-[#999]">
                Actual: {getResultLabel(p.actual.result)}
              </span>
            </>
          )}
          {p.actual.homeGoals != null && p.actual.awayGoals != null && (
            <span className="text-[10px] font-bold text-[#1a1a2e]">
              {p.actual.homeGoals}-{p.actual.awayGoals}
            </span>
          )}
        </div>
      </div>

      {/* Confidence */}
      {p.predicted.confidence != null && (
        <div className="text-right shrink-0">
          <div className="text-[12px] font-bold text-[#1a1a2e]">
            {p.predicted.confidence}/10
          </div>
          <div className="text-[9px] text-[#bbb]">conf</div>
        </div>
      )}
    </Link>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────

function StatsPageSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-5">
      <div className="skeleton h-4 w-32 rounded mb-5" />
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton w-10 h-10 rounded-[10px]" />
        <div>
          <div className="skeleton h-6 w-48 rounded mb-1" />
          <div className="skeleton h-3 w-64 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
          >
            <div className="skeleton h-3 w-16 rounded mb-3" />
            <div className="skeleton h-7 w-20 rounded mb-1" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#f0f0f0] rounded-[12px] h-[400px]" />
        <div className="bg-white border border-[#f0f0f0] rounded-[12px] h-[400px]" />
      </div>
    </main>
  );
}
