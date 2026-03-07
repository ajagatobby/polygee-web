"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Prediction } from "@/types";

interface OrderPanelProps {
  prediction: Prediction | null;
}

export function OrderPanel({ prediction }: OrderPanelProps) {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");

  if (!prediction) {
    return (
      <div className="w-[280px] shrink-0 border-l border-[#f0f0f0] bg-white p-5 hidden xl:flex flex-col items-center justify-center text-center">
        <div className="text-[32px] mb-3">&#9917;</div>
        <p className="text-[13px] text-[#999] leading-relaxed">
          Select a match to<br />place a prediction
        </p>
      </div>
    );
  }

  const yesPrice = prediction.moneyline.home;
  const noPrice = 100 - yesPrice;

  return (
    <div className="w-[280px] shrink-0 border-l border-[#f0f0f0] bg-white hidden xl:block">
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

        {/* Buy / Sell tabs */}
        <div className="flex gap-0 mb-4">
          <button
            onClick={() => setTab("buy")}
            className={`
              flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer
              ${tab === "buy"
                ? "text-[#1a1a2e] border-[#1a1a2e]"
                : "text-[#999] border-transparent hover:text-[#666]"
              }
            `}
          >
            Buy
          </button>
          <button
            onClick={() => setTab("sell")}
            className={`
              flex-1 py-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer
              ${tab === "sell"
                ? "text-[#1a1a2e] border-[#1a1a2e]"
                : "text-[#999] border-transparent hover:text-[#666]"
              }
            `}
          >
            Sell
          </button>
          <div className="flex items-center gap-1 pl-3 text-[13px] text-[#666] font-medium cursor-pointer">
            Market
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Yes / No buttons */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setSelectedOutcome("yes")}
            className={`
              flex-1 h-[44px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
              ${selectedOutcome === "yes"
                ? "bg-[#0066FF] text-white"
                : "bg-[#f0f0f0] text-[#666] hover:bg-[#e8e8e8]"
              }
            `}
          >
            Yes {yesPrice}&#162;
          </button>
          <button
            onClick={() => setSelectedOutcome("no")}
            className={`
              flex-1 h-[44px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
              ${selectedOutcome === "no"
                ? "bg-[#333] text-white"
                : "bg-[#f0f0f0] text-[#666] hover:bg-[#e8e8e8]"
              }
            `}
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
              className="w-full h-[52px] pl-10 pr-4 text-[24px] font-bold text-[#1a1a2e] text-right bg-white border border-[#e8e8e8] rounded-[10px] focus:outline-none focus:border-[#ccc] placeholder:text-[#e0e0e0] transition-colors"
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

        {/* Buy button */}
        <button
          className={`
            w-full h-[46px] rounded-[10px] text-[14px] font-bold transition-all cursor-pointer
            ${selectedOutcome === "yes"
              ? "bg-[#0066FF] text-white hover:bg-[#0052cc]"
              : "bg-[#333] text-white hover:bg-[#222]"
            }
          `}
        >
          {tab === "buy" ? "Buy" : "Sell"} {selectedOutcome === "yes" ? "Yes" : "No"}
        </button>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#bbb] text-center mt-3 leading-relaxed">
          By trading, you agree to the{" "}
          <span className="text-[#0066FF] cursor-pointer hover:underline">Terms of Use</span>.
        </p>
      </div>
    </div>
  );
}
