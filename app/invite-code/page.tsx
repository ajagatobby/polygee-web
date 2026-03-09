"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, ArrowLeft, CheckCircle2 } from "lucide-react";
import { easing, duration } from "@/lib/animations";

const CODE_LENGTH = 6;

// Mock valid invite codes — replace with real validation
const VALID_CODES = ["POLY01", "BETA22", "EARLY1", "VIP123", "LAUNCH"];

export default function InviteCodePage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const code = digits.join("").toUpperCase();
  const isFilled = digits.every((d) => d.length > 0);

  const handleChange = (index: number, value: string) => {
    // Only allow single alphanumeric characters
    const char = value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    if (!char && value !== "") return;

    setError("");
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    // Auto-advance to next input
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (digits[index] === "" && index > 0) {
        // Move back and clear previous
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      }
      setError("");
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    if (pasted.length === 0) return;

    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    setError("");

    // Focus last filled or last input
    const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    if (!isFilled || isVerifying) return;

    setIsVerifying(true);
    setError("");

    // Simulate API check
    await new Promise((r) => setTimeout(r, 1200));

    if (VALID_CODES.includes(code)) {
      setIsVerified(true);
      // Brief pause to show success, then authenticate and navigate
      await new Promise((r) => setTimeout(r, 1000));
      // Invite code verified — redirect to home
      router.push("/");
    } else {
      setError("Invalid invite code. Please check and try again.");
      setIsVerifying(false);
      // Shake the inputs — clear and refocus first
      setDigits(Array(CODE_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 relative overflow-hidden bg-[#1552f0]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easing.easeOut }}
          >
            <Link href="/" className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[22px] font-bold text-white tracking-[-0.02em]">
                Polygee
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.slow,
              ease: easing.easeOut,
              delay: 0.15,
            }}
          >
            <h2 className="text-[32px] font-bold text-white leading-[1.2] tracking-[-0.03em]">
              You&apos;re almost in.
            </h2>
            <p className="text-[15px] text-white/60 mt-4 leading-relaxed max-w-[360px]">
              Polygee is currently invite-only. Enter the code you received to
              unlock your account and start trading.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: 0.3 }}
          >
            <div className="space-y-3">
              {[
                "Exclusive early access to AI predictions",
                "Priority support and feature requests",
                "No invite code? Request one below",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: duration.medium,
                    ease: easing.easeOut,
                    delay: 0.4 + i * 0.08,
                  }}
                >
                  <div className="w-[18px] h-[18px] rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/70">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right — invite code form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: duration.slow, ease: easing.easeOut }}
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#1a1a2e]"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              Polygee
            </span>
          </Link>

          {/* Back to sign up */}
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-[#666] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to sign up
          </Link>

          {/* Icon */}
          <motion.div
            className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] bg-[#1552f0]/8 mb-5"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.25,
              delay: 0.1,
            }}
          >
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-[#00c853]" />
                </motion.div>
              ) : (
                <motion.div
                  key="ticket"
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Ticket className="w-6 h-6 text-[#1552f0]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.normal, ease: easing.easeOut }}
              >
                <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                  You&apos;re in!
                </h1>
                <p className="text-[14px] text-[#808080] mt-1.5">
                  Invite code verified. Redirecting you now...
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                  Enter invite code
                </h1>
                <p className="text-[14px] text-[#808080] mt-1.5">
                  Input the 6-character code you received to activate your
                  account
                </p>

                {/* Code inputs */}
                <div className="mt-8">
                  <div className="flex gap-2.5 justify-center">
                    {digits.map((digit, i) => (
                      <motion.input
                        key={i}
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        onFocus={() => setFocusedIndex(i)}
                        onBlur={() => setFocusedIndex(null)}
                        animate={
                          error
                            ? {
                                x: [0, -4, 4, -4, 4, 0],
                                transition: { duration: 0.4, delay: i * 0.02 },
                              }
                            : {}
                        }
                        className={`
                          w-[52px] h-[56px] text-center text-[20px] font-bold uppercase rounded-[12px] border outline-none transition-all
                          ${
                            error
                              ? "border-[#ff3b30] bg-red-50/40 text-[#ff3b30]"
                              : focusedIndex === i
                                ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white text-[#1a1a2e]"
                                : digit
                                  ? "border-[#ddd] bg-white text-[#1a1a2e]"
                                  : "border-[#e8e8e8] bg-[#fafafa] text-[#1a1a2e]"
                          }
                        `}
                      />
                    ))}
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{
                          duration: duration.fast,
                          ease: easing.easeOut,
                        }}
                        className="text-center text-[12px] text-[#ff3b30] mt-3"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!isFilled || isVerifying}
                  className={`w-full h-[44px] mt-6 text-[14px] font-bold text-white rounded-[10px] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isFilled && !isVerifying
                      ? "bg-[#1552f0] hover:bg-[#1247d6]"
                      : "bg-[#1552f0]/40 cursor-not-allowed"
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                {/* Request invite link */}
                <p className="text-center text-[13px] text-[#808080] mt-6">
                  Don&apos;t have an invite code?{" "}
                  <span className="font-medium text-[#1552f0] cursor-pointer hover:underline">
                    Request access
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
