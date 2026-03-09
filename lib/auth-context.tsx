"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { firebaseAuth } from "@/lib/firebase";
import { registerUser, fetchCurrentUser } from "@/lib/api/endpoints/auth";
import { userKeys } from "@/lib/api/query-keys";
import type { ApiUser } from "@/types/api";

// ─── Types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Firebase user object (null when signed out, undefined while loading) */
  firebaseUser: FirebaseUser | null | undefined;
  /** Backend user profile (null when not fetched yet or signed out) */
  dbUser: ApiUser | null;
  /** True while Firebase is determining initial auth state */
  loading: boolean;
  /** Convenience: true when a user is authenticated */
  isAuthenticated: boolean;
  /** True when user has an active pro subscription */
  isPro: boolean;
  /** Sign in with email + password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Register new account: creates Firebase user + backend row */
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  /** Sign in with Google popup */
  signInWithGoogle: () => Promise<void>;
  /** Sign out from Firebase */
  signOut: () => Promise<void>;
  /** Send password reset email */
  resetPassword: (email: string) => Promise<void>;
  /** Set the backend user profile (called after fetching /auth/me) */
  setDbUser: (user: ApiUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────

const auth = firebaseAuth;
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<
    FirebaseUser | null | undefined
  >(undefined); // undefined = loading
  const [dbUser, setDbUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setDbUser(null);
        // Clear user-related queries when signed out
        queryClient.removeQueries({ queryKey: userKeys.all });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [queryClient]);

  // Listen for session expiry (final 401 from API client after token refresh fails)
  useEffect(() => {
    const handleSessionExpired = () => {
      firebaseSignOut(auth).then(() => {
        setDbUser(null);
        queryClient.clear();
        // Redirect to sign-in with message
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-")) {
          window.location.href = "/sign-in?expired=1";
        }
      });
    };
    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [queryClient]);

  // Auto-fetch backend profile when Firebase user is available
  useEffect(() => {
    if (!firebaseUser) return;
    let cancelled = false;
    fetchCurrentUser()
      .then((user) => {
        if (!cancelled) setDbUser(user);
      })
      .catch(() => {
        // Silently fail — user is still authenticated via Firebase
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  // ── Sign in ────────────────────────────────────────────────────────

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will update firebaseUser
  }, []);

  // ── Sign up ────────────────────────────────────────────────────────

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      // 1. Register on the backend (creates Firebase user + DB row)
      await registerUser({ email, password, displayName });
      // 2. Sign in on the client so Firebase SDK picks up the user
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  // ── Google sign-in ─────────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged will update firebaseUser
    // Note: If this is a new Google user, they won't have a DB row yet.
    // The backend's Firebase auth guard auto-creates a user row on first request.
  }, []);

  // ── Sign out ───────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setDbUser(null);
    // Clear all cached data on logout
    queryClient.clear();
  }, [queryClient]);

  // ── Reset password ─────────────────────────────────────────────────

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  // ── Context value ──────────────────────────────────────────────────

  const isAuthenticated = firebaseUser != null;

  // Pro = subscription tier is 'pro' AND status is active or trialing
  const isPro = useMemo(() => {
    if (!dbUser) return false;
    return (
      dbUser.subscriptionTier === "pro" &&
      (dbUser.subscriptionStatus === "active" ||
        dbUser.subscriptionStatus === "trialing")
    );
  }, [dbUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser: firebaseUser,
        dbUser,
        loading,
        isAuthenticated,
        isPro,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        setDbUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
