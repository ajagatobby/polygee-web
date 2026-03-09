"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback component. If not provided, the default UI is used. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─── Error Boundary (class component required by React) ────────────────

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#fff3e0] mb-4">
            <AlertTriangle className="w-6 h-6 text-[#ff9100]" />
          </div>
          <h2 className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
            Something went wrong
          </h2>
          <p className="text-[13px] text-[#808080] max-w-[400px] mb-6 leading-relaxed">
            An unexpected error occurred. Please try refreshing the page.
            {this.state.error?.message && (
              <span className="block mt-2 text-[12px] text-[#bbb] font-mono">
                {this.state.error.message}
              </span>
            )}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 h-[40px] px-5 text-[13px] font-medium text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
