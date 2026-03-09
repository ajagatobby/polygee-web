"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertKeys } from "@/lib/api/query-keys";
import {
  fetchAlerts,
  fetchUnreadAlerts,
  acknowledgeAlert,
  acknowledgeAllAlerts,
  type AlertListParams,
} from "@/lib/api/endpoints/alerts";

/** Paginated alerts with filters */
export function useAlerts(params?: AlertListParams) {
  return useQuery({
    queryKey: alertKeys.list(params),
    queryFn: () => fetchAlerts(params),
  });
}

/** Unread/unacknowledged alerts — for the notification bell */
export function useUnreadAlerts(enabled = true) {
  return useQuery({
    queryKey: alertKeys.unread(),
    queryFn: fetchUnreadAlerts,
    enabled,
    refetchInterval: 60_000, // poll every minute
    staleTime: 15_000,
  });
}

/** Acknowledge a single alert */
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => acknowledgeAlert(id),
    onSuccess: () => {
      // Invalidate both alert queries so counts and lists refresh
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
    },
  });
}

/** Acknowledge all unread alerts */
export function useAcknowledgeAllAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acknowledgeAllAlerts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
    },
  });
}
