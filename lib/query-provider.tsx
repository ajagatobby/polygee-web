"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 30 seconds — no refetch within this window
        staleTime: 30 * 1000,
        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry once on failure (not on 4xx)
        retry: (failureCount, error) => {
          if (failureCount >= 1) return false;
          // Don't retry on client errors (4xx)
          const status = (error as { status?: number })?.status;
          if (status && status >= 400 && status < 500) return false;
          return true;
        },
        // Refetch on window focus (user returns to tab)
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * React Query provider — wraps the app with QueryClientProvider.
 *
 * Uses useState to create a stable QueryClient per component lifecycle,
 * preventing re-creation on re-renders (Next.js App Router best practice).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
