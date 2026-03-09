import { apiClient } from "../client";
import type { ApiAlert } from "@/types/api";

export interface AlertListParams {
  type?: string;
  severity?: string;
  acknowledged?: boolean;
  page?: number;
  limit?: number;
}

/** GET /api/alerts — paginated alerts with filters */
export async function fetchAlerts(params?: AlertListParams): Promise<{
  data: ApiAlert[];
  total: number;
}> {
  const { data } = await apiClient.get("/api/alerts", {
    params: params ?? undefined,
  });
  return data;
}

/** GET /api/alerts/unread — unacknowledged alerts */
export async function fetchUnreadAlerts(): Promise<{
  data: ApiAlert[];
  count: number;
}> {
  const { data } = await apiClient.get("/api/alerts/unread");
  return data;
}

/** POST /api/alerts/:id/acknowledge — mark one alert as read */
export async function acknowledgeAlert(id: number): Promise<ApiAlert> {
  const { data } = await apiClient.post<ApiAlert>(
    `/api/alerts/${id}/acknowledge`,
  );
  return data;
}

/** POST /api/alerts/acknowledge-all — mark all alerts as read */
export async function acknowledgeAllAlerts(): Promise<{ acknowledged: number }> {
  const { data } = await apiClient.post<{ acknowledged: number }>(
    "/api/alerts/acknowledge-all",
  );
  return data;
}
