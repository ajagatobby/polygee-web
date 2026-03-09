import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ─── Firebase Auth readiness ───────────────────────────────────────────

/**
 * Tracks whether Firebase Auth has finished restoring the session from
 * IndexedDB/localStorage. Until this resolves, `firebaseAuth.currentUser`
 * is null even if the user has a valid session.
 *
 * We wait for this before attaching tokens or dispatching session-expired
 * to avoid a race condition where requests fire before auth is ready,
 * get a 401, and incorrectly trigger sign-out.
 */
let authReady = false;
const authReadyPromise = new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, () => {
    authReady = true;
    unsubscribe();
    resolve();
  });
});

/**
 * Axios instance pre-configured for the polygentic-backend API.
 *
 * - Base URL from env `NEXT_PUBLIC_API_URL` (defaults to localhost:8080)
 * - Automatically attaches Firebase ID token as Bearer auth
 * - Waits for Firebase Auth to restore session before sending authenticated requests
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
      // Wait for Firebase to restore session before reading currentUser
      if (!authReady) {
        await authReadyPromise;
      }
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
        dispatchSessionExpired();
        return Promise.reject(error);
      }

      // No current user after auth is ready — only dispatch session-expired
      // if there WAS a token on the original request (meaning user was
      // previously signed in but the session is now invalid).
      // If there was never a token, this is just an unauthenticated request
      // hitting a protected endpoint — not a session expiry.
      if (originalRequest.headers.Authorization) {
        dispatchSessionExpired();
      }
    }

    return Promise.reject(error);
  },
);
