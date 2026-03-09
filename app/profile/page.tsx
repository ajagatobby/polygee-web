"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  CreditCard,
  Mail,
  User,
  Shield,
  Calendar,
  ExternalLink,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/lib/auth-context";
import { createBillingPortalSession } from "@/lib/api/endpoints/billing";
import { easing, duration } from "@/lib/animations";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getSubscriptionStatusInfo(status: string): {
  label: string;
  color: string;
  bg: string;
  Icon: typeof CheckCircle2;
} {
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "#00c853",
        bg: "#00c853",
        Icon: CheckCircle2,
      };
    case "trialing":
      return {
        label: "Trial",
        color: "#1552f0",
        bg: "#1552f0",
        Icon: Clock,
      };
    case "canceled":
      return {
        label: "Canceled",
        color: "#ff9100",
        bg: "#ff9100",
        Icon: AlertTriangle,
      };
    case "past_due":
      return {
        label: "Past Due",
        color: "#ff3d57",
        bg: "#ff3d57",
        Icon: XCircle,
      };
    default:
      return {
        label: "None",
        color: "#999",
        bg: "#999",
        Icon: XCircle,
      };
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    firebaseUser,
    dbUser,
    isAuthenticated,
    isPro,
    loading: authLoading,
    signOut,
  } = useAuth();

  const [billingLoading, setBillingLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleBillingPortal = useCallback(async () => {
    setBillingLoading(true);
    try {
      const { url } = await createBillingPortalSession({
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch {
      // Fallback to pricing page
      router.push("/pricing");
    } finally {
      setBillingLoading(false);
    }
  }, [router]);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <ProfileSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="p-8 bg-white border border-[#f0f0f0] rounded-[16px]">
            <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#f5f5f5] mx-auto mb-4">
              <User className="w-6 h-6 text-[#999]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
              Sign in to view your profile
            </h1>
            <p className="text-[14px] text-[#808080] leading-relaxed max-w-[400px] mx-auto mb-6">
              Access your account settings, subscription management, and more.
            </p>
            <div className="flex items-center justify-center gap-3">
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
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionStatusInfo(
    dbUser?.subscriptionStatus ?? "none",
  );
  const StatusIcon = subscriptionInfo.Icon;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-5 pb-20 sm:pb-5">
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
          <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#f5f5f5]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="8" r="4" fill="#1a1a2e" opacity="0.15" />
              <path
                d="M6 21v-1a6 6 0 0 1 12 0v1"
                stroke="#1a1a2e"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <circle
                cx="12"
                cy="8"
                r="3"
                stroke="#1a1a2e"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
              Profile
            </h1>
            <p className="text-[13px] text-[#808080]">
              Manage your account and subscription
            </p>
          </div>
        </div>

        {/* Profile card */}
        <motion.div
          className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.normal, ease: easing.easeOut }}
        >
          {/* Avatar + name */}
          <div className="px-5 pt-5 pb-4 flex items-center gap-4">
            {firebaseUser?.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt=""
                className="w-[56px] h-[56px] rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shrink-0 flex items-center justify-center">
                <span className="text-white text-[22px] font-bold">
                  {(
                    firebaseUser?.displayName?.[0] ||
                    firebaseUser?.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-[18px] font-bold text-[#1a1a2e] truncate">
                  {firebaseUser?.displayName || "User"}
                </h2>
                {isPro && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1552f0]/10 shrink-0">
                    <Crown className="w-3 h-3 text-[#1552f0]" />
                    <span className="text-[10px] font-bold text-[#1552f0] uppercase">
                      Pro
                    </span>
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#808080] truncate">
                {firebaseUser?.email}
              </p>
            </div>
          </div>

          <div className="h-px bg-[#f0f0f0]" />

          {/* Account details */}
          <div className="px-5 py-4 space-y-3.5">
            <InfoRow
              icon={Mail}
              label="Email"
              value={firebaseUser?.email || "—"}
              badge={
                firebaseUser?.emailVerified
                  ? { label: "Verified", color: "#00c853" }
                  : { label: "Unverified", color: "#ff9100" }
              }
            />
            <InfoRow
              icon={Shield}
              label="Provider"
              value={
                dbUser?.provider === "google.com"
                  ? "Google"
                  : dbUser?.provider === "password"
                    ? "Email & Password"
                    : dbUser?.provider || "—"
              }
            />
            <InfoRow
              icon={Calendar}
              label="Member since"
              value={formatDate(dbUser?.createdAt ?? null)}
            />
            {dbUser?.lastActiveAt && (
              <InfoRow
                icon={Clock}
                label="Last active"
                value={formatDate(dbUser.lastActiveAt)}
              />
            )}
          </div>
        </motion.div>

        {/* Subscription card */}
        <motion.div
          className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration.normal,
            ease: easing.easeOut,
            delay: 0.05,
          }}
        >
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#999]" />
              <h3 className="text-[14px] font-bold text-[#1a1a2e]">
                Subscription
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusIcon
                className="w-3.5 h-3.5"
                style={{ color: subscriptionInfo.color }}
              />
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: subscriptionInfo.color,
                  backgroundColor: subscriptionInfo.bg + "14",
                }}
              >
                {subscriptionInfo.label}
              </span>
            </div>
          </div>

          <div className="h-px bg-[#f0f0f0]" />

          <div className="px-5 py-4">
            {isPro ? (
              <div className="space-y-3.5">
                <InfoRow
                  icon={Crown}
                  label="Plan"
                  value="Polygee Pro"
                />
                <InfoRow
                  icon={Calendar}
                  label="Renewal date"
                  value={formatDate(
                    dbUser?.subscriptionPeriodEnd ?? null,
                  )}
                />
                <div className="pt-2">
                  <button
                    onClick={handleBillingPortal}
                    disabled={billingLoading}
                    className="flex items-center gap-2 h-[38px] px-4 text-[13px] font-medium text-[#1a1a2e] bg-[#f5f5f5] rounded-[8px] hover:bg-[#ebebeb] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {billingLoading
                      ? "Loading..."
                      : "Manage Subscription"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[13px] text-[#808080] mb-4">
                  You&apos;re on the free plan. Upgrade to Pro for unlimited
                  AI predictions, detailed analysis, odds comparison, and
                  performance stats.
                </p>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 h-[38px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account actions */}
        <motion.div
          className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration.normal,
            ease: easing.easeOut,
            delay: 0.1,
          }}
        >
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-[14px] font-bold text-[#1a1a2e]">
              Account
            </h3>
          </div>

          <div className="h-px bg-[#f0f0f0]" />

          <div className="py-1">
            {isPro && (
              <button
                onClick={handleBillingPortal}
                disabled={billingLoading}
                className="flex items-center gap-3 w-full px-5 py-3 text-[13px] font-medium text-[#1a1a2e] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#808080]" />
                Billing & Invoices
                <ExternalLink className="w-3 h-3 text-[#ccc] ml-auto" />
              </button>
            )}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="flex items-center gap-3 w-full px-5 py-3 text-[13px] font-medium text-[#ff3b30] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Usage stats (if available) */}
        {dbUser && (
          <motion.div
            className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.normal,
              ease: easing.easeOut,
              delay: 0.15,
            }}
          >
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-[14px] font-bold text-[#1a1a2e]">
                Usage
              </h3>
            </div>

            <div className="h-px bg-[#f0f0f0]" />

            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#808080]">
                  API Requests
                </span>
                <span className="text-[14px] font-bold text-[#1a1a2e]">
                  {dbUser.requestCount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <MobileNav />

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm logout"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.normal, ease: easing.easeOut }}
            onClick={() => setLogoutModalOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-[360px] mx-4 bg-white rounded-[16px] shadow-xl overflow-hidden"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{ duration: duration.medium, ease: easing.easeOut }}
          >
            <div className="px-6 pt-6 pb-2 text-center">
              <motion.div
                className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-red-50 mx-auto mb-3"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.5,
                  bounce: 0.25,
                  delay: 0.1,
                }}
              >
                <LogOut className="w-5 h-5 text-[#ff3b30]" />
              </motion.div>
              <h2 className="text-[17px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Log out?
              </h2>
              <p className="text-[13px] text-[#808080] mt-1">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="px-6 pb-6 pt-4 flex gap-2.5">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 h-[40px] text-[13px] font-medium text-[#666] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setLogoutModalOpen(false);
                  await signOut();
                  router.push("/");
                }}
                className="flex-1 h-[40px] text-[13px] font-bold text-white bg-[#ff3b30] rounded-[10px] hover:bg-[#e6352b] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Info row ────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  badge?: { label: string; color: string };
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#999]">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[12px] font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#1a1a2e]">
          {value}
        </span>
        {badge && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              color: badge.color,
              backgroundColor: badge.color + "14",
            }}
          >
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-5">
      <div className="skeleton h-4 w-32 rounded mb-5" />
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton w-10 h-10 rounded-[10px]" />
        <div>
          <div className="skeleton h-6 w-32 rounded mb-1" />
          <div className="skeleton h-3 w-56 rounded" />
        </div>
      </div>
      <div className="bg-white border border-[#f0f0f0] rounded-[12px] overflow-hidden mb-4">
        <div className="px-5 pt-5 pb-4 flex items-center gap-4">
          <div className="skeleton w-14 h-14 rounded-full" />
          <div className="flex-1">
            <div className="skeleton h-5 w-40 rounded mb-2" />
            <div className="skeleton h-3 w-52 rounded" />
          </div>
        </div>
        <div className="h-px bg-[#f0f0f0]" />
        <div className="px-5 py-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#f0f0f0] rounded-[12px] h-[160px] mb-4" />
    </main>
  );
}
