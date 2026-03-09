"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fixtureKeys } from "@/lib/api/query-keys";
import type {
  LiveSocketMessage,
  LiveMatchUpdatePayload,
  LiveEventPayload,
  LiveEventType,
  ApiEnrichedFixture,
  ApiTodayFixturesResponse,
} from "@/types/api";

// ─── Types ─────────────────────────────────────────────────────────────

type LiveEventHandler = (event: LiveEventType, data: LiveMatchUpdatePayload | LiveEventPayload) => void;

interface UseLiveSocketOptions {
  /** Whether the socket should be connected. Default: true */
  enabled?: boolean;
  /** Called on every incoming event */
  onEvent?: LiveEventHandler;
}

interface UseLiveSocketReturn {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** Last match-update payload received */
  lastUpdate: LiveMatchUpdatePayload | null;
  /** Last discrete event (goal, red-card, etc.) */
  lastEvent: LiveEventPayload | null;
}

// ─── Constants ─────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Build the WebSocket URL for the /live namespace */
function getWsUrl(): string {
  const base = API_URL.replace(/^http/, "ws");
  return `${base}/live`;
}

/** Reconnect delay with exponential backoff (max 30s) */
function getReconnectDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 30_000);
}

// ─── Hook ──────────────────────────────────────────────────────────────

/**
 * WebSocket hook for live football match updates.
 *
 * Connects to the backend `/live` namespace (raw WebSocket, not Socket.IO).
 * Wire format: JSON `{ event, data }`.
 *
 * Features:
 * - Auto-reconnect with exponential backoff
 * - Invalidates TanStack Query cache on score changes
 * - Exposes connection state, last update, and last event
 */
export function useLiveSocket(options: UseLiveSocketOptions = {}): UseLiveSocketReturn {
  const { enabled = true, onEvent } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<LiveMatchUpdatePayload | null>(null);
  const [lastEvent, setLastEvent] = useState<LiveEventPayload | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEventRef = useRef(onEvent);
  const queryClient = useQueryClient();

  // Keep callback ref fresh without re-triggering effect
  onEventRef.current = onEvent;

  /**
   * When a live score event updates a fixture's goals/status,
   * patch the TanStack Query cache so the UI updates instantly
   * without waiting for the next HTTP poll.
   */
  const patchFixtureCache = useCallback(
    (fixtureId: number, goalsHome: number | null, goalsAway: number | null, status?: string, elapsed?: number | null) => {
      // Patch today's fixtures cache
      queryClient.setQueriesData<ApiTodayFixturesResponse>(
        { queryKey: fixtureKeys.lists() },
        (old) => {
          if (!old?.data) return old;
          const updated = old.data.map((item: ApiEnrichedFixture) => {
            if (item.fixture.id !== fixtureId) return item;
            return {
              ...item,
              fixture: {
                ...item.fixture,
                ...(goalsHome !== null && { goalsHome }),
                ...(goalsAway !== null && { goalsAway }),
                ...(status && { status }),
                ...(elapsed !== undefined && { elapsed }),
              },
            };
          });
          return { ...old, data: updated };
        },
      );
    },
    [queryClient],
  );

  const connect = useCallback(() => {
    if (!enabled) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const ws = new WebSocket(getWsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempt.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message: LiveSocketMessage = JSON.parse(event.data);
        const { event: eventType, data } = message;

        // Notify external handler
        onEventRef.current?.(eventType, data);

        switch (eventType) {
          case "match-update": {
            const payload = data as LiveMatchUpdatePayload;
            setLastUpdate(payload);

            // Patch cache for each active match
            payload.matches.forEach((match) => {
              patchFixtureCache(
                match.fixtureId,
                match.goalsHome,
                match.goalsAway,
                match.status,
                match.elapsed,
              );
            });
            break;
          }

          case "goal": {
            const payload = data as LiveEventPayload;
            setLastEvent(payload);
            const goalData = payload.data as { goalsHome?: number; goalsAway?: number };
            patchFixtureCache(
              payload.fixtureId,
              goalData.goalsHome ?? null,
              goalData.goalsAway ?? null,
            );
            break;
          }

          case "match-start": {
            const payload = data as LiveEventPayload;
            setLastEvent(payload);
            const startData = payload.data as { status?: string };
            patchFixtureCache(payload.fixtureId, null, null, startData.status || "1H");
            // Invalidate today's fixtures to get full enriched data
            queryClient.invalidateQueries({ queryKey: fixtureKeys.today() });
            break;
          }

          case "match-end": {
            const payload = data as LiveEventPayload;
            setLastEvent(payload);
            const endData = payload.data as { goalsHome?: number; goalsAway?: number; status?: string };
            patchFixtureCache(
              payload.fixtureId,
              endData.goalsHome ?? null,
              endData.goalsAway ?? null,
              endData.status || "FT",
            );
            // Invalidate to refresh prediction results (wasCorrect, etc.)
            queryClient.invalidateQueries({ queryKey: fixtureKeys.today() });
            break;
          }

          case "red-card": {
            const payload = data as LiveEventPayload;
            setLastEvent(payload);
            break;
          }
        }
      } catch {
        // Silently ignore malformed messages
      }
    };

    ws.onerror = () => {
      // Error will trigger onclose
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;

      // Auto-reconnect if still enabled
      if (enabled) {
        const delay = getReconnectDelay(reconnectAttempt.current);
        reconnectAttempt.current++;
        reconnectTimer.current = setTimeout(connect, delay);
      }
    };
  }, [enabled, patchFixtureCache, queryClient]);

  // Connect on mount / when enabled changes
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      // Disconnect when disabled
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, connect]);

  return { isConnected, lastUpdate, lastEvent };
}
