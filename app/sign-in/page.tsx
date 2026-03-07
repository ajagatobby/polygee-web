"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { easing, duration } from "@/lib/animations";

export default function SignInPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsAuthenticated(true);
    router.push("/");
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
              AI-powered soccer predictions at your fingertips.
            </h2>
            <p className="text-[15px] text-white/60 mt-4 leading-relaxed max-w-[360px]">
              Get real-time match insights, trade on prediction markets, and stay ahead with data-driven analysis.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: 0.3 }}
          >
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[28px] h-[28px] rounded-full border-2 border-[#1552f0] bg-white/20 backdrop-blur-sm"
                />
              ))}
            </div>
            <p className="text-[13px] text-white/50">
              2,400+ traders already on Polygee
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — sign in form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: duration.slow, ease: easing.easeOut }}
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1a1a2e]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">Polygee</span>
          </Link>

          <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
            Welcome back
          </h1>
          <p className="text-[14px] text-[#808080] mt-1.5">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[12px] font-medium text-[#666] mb-1.5">
                Email
              </label>
              <div
                className={`flex items-center gap-2.5 h-[44px] px-3.5 rounded-[10px] border transition-all ${
                  focusedField === "email"
                    ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white"
                    : "border-[#e8e8e8] bg-[#fafafa] hover:border-[#ddd]"
                }`}
              >
                <Mail className={`w-4 h-4 shrink-0 transition-colors ${focusedField === "email" ? "text-[#1552f0]" : "text-[#bbb]"}`} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 text-[14px] text-[#1a1a2e] placeholder:text-[#bbb] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] font-medium text-[#666]">
                  Password
                </label>
                <button type="button" className="text-[12px] font-medium text-[#1552f0] hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>
              <div
                className={`flex items-center gap-2.5 h-[44px] px-3.5 rounded-[10px] border transition-all ${
                  focusedField === "password"
                    ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white"
                    : "border-[#e8e8e8] bg-[#fafafa] hover:border-[#ddd]"
                }`}
              >
                <Lock className={`w-4 h-4 shrink-0 transition-colors ${focusedField === "password" ? "text-[#1552f0]" : "text-[#bbb]"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 text-[14px] text-[#1a1a2e] placeholder:text-[#bbb] bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 p-0.5 text-[#bbb] hover:text-[#808080] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full h-[44px] text-[14px] font-bold text-white rounded-[10px] transition-all cursor-pointer ${
                isValid
                  ? "bg-[#1552f0] hover:bg-[#1247d6]"
                  : "bg-[#1552f0]/40 cursor-not-allowed"
              }`}
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#f0f0f0]" />
            <span className="text-[12px] text-[#bbb] font-medium">or</span>
            <div className="flex-1 h-px bg-[#f0f0f0]" />
          </div>

          {/* Google */}
          <button className="w-full h-[44px] flex items-center justify-center gap-2.5 text-[14px] font-medium text-[#1a1a2e] bg-white border border-[#e8e8e8] rounded-[10px] hover:bg-[#f7f7f7] hover:border-[#ddd] transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-[13px] text-[#808080] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-[#1552f0] hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
