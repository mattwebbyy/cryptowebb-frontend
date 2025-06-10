// src/hooks/useWebSocketImproved.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  shouldReconnect?: (event: CloseEvent) => boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  // New options for better control
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  protocols?: string | string[];
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: Error | null;
  reconnectCount: number;
  connectionId: string;
}

const DEFAULT_RECONNECT_INTERVAL = 3000;
const DEFAULT_RECONNECT_ATTEMPTS = 5;
const DEFAULT_HEARTBEAT_INTERVAL = 30000; // 30 seconds
const DEFAULT_HEARTBEAT_TIMEOUT = 5000; // 5 seconds

export const useWebSocketImproved = <T = any>(
  url: string | null,
  onMessage: (data: T) => void,
  options: WebSocketOptions = {}
) => {
  const {
    onOpen,
    onClose,
    onError,
    shouldReconnect = (event) => event.code !== 1000 && event.code !== 1001,
    reconnectInterval = DEFAULT_RECONNECT_INTERVAL,
    reconnectAttempts = DEFAULT_RECONNECT_ATTEMPTS,
    heartbeatInterval = DEFAULT_HEARTBEAT_INTERVAL,
    heartbeatTimeout = DEFAULT_HEARTBEAT_TIMEOUT,
    protocols,
  } = options;

  // State management
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    lastError: null,
    reconnectCount: 0,
    connectionId: '',
  });

  // Refs for cleanup and state management
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const urlRef = useRef(url);
  const onMessageRef = useRef(onMessage);

  // Keep refs up to date
  useEffect(() => {
    urlRef.current = url;
    onMessageRef.current = onMessage;
  }, [url, onMessage]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear all timers
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // Close WebSocket connection
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      
      // Remove event listeners to prevent memory leaks
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Component unmounting');
      }
    }
  }, []);

  // Heartbeat mechanism
  const startHeartbeat = useCallback(() => {
    if (!heartbeatInterval || heartbeatInterval <= 0) return;
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        
        // Set timeout for pong response
        heartbeatTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.warn('WebSocket: Heartbeat timeout, closing connection');
            wsRef.current?.close(1006, 'Heartbeat timeout');
          }
        }, heartbeatTimeout);
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, heartbeatTimeout]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  // Connection function
  const connect = useCallback(() => {
    if (!urlRef.current || wsRef.current || !isMountedRef.current) {
      return;
    }

    const connectionId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setState(prev => ({
      ...prev,
      isConnecting: true,
      connectionId,
    }));

    console.log(`WebSocket: Connecting to ${urlRef.current} (${connectionId})`);

    try {
      const ws = protocols 
        ? new WebSocket(urlRef.current, protocols)
        : new WebSocket(urlRef.current);
      
      wsRef.current = ws;

      ws.onopen = (event) => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        console.log(`WebSocket: Connected to ${urlRef.current} (${connectionId})`);
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          lastError: null,
          reconnectCount: 0,
        }));

        startHeartbeat();
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const data = JSON.parse(event.data);
          
          // Handle heartbeat pong
          if (data.type === 'pong' && heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
            return;
          }

          // Handle regular messages
          onMessageRef.current(data as T);
        } catch (error) {
          console.error('WebSocket: Error parsing message', error, event.data);
          const parseError = new Error(`Failed to parse WebSocket message: ${error}`);
          
          setState(prev => ({
            ...prev,
            lastError: parseError,
          }));

          onError?.(new Event('messageerror'));
        }
      };

      ws.onerror = (event) => {
        if (!isMountedRef.current) return;

        console.error(`WebSocket: Error on ${urlRef.current} (${connectionId})`, event);
        
        const error = new Error('WebSocket connection error');
        setState(prev => ({
          ...prev,
          lastError: error,
          isConnecting: false,
        }));

        stopHeartbeat();
        onError?.(event);
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;

        console.log(`WebSocket: Disconnected from ${urlRef.current} (${connectionId}) - Code: ${event.code}, Reason: ${event.reason}`);
        
        stopHeartbeat();
        wsRef.current = null;

        setState(prev => {
          const newState = {
            ...prev,
            isConnected: false,
            isConnecting: false,
          };

          // Handle reconnection
          if (shouldReconnect(event) && prev.reconnectCount < reconnectAttempts) {
            const nextReconnectCount = prev.reconnectCount + 1;
            
            console.log(`WebSocket: Scheduling reconnect attempt ${nextReconnectCount}/${reconnectAttempts} in ${reconnectInterval}ms`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current && urlRef.current) {
                connect();
              }
            }, reconnectInterval);

            return {
              ...newState,
              reconnectCount: nextReconnectCount,
            };
          } else if (prev.reconnectCount >= reconnectAttempts) {
            console.log(`WebSocket: Max reconnect attempts reached for ${urlRef.current}`);
            
            if (event.code !== 1000 && event.code !== 1001) {
              toast.error('Connection lost. Max reconnect attempts reached.', {
                autoClose: 7000,
              });
            }
          }

          return newState;
        });

        onClose?.(event);
      };

    } catch (error) {
      console.error('WebSocket: Failed to create connection', error);
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        lastError: error as Error,
      }));
    }
  }, [
    shouldReconnect,
    reconnectInterval,
    reconnectAttempts,
    protocols,
    startHeartbeat,
    stopHeartbeat,
    onOpen,
    onClose,
    onError,
  ]);

  // Manual disconnect function
  const disconnect = useCallback((code = 1000, reason = 'Manual disconnect') => {
    setState(prev => ({
      ...prev,
      reconnectCount: reconnectAttempts + 1, // Prevent reconnection
    }));

    cleanup();
    
    console.log(`WebSocket: Manual disconnect from ${urlRef.current}`);
  }, [cleanup, reconnectAttempts]);

  // Send message function
  const sendMessage = useCallback((data: Record<string, unknown> | string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      console.debug('WebSocket: Sending message:', message);
      wsRef.current.send(message);
      return true;
    } else {
      console.warn('WebSocket: Cannot send message, connection not open');
      toast.warn('Connection not available. Message not sent.');
      return false;
    }
  }, []);

  // Main effect for connection management
  useEffect(() => {
    if (url) {
      connect();
    } else {
      cleanup();
    }

    return cleanup;
  }, [url, connect, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocketImproved;