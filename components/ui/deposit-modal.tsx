"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, DollarSign, Info, AlertCircle } from "lucide-react";
import { easing, duration } from "@/lib/animations";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

// Mock balance — replace with real Polymarket balance fetch
const POLYMARKET_BALANCE = 100;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.medium,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    filter: "blur(4px)",
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

const presetAmounts = [10, 25, 50, 100];

export function DepositModal({ open, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [focused, setFocused] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const exceedsBalance = numericAmount > POLYMARKET_BALANCE;
  const isValid = numericAmount > 0 && !exceedsBalance;

  const handleAmountChange = (value: string) => {
    // Only allow numbers and a single decimal point
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  const handlePreset = (value: number) => {
    if (value > POLYMARKET_BALANCE) return;
    setAmount(value.toString());
  };

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: handle deposit
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[420px] mx-4 bg-white rounded-[16px] shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                  Set Trading Budget
                </h2>
                <p className="text-[13px] text-[#808080] mt-0.5">
                  Allocate funds for the bot to trade with
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-[30px] h-[30px] rounded-[8px] text-[#999] hover:text-[#1a1a2e] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-[#f0f0f0] mx-6" />

            <div className="px-6 py-5">
              {/* Balance display */}
              <div className="flex items-center justify-between mb-4 px-3.5 py-2.5 bg-[#f7f8fa] rounded-[10px]">
                <span className="text-[12px] font-medium text-[#808080]">
                  Polymarket Balance
                </span>
                <span className="text-[14px] font-bold text-[#1a1a2e]">
                  ${POLYMARKET_BALANCE.toFixed(2)}
                </span>
              </div>

              {/* Amount input */}
              <label className="block text-[12px] font-medium text-[#666] mb-1.5">
                Amount
              </label>
              <div
                className={`
                  flex items-center gap-2 h-[48px] px-3.5 rounded-[10px] border transition-all
                  ${
                    exceedsBalance
                      ? "border-[#ff3b30] ring-1 ring-[#ff3b30]/20 bg-red-50/30"
                      : focused
                        ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white"
                        : "border-[#e8e8e8] bg-[#fafafa] hover:border-[#ddd]"
                  }
                `}
              >
                <DollarSign
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    exceedsBalance
                      ? "text-[#ff3b30]"
                      : focused
                        ? "text-[#1552f0]"
                        : "text-[#bbb]"
                  }`}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="flex-1 text-[16px] font-semibold text-[#1a1a2e] placeholder:text-[#ccc] bg-transparent outline-none"
                />
                {amount && (
                  <button
                    onClick={() => handlePreset(POLYMARKET_BALANCE)}
                    className="shrink-0 text-[11px] font-bold text-[#1552f0] hover:text-[#1247d6] transition-colors cursor-pointer"
                  >
                    MAX
                  </button>
                )}
              </div>

              {/* Error message */}
              {exceedsBalance && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#ff3b30] shrink-0" />
                  <p className="text-[12px] text-[#ff3b30]">
                    Exceeds your Polymarket balance. Please add funds to
                    Polymarket first.
                  </p>
                </div>
              )}

              {/* Quick amount presets */}
              <div className="flex gap-2 mt-3.5">
                {presetAmounts.map((preset) => {
                  const disabled = preset > POLYMARKET_BALANCE;
                  return (
                    <button
                      key={preset}
                      onClick={() => handlePreset(preset)}
                      disabled={disabled}
                      className={`
                        flex-1 h-[34px] text-[13px] font-medium rounded-[8px] transition-colors cursor-pointer
                        ${
                          numericAmount === preset
                            ? "bg-[#1552f0] text-white"
                            : disabled
                              ? "bg-[#f5f5f5] text-[#ccc] cursor-not-allowed"
                              : "bg-[#f5f5f5] text-[#1a1a2e] hover:bg-[#ebebeb]"
                        }
                      `}
                    >
                      ${preset}
                    </button>
                  );
                })}
              </div>

              {/* Info note */}
              <div className="flex gap-2.5 mt-4 p-3 bg-[#f7f8fa] rounded-[10px]">
                <Info className="w-4 h-4 text-[#1552f0] shrink-0 mt-0.5" />
                <div className="text-[12px] leading-[1.5] text-[#666]">
                  <p>
                    This sets the maximum amount the bot can use per trade. The
                    funds come directly from your Polymarket balance — make sure
                    you have enough deposited on{" "}
                    <a
                      href="https://polymarket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1552f0] font-medium hover:underline"
                    >
                      polymarket.com
                    </a>{" "}
                    before setting your budget here.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-1 flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 h-[40px] text-[13px] font-medium text-[#666] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`
                  flex-1 h-[40px] text-[13px] font-bold text-white rounded-[10px] transition-all cursor-pointer
                  ${
                    isValid
                      ? "bg-[#1552f0] hover:bg-[#1247d6]"
                      : "bg-[#1552f0]/40 cursor-not-allowed"
                  }
                `}
              >
                Set Budget
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
