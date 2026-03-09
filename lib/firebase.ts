import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Singleton Firebase app instance.
 * Safe to import from both client and server contexts —
 * only initializes once even with hot-reload.
 */
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

/**
 * Singleton Firebase Auth instance with explicit long-lived persistence.
 *
 * - indexedDBLocalPersistence (primary): survives browser restarts, tab closes,
 *   and clears — refresh tokens persist until explicitly revoked.
 * - browserLocalPersistence (fallback): localStorage-based for browsers
 *   where IndexedDB is unavailable (e.g. some private browsing modes).
 *
 * This ensures sessions last 30+ days (until the refresh token expires
 * or is revoked server-side), rather than ending when the tab closes.
 */
export const firebaseAuth: Auth = (() => {
  try {
    // On first init, use initializeAuth with explicit persistence + popup resolver
    return initializeAuth(firebaseApp, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    // If already initialized (hot-reload), fall back to getAuth
    return getAuth(firebaseApp);
  }
})();
