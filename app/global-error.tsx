"use client";

import { useEffect } from "react";

/**
 * Global error boundary for the root layout.
 * This catches errors that happen in the root layout itself.
 * Must include its own <html> and <body> tags since the root layout is replaced.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#1a1a2e",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", padding: "0 24px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#fff3e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 28,
            }}
          >
            &#9888;
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#808080",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            A critical error occurred. Please try refreshing the page.
          </p>

          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              backgroundColor: "#1552f0",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
