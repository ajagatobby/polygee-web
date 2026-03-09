"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { easing, duration } from "@/lib/animations";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = email.trim().length > 0 && email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 relative overflow-hidden bg-[#1552f0]">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easing.easeOut }}
          >
            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[22px] font-bold text-white tracking-[-0.02em]">Polygee</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easing.easeOut, delay: 0.15 }}
          >
            <h2 className="text-[32px] font-bold text-white leading-[1.2] tracking-[-0.03em]">
              Don&apos;t worry, it happens to the best of us.
            </h2>
            <p className="text-[15px] text-white/60 mt-4 leading-relaxed max-w-[360px]">
              We&apos;ll send you a link to reset your password and get you back to trading in no time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: 0.3 }}
          >
            <p className="text-[13px] text-white/40">
              Tip: Use a password manager to avoid this next time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              className="w-full max-w-[400px]"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: duration.slow, ease: easing.easeOut }}
            >
              {/* Mobile logo */}
              <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1a1a2e]">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">Polygee</span>
              </Link>

              {/* Back link */}
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#808080] hover:text-[#1a1a2e] transition-colors mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>

              <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Reset your password
              </h1>
              <p className="text-[14px] text-[#808080] mt-1.5">
                Enter the email associated with your account and we&apos;ll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                {/* Email */}
                <div className="mb-6">
                  <label className="block text-[12px] font-medium text-[#666] mb-1.5">
                    Email address
                  </label>
                  <div
                    className={`flex items-center gap-2.5 h-[44px] px-3.5 rounded-[10px] border transition-all ${
                      focused
                        ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white"
                        : "border-[#e8e8e8] bg-[#fafafa] hover:border-[#ddd]"
                    }`}
                  >
                    <Mail className={`w-4 h-4 shrink-0 transition-colors ${focused ? "text-[#1552f0]" : "text-[#bbb]"}`} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="flex-1 text-[14px] text-[#1a1a2e] placeholder:text-[#bbb] bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-[12px] text-[#ff3b30] mb-4">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-full h-[44px] text-[14px] font-bold text-white rounded-[10px] transition-all cursor-pointer flex items-center justify-center ${
                    isValid && !isSubmitting
                      ? "bg-[#1552f0] hover:bg-[#1247d6]"
                      : "bg-[#1552f0]/40 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="w-full max-w-[400px] text-center"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: duration.slow, ease: easing.easeOut }}
            >
              {/* Success icon */}
              <motion.div
                className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#e8f9ef] mx-auto mb-5"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25, delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.3, delay: 0.3 }}
                >
                  <CheckCircle className="w-7 h-7 text-[#00c853]" />
                </motion.div>
              </motion.div>

              <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Check your email
              </h1>
              <p className="text-[14px] text-[#808080] mt-2 leading-relaxed max-w-[340px] mx-auto">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-[#1a1a2e]">{email}</span>.
                It may take a minute to arrive.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => setSent(false)}
                  className="w-full h-[44px] text-[14px] font-medium text-[#666] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors cursor-pointer"
                >
                  Try a different email
                </button>
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center w-full h-[44px] text-[14px] font-bold text-white bg-[#1552f0] rounded-[10px] hover:bg-[#1247d6] transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>

              <p className="text-[12px] text-[#bbb] mt-6">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#1552f0] font-medium hover:underline cursor-pointer"
                >
                  resend
                </button>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
