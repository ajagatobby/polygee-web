import axios from "axios";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";

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
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
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

// ─── Response interceptor: handle errors ───────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;
        if (user) {
          // Force refresh the token
          const token = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Token refresh failed — propagate the 401
      }
    }

    return Promise.reject(error);
  },
);
