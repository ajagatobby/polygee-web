import axios from "axios";
import { firebaseAuth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Axios instance pre-configured for the polygentic-backend API.
 *
 * - Base URL from env `NEXT_PUBLIC_API_URL` (defaults to localhost:8080)
 * - Automatically attaches Firebase ID token as Bearer auth
 * - Handles 401 by attempting a token refresh
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: attach Firebase ID token ─────────────────────

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = firebaseAuth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // No user logged in — send request without auth header.
      // Public endpoints will still work; protected ones return 401.
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Session expiry event ──────────────────────────────────────────────

/**
 * Dispatch a custom event when the session has expired (final 401 after retry).
 * The auth context listens for this and triggers sign-out + redirect.
 */
function dispatchSessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("session-expired"));
  }
}

// ─── Response interceptor: handle errors ───────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          // Force refresh the token
          const token = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Token refresh failed — session is expired
      }

      // Final 401 after retry — session expired
      dispatchSessionExpired();
    }

    return Promise.reject(error);
  },
);
