"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";
import { fetchCurrentUser } from "@/lib/api/endpoints/auth";
import { userKeys } from "@/lib/api/query-keys";
import { easing, duration } from "@/lib/animations";

export default function SubscriptionSuccessPage() {
  const queryClient = useQueryClient();
  const { setDbUser } = useAuth();

  // Refresh the user profile to pick up the new subscription status.
  // The webhook may take a moment, so we retry a few times.
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;

    const refreshUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setDbUser(user);
        queryClient.setQueryData(userKeys.me(), user);

        // If subscription is still 'free', the webhook hasn't arrived yet — retry
        if (user.subscriptionTier === "free" && attempts < maxAttempts) {
          attempts++;
          setTimeout(refreshUser, 2000); // retry after 2s
        }
      } catch {
        // Silently fail
      }
    };

    // Initial delay to give webhook time to process
    const timer = setTimeout(refreshUser, 1500);
    return () => clearTimeout(timer);
  }, [setDbUser, queryClient]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: duration.slow, ease: easing.easeOut }}
        >
          {/* Success icon */}
          <motion.div
            className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#00c853]/10 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: duration.medium,
              ease: easing.easeOut,
              delay: 0.2,
            }}
          >
            <CheckCircle className="w-9 h-9 text-[#00c853]" />
          </motion.div>

          <h1 className="text-[32px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-3">
            Welcome to Pro!
          </h1>
          <p className="text-[16px] text-[#808080] leading-relaxed max-w-[440px] mx-auto mb-8">
            Your subscription is active. You now have unlimited access to all AI
            predictions, detailed match analysis, and value bets.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-[44px] px-6 text-[14px] font-bold text-white bg-[#1552f0] rounded-[10px] hover:bg-[#1247d6] transition-colors group"
            >
              View Predictions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center h-[44px] px-5 text-[14px] font-medium text-[#808080] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors"
            >
              Manage Billing
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
