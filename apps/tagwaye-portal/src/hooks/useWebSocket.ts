/**
 * WebSocket Hook for Real-time Updates
 * 
 * Provides real-time connection status, sync timestamps, performance metrics,
 * and collaboration presence updates via WebSocket.
 * 
 * Falls back to polling if WebSocket is unavailable.
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface SystemStatusUpdate {
  connection: "live" | "offline" | "syncing";
  lastSyncIso: string;
  renderTimeMs: number;
  activeCollaborators: number;
}

export interface UseWebSocketOptions {
  projectId: string | null;
  enabled?: boolean;
  onStatusUpdate?: (status: SystemStatusUpdate) => void;
  fallbackPollInterval?: number; // ms, default 20000
}

export interface UseWebSocketResult {
  status: SystemStatusUpdate | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
const DEFAULT_POLL_INTERVAL = 20000; // 20 seconds

export function useWebSocket({
  projectId,
  enabled = true,
  onStatusUpdate,
  fallbackPollInterval = DEFAULT_POLL_INTERVAL,
}: UseWebSocketOptions): UseWebSocketResult {
  const [status, setStatus] = useState<SystemStatusUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  // Fetch status via HTTP (fallback)
  const fetchStatus = useCallback(async () => {
    if (!projectId) return;

    try {
      // In production, this would call the actual API
      // For now, we'll simulate with a mock fetch
      const response = await fetch(
        `/api/projects/${projectId}/status`,
      ).catch(() => null);

      if (response?.ok) {
        const data = await response.json();
        const update: SystemStatusUpdate = {
          connection: data.connection || "offline",
          lastSyncIso: data.lastSyncIso || new Date().toISOString(),
          renderTimeMs: data.renderTimeMs || 0,
          activeCollaborators: data.activeCollaborators || 0,
        };
        setStatus(update);
        onStatusUpdate?.(update);
      }
    } catch (err) {
      console.warn("Failed to fetch status via HTTP:", err);
    }
  }, [projectId, onStatusUpdate]);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (!projectId || !enabled) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const wsUrl = `${DEFAULT_WS_URL}/live/${projectId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log("WebSocket connected for project:", projectId);

        // Clear polling fallback
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different message types
          if (data.type === "status.update") {
            const update: SystemStatusUpdate = {
              connection: data.payload.connection || "offline",
              lastSyncIso: data.payload.lastSyncIso || new Date().toISOString(),
              renderTimeMs: data.payload.renderTimeMs || 0,
              activeCollaborators: data.payload.activeCollaborators || 0,
            };
            setStatus(update);
            onStatusUpdate?.(update);
          } else if (data.type === "heartbeat") {
            // Update last sync on heartbeat
            setStatus((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                lastSyncIso: data.timestamp || new Date().toISOString(),
              };
            });
          }
        } catch (err) {
          console.warn("Failed to parse WebSocket message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError(new Error("WebSocket connection error"));
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log("WebSocket closed:", event.code, event.reason);

        // Attempt to reconnect if not a clean close
        if (shouldReconnectRef.current && event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000); // Reconnect after 3 seconds
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError(err instanceof Error ? err : new Error("WebSocket creation failed"));
      setIsConnected(false);

      // Fall back to polling
      if (!pollIntervalRef.current) {
        fetchStatus();
        pollIntervalRef.current = setInterval(fetchStatus, fallbackPollInterval);
      }
    }
  }, [projectId, enabled, onStatusUpdate, fetchStatus, fallbackPollInterval]);

  // Reconnect function
  const reconnect = useCallback(() => {
    shouldReconnectRef.current = true;
    connect();
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    if (projectId && enabled) {
      // Try WebSocket first
      connect();

      // Fallback: Start polling if WebSocket fails after 5 seconds
      const fallbackTimeout = setTimeout(() => {
        if (!isConnected && !pollIntervalRef.current) {
          console.log("WebSocket not connected, falling back to polling");
          fetchStatus();
          pollIntervalRef.current = setInterval(fetchStatus, fallbackPollInterval);
        }
      }, 5000);

      return () => {
        clearTimeout(fallbackTimeout);
      };
    } else {
      // Disabled or no project: use polling only
      if (projectId && !isConnected) {
        fetchStatus();
        pollIntervalRef.current = setInterval(fetchStatus, fallbackPollInterval);
      }
    }

    return () => {
      if (wsRef.current) {
        shouldReconnectRef.current = false;
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [projectId, enabled, connect, isConnected, fetchStatus, fallbackPollInterval]);

  return {
    status,
    isConnected,
    error,
    reconnect,
  };
}

