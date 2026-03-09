"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  BarChart3,
  Brain,
  Share2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Loader2,
  Gavel,
  CalendarDays,
} from "lucide-react";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/layout/header";
import { PriceButton } from "@/components/ui/price-button";
import { useAuth } from "@/lib/auth-context";
import { useFixturePrediction } from "@/lib/hooks/use-fixtures";
import {
  probToPercent,
  formatFullDate,
  formatTime,
  isMatchLive,
  isMatchFinished,
  getStatusLabel,
  getAiPick,
  getTeamShortName,
  getLeagueLogo,
} from "@/lib/utils";
import { useTeamColor } from "@/lib/hooks/use-team-color";
import { duration, easing } from "@/lib/animations";

export default function PredictionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fixtureId = parseInt(id, 10);
  const { isAuthenticated, isPro, loading: authLoading } = useAuth();

  const { data: enriched, isLoading, error } = useFixturePrediction(
    fixtureId,
    !isNaN(fixtureId) && fixtureId > 0,
  );

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#1552f0] animate-spin mb-3" />
          <p className="text-[13px] text-[#999]">Loading...</p>
        </div>
      </div>
    );
  }

  // Gate: Non-pro users cannot view prediction details
  if (!isAuthenticated || !isPro) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-[#666] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Predictions
          </Link>

          <div className="p-8 bg-white border border-[#f0f0f0] rounded-[16px]">
            <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#e7edfe] mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-[#1552f0]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
              Upgrade to Pro
            </h1>
            <p className="text-[14px] text-[#808080] leading-relaxed max-w-[400px] mx-auto mb-6">
              Detailed AI predictions, value bets, key factors, and in-depth match analysis are available exclusively for Pro subscribers.
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
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#1552f0] animate-spin mb-3" />
          <p className="text-[13px] text-[#999]">Loading match details...</p>
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !enriched) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-[20px] font-bold text-[#1a1a2e] mb-2">
            Match Not Found
          </h1>
          <p className="text-[13px] text-[#999] mb-6">
            The match you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1552f0] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  const { fixture, homeTeam, awayTeam, prediction } = enriched;
  const isLive = isMatchLive(fixture.status);
  const isFinished = isMatchFinished(fixture.status);

  // Team colors: prefer API kit > logo extraction > static map > default
  const homeColor = useTeamColor(homeTeam.id, homeTeam.logo, homeTeam.teamColors?.player?.primary);
  const awayColor = useTeamColor(awayTeam.id, awayTeam.logo, awayTeam.teamColors?.player?.primary);

  // Short names (3-letter code or last word)
  const homeShort = getTeamShortName(homeTeam.shortName, homeTeam.name);
  const awayShort = getTeamShortName(awayTeam.shortName, awayTeam.name);

  // Probabilities
  const homeProb = probToPercent(prediction?.homeWinProb);
  const drawProb = probToPercent(prediction?.drawProb);
  const awayProb = probToPercent(prediction?.awayWinProb);

  // AI pick
  const aiPick = prediction
    ? getAiPick(prediction.homeWinProb, prediction.drawProb, prediction.awayWinProb)
    : null;

  // Confidence: 1-10 scale -> percentage for the ring
  const confidence = prediction?.confidence ?? 0;
  const confidencePercent = confidence * 10;

  // League logo
  const leagueLogo = getLeagueLogo(fixture.leagueId);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-5">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-[#666] transition-colors mb-5 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to {fixture.leagueName || "Predictions"}
        </Link>

        {/* Match header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img src={leagueLogo} alt={fixture.leagueName || ""} className="w-5 h-5 object-contain" />
            <span className="text-[13px] text-[#999] font-medium">
              {fixture.leagueName}
            </span>
            {fixture.round && (
              <span className="text-[11px] text-[#bbb] font-medium px-1.5 py-0.5 bg-[#f5f5f5] rounded">
                {fixture.round}
              </span>
            )}
            {isLive && (
              <span className="flex items-center gap-1.5 ml-2">
                <span className="w-[6px] h-[6px] rounded-full bg-[#ff3b30] animate-pulse" />
                <span className="text-[12px] font-bold text-[#ff3b30]">
                  {getStatusLabel(fixture.status, fixture.elapsed)}
                </span>
              </span>
            )}
            {isFinished && (
              <span className="text-[12px] font-bold text-[#999] ml-2">
                {getStatusLabel(fixture.status, fixture.elapsed)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              {homeTeam.name || "Home"} vs {awayTeam.name || "Away"}
            </h1>
            <button className="p-2 text-[#999] hover:text-[#666] transition-colors cursor-pointer">
              <Share2 className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Teams display */}
          <div className="flex items-center gap-8 py-5 px-6 bg-white rounded-[12px] border border-[#f0f0f0]">
            <div className="flex items-center gap-3 flex-1">
              {homeTeam.logo ? (
                <img src={homeTeam.logo} alt={homeTeam.name || ""} className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#e8e8e8]" />
              )}
              <div>
                <div className="text-[16px] font-bold text-[#1a1a2e]">
                  {homeTeam.name || "Home"}
                </div>
                <div className="text-[12px] text-[#999]">
                  Home
                </div>
              </div>
            </div>

            <div className="text-center px-4">
              {isLive || isFinished ? (
                <div className="text-[28px] font-bold text-[#1a1a2e]">
                  {fixture.goalsHome ?? 0} - {fixture.goalsAway ?? 0}
                </div>
              ) : (
                <div className="text-[20px] font-bold text-[#ccc]">VS</div>
              )}
              <div className="text-[12px] text-[#999] mt-0.5">
                {formatTime(fixture.date)}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                <div className="text-[16px] font-bold text-[#1a1a2e]">
                  {awayTeam.name || "Away"}
                </div>
                <div className="text-[12px] text-[#999]">
                  Away
                </div>
              </div>
              {awayTeam.logo ? (
                <img src={awayTeam.logo} alt={awayTeam.name || ""} className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#e8e8e8]" />
              )}
            </div>
          </div>
        </div>

        {/* Prediction Markets — Match Result probabilities */}
        {prediction && (
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-[#1a1a2e] mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#999]" />
              AI Prediction
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Match Result */}
              <motion.div
                className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ duration: duration.fast, ease: easing.ease }}
              >
                <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                  Match Result
                </div>
                <div className="space-y-2">
                  <PriceButton
                    label={homeShort}
                    price={homeProb}
                    color="custom"
                    customColor={homeColor}
                    size="md"
                  />
                  <PriceButton
                    label="DRAW"
                    price={drawProb}
                    color="gray"
                    size="md"
                    dimmed
                  />
                  <PriceButton
                    label={awayShort}
                    price={awayProb}
                    color="custom"
                    customColor={awayColor}
                    size="md"
                    dimmed
                  />
                </div>
              </motion.div>

              {/* Predicted Score */}
              {(prediction.predictedHomeGoals != null || prediction.predictedAwayGoals != null) && (
                <motion.div
                  className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  transition={{ duration: duration.fast, ease: easing.ease }}
                >
                  <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                    Predicted Score
                  </div>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                      {homeTeam.logo ? (
                        <img src={homeTeam.logo} alt={homeTeam.name || ""} className="w-8 h-8 object-contain mx-auto mb-2" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#e8e8e8] mx-auto mb-2" />
                      )}
                      <div className="text-[28px] font-bold text-[#1a1a2e]">
                        {prediction.predictedHomeGoals ?? "-"}
                      </div>
                      <div className="text-[11px] text-[#999] font-medium">{homeShort}</div>
                    </div>
                    <div className="text-[20px] font-bold text-[#ccc]">-</div>
                    <div className="text-center">
                      {awayTeam.logo ? (
                        <img src={awayTeam.logo} alt={awayTeam.name || ""} className="w-8 h-8 object-contain mx-auto mb-2" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#e8e8e8] mx-auto mb-2" />
                      )}
                      <div className="text-[28px] font-bold text-[#1a1a2e]">
                        {prediction.predictedAwayGoals ?? "-"}
                      </div>
                      <div className="text-[11px] text-[#999] font-medium">{awayShort}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Value Bets */}
              {prediction.valueBets && prediction.valueBets.length > 0 && (
                <motion.div
                  className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  transition={{ duration: duration.fast, ease: easing.ease }}
                >
                  <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                    Value Bets
                  </div>
                  <div className="space-y-2.5">
                    {prediction.valueBets.map((vb, i) => (
                      <div key={i} className="flex items-center justify-between text-[12px]">
                        <div>
                          <span className="font-semibold text-[#1a1a2e]">{vb.outcome}</span>
                          {vb.bookmaker && (
                            <span className="text-[#bbb] ml-1.5">({vb.bookmaker})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {vb.bookmakerOdds != null && (
                            <span className="text-[#999]">
                              {Number(vb.bookmakerOdds).toFixed(2)}
                            </span>
                          )}
                          {vb.edge != null && (
                            <span className={`font-bold ${vb.edge > 0 ? "text-[#00c853]" : "text-[#ff3d57]"}`}>
                              {vb.edge > 0 ? "+" : ""}{(Number(vb.edge) * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* AI Confidence + Match Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* AI Confidence */}
          {prediction && (
            <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-[#1552f0]" />
                <h3 className="text-[14px] font-bold text-[#1a1a2e]">AI Confidence</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-[80px] h-[80px] -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={confidencePercent >= 70 ? "#00c853" : confidencePercent >= 50 ? "#ff9100" : "#ff3d57"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      initial={false}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - confidencePercent / 100) }}
                      transition={{ duration: 0.8, ease: easing.easeOut, delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[18px] font-bold text-[#1a1a2e]">{confidence}/10</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#1a1a2e] mb-1">
                    {aiPick
                      ? `AI Pick: ${aiPick.team === "home" ? homeTeam.name : aiPick.team === "away" ? awayTeam.name : "Draw"}`
                      : "No prediction"}
                  </div>
                  <p className="text-[12px] text-[#999] leading-relaxed">
                    {prediction.predictionType === "pre_match"
                      ? "Pre-match analysis based on team form, head-to-head, and current standings."
                      : prediction.predictionType === "daily"
                        ? "Daily prediction with latest team news and lineup data."
                        : "On-demand analysis for this fixture."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Match Info */}
          <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
            <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-4">Match Info</h3>
            <div className="space-y-3">
              {fixture.venueName && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Venue</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {fixture.venueName}
                      {fixture.venueCity ? `, ${fixture.venueCity}` : ""}
                    </span>
                  </div>
                  <div className="h-px bg-[#f0f0f0]" />
                </>
              )}
              {fixture.referee && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <Gavel className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Referee</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {fixture.referee}
                    </span>
                  </div>
                  <div className="h-px bg-[#f0f0f0]" />
                </>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#999]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-medium">Date</span>
                </div>
                <span className="text-[13px] font-bold text-[#1a1a2e]">
                  {formatFullDate(fixture.date)}
                </span>
              </div>
              {fixture.round && (
                <>
                  <div className="h-px bg-[#f0f0f0]" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Round</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {fixture.round}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Key Factors & Risk Factors */}
        {prediction && (prediction.keyFactors?.length || prediction.riskFactors?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Key Factors */}
            {prediction.keyFactors && prediction.keyFactors.length > 0 && (
              <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-[#00c853]" />
                  <h3 className="text-[14px] font-bold text-[#1a1a2e]">Key Factors</h3>
                </div>
                <ul className="space-y-2">
                  {prediction.keyFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-[#666] leading-relaxed">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00c853] shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {prediction.riskFactors && prediction.riskFactors.length > 0 && (
              <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-[#ff9100]" />
                  <h3 className="text-[14px] font-bold text-[#1a1a2e]">Risk Factors</h3>
                </div>
                <ul className="space-y-2">
                  {prediction.riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-[#666] leading-relaxed">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#ff9100] shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed Analysis */}
        {prediction?.detailedAnalysis && (
          <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[#1552f0]" />
              <h3 className="text-[14px] font-bold text-[#1a1a2e]">Detailed Analysis</h3>
            </div>
            <div className="prose prose-sm max-w-none text-[#666] prose-headings:text-[#1a1a2e] prose-headings:font-bold prose-headings:tracking-[-0.01em] prose-h2:text-[14px] prose-h2:mt-4 prose-h2:mb-2 prose-h3:text-[13px] prose-h3:mt-3 prose-h3:mb-1.5 prose-p:text-[13px] prose-p:leading-relaxed prose-p:my-1.5 prose-strong:text-[#1a1a2e] prose-strong:font-semibold prose-ul:my-1.5 prose-ul:text-[13px] prose-ol:my-1.5 prose-ol:text-[13px] prose-li:my-0.5 prose-li:leading-relaxed prose-hr:my-3 prose-hr:border-[#f0f0f0] prose-table:text-[12px] prose-th:text-[#1a1a2e] prose-th:font-semibold prose-td:py-1.5">
              <Markdown remarkPlugins={[remarkGfm]}>
                {prediction.detailedAnalysis}
              </Markdown>
            </div>
          </div>
        )}

        {/* No prediction fallback */}
        {!prediction && (
          <div className="p-8 bg-white border border-[#f0f0f0] rounded-[12px] mb-6 text-center">
            <Brain className="w-8 h-8 text-[#ccc] mx-auto mb-3" />
            <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
              No AI Prediction Available
            </h3>
            <p className="text-[13px] text-[#999]">
              Our AI hasn&apos;t generated a prediction for this match yet. Check back closer to kick-off.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
