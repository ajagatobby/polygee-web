import { apiClient } from "../client";
import type { ApiUser, ApiRegisterResponse, ApiRefreshResponse } from "@/types/api";

/** POST /api/auth/register — create new user account */
export async function registerUser(body: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<ApiRegisterResponse> {
  const { data } = await apiClient.post<ApiRegisterResponse>(
    "/api/auth/register",
    body,
  );
  return data;
}

/** POST /api/auth/refresh — exchange refresh token for new ID token */
export async function refreshToken(
  refreshToken: string,
): Promise<ApiRefreshResponse> {
  const { data } = await apiClient.post<ApiRefreshResponse>(
    "/api/auth/refresh",
    { refreshToken },
  );
  return data;
}

/** GET /api/auth/me — current user profile from database */
export async function fetchCurrentUser(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiUser>("/api/auth/me");
  return data;
}
