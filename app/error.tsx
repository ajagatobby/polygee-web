"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Next.js App Router error boundary.
 * Catches errors in route segments and renders a recovery UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Route Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-[#fff3e0] mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-[#ff9100]" />
        </div>

        <h1 className="text-[24px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
          Something went wrong
        </h1>

        <p className="text-[14px] text-[#808080] leading-relaxed mb-6">
          An unexpected error occurred while loading this page. Please try again
          or go back to the home page.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-[#fafafa] border border-[#f0f0f0] rounded-[8px]">
            <p className="text-[12px] text-[#999] font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 h-[40px] px-5 text-[13px] font-medium text-[#1a1a2e] bg-[#f5f5f5] rounded-[8px] hover:bg-[#ebebeb] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={reset}
            className="flex items-center gap-2 h-[40px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
