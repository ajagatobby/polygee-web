"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  BarChart3,
  Brain,
  Share2,
  ChevronDown,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { PriceButton } from "@/components/ui/price-button";
import { getPredictionById, formatVolume, formatFullDate } from "@/lib/mock-data";

export default function PredictionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const prediction = getPredictionById(id);
  const [orderTab, setOrderTab] = useState<"buy" | "sell">("buy");
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");

  if (!prediction) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-[20px] font-bold text-[#1a1a2e] mb-2">
            Prediction Not Found
          </h1>
          <p className="text-[13px] text-[#999] mb-6">
            The prediction you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0066FF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const yesPrice = prediction.moneyline.home;
  const noPrice = 100 - yesPrice;

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-5">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-[#666] transition-colors mb-5 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to {prediction.league.name}
            </Link>

            {/* Match header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px]">{prediction.league.logo}</span>
                <span className="text-[13px] text-[#999] font-medium">
                  {prediction.league.name}
                </span>
                {prediction.status === "live" && (
                  <span className="flex items-center gap-1.5 ml-2">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#ff3b30] animate-pulse-soft" />
                    <span className="text-[12px] font-bold text-[#ff3b30]">LIVE</span>
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-4">
                {prediction.homeTeam.name} vs {prediction.awayTeam.name}
              </h1>

              {/* Teams display */}
              <div className="flex items-center gap-8 py-5 px-6 bg-[#fafafa] rounded-[12px] border border-[#f0f0f0]">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-[32px]">{prediction.homeTeam.logo}</span>
                  <div>
                    <div className="text-[16px] font-bold text-[#1a1a2e]">
                      {prediction.homeTeam.name}
                    </div>
                    <div className="text-[12px] text-[#999]">
                      {prediction.homeTeam.record} &middot; Home
                    </div>
                  </div>
                </div>

                <div className="text-center px-4">
                  {prediction.status === "live" ? (
                    <div className="text-[28px] font-bold text-[#1a1a2e]">
                      {prediction.homeScore} - {prediction.awayScore}
                    </div>
                  ) : (
                    <div className="text-[20px] font-bold text-[#ccc]">VS</div>
                  )}
                  <div className="text-[12px] text-[#999] mt-0.5">{prediction.matchTime}</div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="text-right">
                    <div className="text-[16px] font-bold text-[#1a1a2e]">
                      {prediction.awayTeam.name}
                    </div>
                    <div className="text-[12px] text-[#999]">
                      {prediction.awayTeam.record} &middot; Away
                    </div>
                  </div>
                  <span className="text-[32px]">{prediction.awayTeam.logo}</span>
                </div>
              </div>
            </div>

            {/* Market cards */}
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-[#1a1a2e] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#999]" />
                Markets
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {/* Moneyline */}
                <div className="p-4 border border-[#f0f0f0] rounded-[12px]">
                  <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                    Moneyline
                  </div>
                  <div className="space-y-2">
                    <PriceButton
                      label={prediction.homeTeam.shortName}
                      price={prediction.moneyline.home}
                      color={prediction.homeTeam.color}
                      className="w-full"
                    />
                    <PriceButton
                      label="DRAW"
                      price={prediction.moneyline.draw}
                      color="#808080"
                      variant="outline"
                      className="w-full"
                    />
                    <PriceButton
                      label={prediction.awayTeam.shortName}
                      price={prediction.moneyline.away}
                      color={prediction.awayTeam.color}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Spread */}
                <div className="p-4 border border-[#f0f0f0] rounded-[12px]">
                  <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                    Spread
                  </div>
                  <div className="space-y-2">
                    <PriceButton
                      label={prediction.spread.homeLabel}
                      price={prediction.spread.homePrice}
                      variant="outline"
                      className="w-full"
                    />
                    <PriceButton
                      label={prediction.spread.awayLabel}
                      price={prediction.spread.awayPrice}
                      variant="outline"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 border border-[#f0f0f0] rounded-[12px]">
                  <div className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-3">
                    Total
                  </div>
                  <div className="space-y-2">
                    <PriceButton
                      label={prediction.total.overLabel}
                      price={prediction.total.overPrice}
                      variant="outline"
                      className="w-full"
                    />
                    <PriceButton
                      label={prediction.total.underLabel}
                      price={prediction.total.underPrice}
                      variant="outline"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Confidence + Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* AI Confidence */}
              <div className="p-5 border border-[#f0f0f0] rounded-[12px]">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-[#0066FF]" />
                  <h3 className="text-[14px] font-bold text-[#1a1a2e]">AI Confidence</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-[80px] h-[80px] -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke={prediction.aiConfidence >= 70 ? "#00c853" : prediction.aiConfidence >= 50 ? "#ff9100" : "#ff3d57"}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - prediction.aiConfidence / 100)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[18px] font-bold text-[#1a1a2e]">{prediction.aiConfidence}%</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#999] leading-relaxed flex-1">
                    Based on historical data, team form, head-to-head records, and current standings.
                  </p>
                </div>
              </div>

              {/* Market Stats */}
              <div className="p-5 border border-[#f0f0f0] rounded-[12px]">
                <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-4">Market Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Volume</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {formatVolume(prediction.totalVolume)}
                    </span>
                  </div>
                  <div className="h-px bg-[#f0f0f0]" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Participants</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {prediction.participantsCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-[#f0f0f0]" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Venue</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {prediction.venue}
                    </span>
                  </div>
                  <div className="h-px bg-[#f0f0f0]" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#999]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium">Date</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#1a1a2e]">
                      {formatFullDate(prediction.matchDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 border border-[#f0f0f0] rounded-[12px] mb-6">
              <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2">About</h3>
              <p className="text-[13px] text-[#666] leading-relaxed">
                {prediction.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                {prediction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#666] bg-[#f5f5f5] rounded-[6px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Order Panel */}
        <div className="w-[280px] shrink-0 border-l border-[#f0f0f0] bg-white hidden xl:block overflow-y-auto">
          <div className="p-5">
            {/* Match info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[36px] h-[36px] rounded-[8px] bg-[#f5f5f5] flex items-center justify-center text-[18px]">
                {prediction.homeTeam.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[#1a1a2e] truncate">
                  {prediction.homeTeam.shortName} vs {prediction.awayTeam.shortName}
                </div>
                <div className="text-[12px] font-semibold" style={{ color: prediction.homeTeam.color }}>
                  {prediction.homeTeam.shortName}
                </div>
              </div>
            </div>

            {/* Buy / Sell */}
            <div className="flex gap-0 mb-4">
              <button
                onClick={() => setOrderTab("buy")}
                className={`flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer
                  ${orderTab === "buy" ? "text-[#1a1a2e] border-[#1a1a2e]" : "text-[#999] border-transparent hover:text-[#666]"}`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderTab("sell")}
                className={`flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer
                  ${orderTab === "sell" ? "text-[#1a1a2e] border-[#1a1a2e]" : "text-[#999] border-transparent hover:text-[#666]"}`}
              >
                Sell
              </button>
              <div className="flex items-center gap-1 pl-3 text-[13px] text-[#666] font-medium cursor-pointer">
                Market
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Yes / No */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setSelectedOutcome("yes")}
                className={`flex-1 h-[44px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
                  ${selectedOutcome === "yes" ? "bg-[#0066FF] text-white" : "bg-[#f0f0f0] text-[#666] hover:bg-[#e8e8e8]"}`}
              >
                Yes {yesPrice}&#162;
              </button>
              <button
                onClick={() => setSelectedOutcome("no")}
                className={`flex-1 h-[44px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
                  ${selectedOutcome === "no" ? "bg-[#333] text-white" : "bg-[#f0f0f0] text-[#666] hover:bg-[#e8e8e8]"}`}
              >
                No {noPrice}&#162;
              </button>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-[#1a1a2e]">Amount</span>
                <span className="text-[12px] text-[#999]">Balance $58.64</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[24px] font-bold text-[#ccc]">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-[52px] pl-10 pr-4 text-[24px] font-bold text-[#1a1a2e] text-right bg-white border border-[#e8e8e8] rounded-[10px] focus:outline-none focus:border-[#ccc] placeholder:text-[#e0e0e0]"
                />
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-1.5 mb-5">
              {["+$1", "+$5", "+$10", "+$100", "Max"].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    if (val === "Max") setAmount("58.64");
                    else setAmount((prev) => String((parseFloat(prev) || 0) + parseFloat(val.replace("+$", ""))));
                  }}
                  className="flex-1 h-[32px] text-[12px] font-medium text-[#666] bg-[#f5f5f5] rounded-[6px] hover:bg-[#eee] transition-colors cursor-pointer"
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Action button */}
            <button
              className={`w-full h-[46px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
                ${selectedOutcome === "yes" ? "bg-[#0066FF] text-white hover:bg-[#0052cc]" : "bg-[#333] text-white hover:bg-[#222]"}`}
            >
              {orderTab === "buy" ? "Buy" : "Sell"} {selectedOutcome === "yes" ? "Yes" : "No"}
            </button>

            <p className="text-[11px] text-[#bbb] text-center mt-3 leading-relaxed">
              By trading, you agree to the{" "}
              <span className="text-[#0066FF] cursor-pointer hover:underline">Terms of Use</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
