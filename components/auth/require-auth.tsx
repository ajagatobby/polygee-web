"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/**
 * Route guard component. Redirects unauthenticated users to /sign-in.
 * Wrap any page content that requires authentication.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Route guard for Pro users. Redirects free users to /pricing.
 */
export function RequirePro({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPro, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/sign-in");
    } else if (!loading && isAuthenticated && !isPro) {
      router.replace("/pricing");
    }
  }, [loading, isAuthenticated, isPro, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isPro) {
    return null;
  }

  return <>{children}</>;
}
