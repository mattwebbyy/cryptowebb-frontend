// src/hooks/useCryptoWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  metricId?: number;
  data: any;
  timestamp: string;
  error?: string;
}

interface LiveDataPoint {
  metricId: number;
  metricName: string;
  value: number | null;
  change24h?: number;
  changePerc?: number;
  timestamp: string;
  granularity: string;
}

interface UseCryptoWebSocketOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useCryptoWebSocket = (
  metricId?: number,
  options: UseCryptoWebSocketOptions = {}
) => {
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onError,
    onConnect,
    onDisconnect
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState<Record<number, LiveDataPoint>>({});
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribedMetricsRef = useRef<Set<number>>(new Set());

  // Get WebSocket URL - adjust based on your backend configuration
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NODE_ENV === 'development' 
      ? 'localhost:8080' 
      : window.location.host;
    
    if (metricId) {
      return `${protocol}//${host}/api/v1/ws/metrics/${metricId}/live`;
    }
    return `${protocol}//${host}/api/v1/ws/live`;
  }, [metricId]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = getWebSocketUrl();
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
        onConnect?.();

        // Re-subscribe to metrics after reconnection
        subscribedMetricsRef.current.forEach(metricId => {
          subscribe(metricId);
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'live_data':
              const liveDataPoint = message.data as LiveDataPoint;
              setLiveData(prev => ({
                ...prev,
                [liveDataPoint.metricId]: liveDataPoint
              }));
              break;
              
            case 'metric_info':
              // Received metric info
              break;
              
            case 'subscribed':
              // Successfully subscribed to metric
              break;
              
            case 'unsubscribed':
              // Successfully unsubscribed from metric
              break;
              
            case 'pong':
              // Handle ping/pong for connection health
              break;
              
            case 'alert':
              // Handle alert notifications
              break;
              
            case 'error':
              setConnectionError(message.error || 'Unknown error');
              break;
              
            default:
              // Unknown message type
          }
        } catch (error) {
          setConnectionError('Error parsing message');
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionError('Connection error');
        onError?.(error);
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        onDisconnect?.();

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

    } catch (error) {
      setConnectionError('Failed to connect');
    }
  }, [getWebSocketUrl, autoReconnect, maxReconnectAttempts, reconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    subscribedMetricsRef.current.clear();
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // WebSocket is not connected - message not sent
    }
  }, []);

  const subscribe = useCallback((metricId: number) => {
    subscribedMetricsRef.current.add(metricId);
    sendMessage({
      type: 'subscribe',
      data: metricId
    });
  }, [sendMessage]);

  const unsubscribe = useCallback((metricId: number) => {
    subscribedMetricsRef.current.delete(metricId);
    sendMessage({
      type: 'unsubscribe',
      data: metricId
    });
  }, [sendMessage]);

  const ping = useCallback(() => {
    sendMessage({
      type: 'ping',
      data: { timestamp: new Date().toISOString() }
    });
  }, [sendMessage]);

  // Auto-connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Auto-subscribe to the metricId if provided
  useEffect(() => {
    if (metricId && isConnected) {
      subscribe(metricId);
    }
  }, [metricId, isConnected, subscribe]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    liveData,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    ping,
    sendMessage,
    // Helper functions
    getLiveDataForMetric: (metricId: number) => liveData[metricId],
    isSubscribedTo: (metricId: number) => subscribedMetricsRef.current.has(metricId),
    getSubscribedMetrics: () => Array.from(subscribedMetricsRef.current),
  };
};

export default useCryptoWebSocket;