"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/api/query-keys";
import { fetchCurrentUser } from "@/lib/api/endpoints/auth";

/**
 * Fetch the current user's profile from the backend.
 *
 * Only enabled when the caller explicitly passes `enabled: true`
 * (i.e., when Firebase auth confirms a user is logged in).
 * This prevents unnecessary 401 requests for unauthenticated visitors.
 */
export function useCurrentUser(enabled = false) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
