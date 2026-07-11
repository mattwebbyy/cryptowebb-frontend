// Live feed of indexer events relayed through our backend WebSocket hub.
// The backend holds the authenticated upstream connection (whales +
// new_tokens channels) and rebroadcasts frames as hub messages:
//   { type: 'new_token',  data: NewTokenAlert, timestamp }   — all clients
//   { type: 'whale_alert', data: WhaleAlert,  timestamp }    — authed only
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WS_BASE_URL } from '@/lib/config';
import { useWebSocketImproved } from '@/hooks/useWebSocketImproved';
import { useFlag } from '@/lib/flags';
import { nextMockNewTokenAlert, nextMockWhaleAlert } from '@/features/indexer/mocks';
import type { NewTokenAlert, WhaleAlert } from '@/features/indexer';

interface HubMessage {
  type: string;
  data?: unknown;
  timestamp?: string;
}

export interface IndexerStreamOptions {
  /** Keep at most this many events per feed (default 100) */
  bufferSize?: number;
  onNewToken?: (alert: NewTokenAlert) => void;
  onWhale?: (alert: WhaleAlert) => void;
  /** Pause buffering (e.g. while the user hovers a live table) */
  paused?: boolean;
  enabled?: boolean;
}

export function useIndexerStream(options: IndexerStreamOptions = {}) {
  const { bufferSize = 100, onNewToken, onWhale, paused = false, enabled = true } = options;
  const mockMode = useFlag('mockData');

  const [newTokens, setNewTokens] = useState<NewTokenAlert[]>([]);
  const [whales, setWhales] = useState<WhaleAlert[]>([]);
  // Events arriving while paused are queued so nothing is lost.
  const pendingTokens = useRef<NewTokenAlert[]>([]);
  const pendingWhales = useRef<WhaleAlert[]>([]);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const url = useMemo(() => {
    if (!enabled || mockMode) return null; // mock mode: no socket, synthesized events
    // Whale events are only delivered to authenticated hub clients.
    const token = localStorage.getItem('token');
    const base = `${WS_BASE_URL}/api/v1/ws/live`;
    return token ? `${base}?token=${encodeURIComponent(token)}` : base;
  }, [enabled, mockMode]);

  const handleMessage = useCallback(
    (msg: HubMessage) => {
      if (msg.type === 'new_token' && msg.data) {
        const alert = msg.data as NewTokenAlert;
        onNewToken?.(alert);
        if (pausedRef.current) {
          pendingTokens.current = [alert, ...pendingTokens.current].slice(0, bufferSize);
        } else {
          setNewTokens((prev) => [alert, ...prev].slice(0, bufferSize));
        }
      } else if (msg.type === 'whale_alert' && msg.data) {
        const alert = msg.data as WhaleAlert;
        onWhale?.(alert);
        if (pausedRef.current) {
          pendingWhales.current = [alert, ...pendingWhales.current].slice(0, bufferSize);
        } else {
          setWhales((prev) => [alert, ...prev].slice(0, bufferSize));
        }
      }
    },
    [bufferSize, onNewToken, onWhale]
  );

  const { isConnected, isConnecting } = useWebSocketImproved<HubMessage>(url, handleMessage, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  // Mock mode: synthesize the live feed so launch/whale tables still tick.
  useEffect(() => {
    if (!mockMode || !enabled) return;
    const emit = () => {
      handleMessage(
        Math.random() > 0.45
          ? { type: 'new_token', data: nextMockNewTokenAlert() }
          : { type: 'whale_alert', data: nextMockWhaleAlert() }
      );
    };
    const timer = setInterval(emit, 8000);
    return () => clearInterval(timer);
  }, [mockMode, enabled, handleMessage]);

  /** Flush events queued while paused into the visible buffers. */
  const flushPending = useCallback(() => {
    if (pendingTokens.current.length > 0) {
      const queued = pendingTokens.current;
      pendingTokens.current = [];
      setNewTokens((prev) => [...queued, ...prev].slice(0, bufferSize));
    }
    if (pendingWhales.current.length > 0) {
      const queued = pendingWhales.current;
      pendingWhales.current = [];
      setWhales((prev) => [...queued, ...prev].slice(0, bufferSize));
    }
  }, [bufferSize]);

  const clear = useCallback(() => {
    pendingTokens.current = [];
    pendingWhales.current = [];
    setNewTokens([]);
    setWhales([]);
  }, []);

  return {
    isConnected: mockMode ? true : isConnected,
    isConnecting: mockMode ? false : isConnecting,
    newTokens,
    whales,
    pendingCount: pendingTokens.current.length + pendingWhales.current.length,
    flushPending,
    clear,
  };
}

export default useIndexerStream;
