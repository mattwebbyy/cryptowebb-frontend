// src/hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  shouldReconnect?: (event: CloseEvent) => boolean;
  reconnectInterval?: number; // milliseconds
  reconnectAttempts?: number;
}

const DEFAULT_RECONNECT_INTERVAL = 3000;
const DEFAULT_RECONNECT_ATTEMPTS = 5;

export const useWebSocket = <T = any>(
  url: string | null, // Allow null URL to disable connection initially
  onMessage: (data: T) => void,
  options: WebSocketOptions = {}
) => {
  const {
    onOpen,
    onClose,
    onError,
    shouldReconnect = (event) => event.code !== 1000, // Don't reconnect on normal close
    reconnectInterval = DEFAULT_RECONNECT_INTERVAL,
    reconnectAttempts = DEFAULT_RECONNECT_ATTEMPTS,
  } = options;

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  // Keep track if a connection attempt is in progress
  const isConnecting = useRef(false); 

  const connect = useCallback(() => {
    if (!url || ws.current || isConnecting.current) {
      if(ws.current) console.debug('WebSocket: Already connected/connecting.');
      if(!url) console.debug('WebSocket: No URL provided.');
      return; // Don't connect if URL is null, connection exists, or connection attempt is in progress
    }

    isConnecting.current = true; // Mark as connecting
    console.log(`WebSocket: Attempting to connect to ${url}...`);
    ws.current = new WebSocket(url);
    // Reset attempts ONLY when initiating a NEW connection sequence
    // Do not reset on automatic reconnect attempts
    if (reconnectAttempt.current === 0) { 
         console.log("WebSocket: Resetting reconnect attempts for new connection.");
    }

    ws.current.onopen = (event) => {
      console.log(`WebSocket: Connected to ${url}`);
      isConnecting.current = false; // Connection successful
      setIsConnected(true);
      reconnectAttempt.current = 0; // Reset attempts on successful connection
      onOpen?.(event);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as T;
        onMessage(data);
      } catch (error) {
        console.error('WebSocket: Error parsing message - ', error, event.data);
        // Use generic Event for onError callback consistency
        const errorEvent = new Event('messageerror'); 
        (errorEvent as any).message = 'Failed to parse message'; // Add message property
        onError?.(errorEvent);
      }
    };

    ws.current.onerror = (event) => {
      console.error(`WebSocket: Error on ${url} - `, event);
       isConnecting.current = false; // Connection attempt failed
      onError?.(event);
      // Note: The 'onclose' event will usually fire immediately after 'onerror'
    };

    ws.current.onclose = (event) => {
      console.log(`WebSocket: Disconnected from ${url} - Code: ${event.code}, Reason: ${event.reason}`);
      isConnecting.current = false; // Connection attempt ended (successfully or not)
      setIsConnected(false);
      const currentWs = ws.current; // Capture current ref before setting to null
      ws.current = null; // Ensure ws ref is cleared
      onClose?.(event);

      // Reconnection logic
      if (shouldReconnect(event) && reconnectAttempt.current < reconnectAttempts) {
        reconnectAttempt.current++;
        console.log(`WebSocket: Reconnect attempt <span class="math-inline">\{reconnectAttempt\.current\}/</span>{reconnectAttempts} in ${reconnectInterval}ms...`);
        setTimeout(connect, reconnectInterval);
      } else if (reconnectAttempt.current >= reconnectAttempts) {
        console.log(`WebSocket: Max reconnect attempts reached for ${url}.`);
        if (event.code !== 1000) { // Don't toast on normal closure
             toast.error(`WebSocket connection lost. Max reconnect attempts reached.`, { autoClose: 7000 });
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, /* Exclude onMessage if it changes frequently */ onOpen, onClose, onError, shouldReconnect, reconnectInterval, reconnectAttempts]); 

  const disconnect = useCallback((code = 1000, reason = 'Manual disconnection') => {
    if (ws.current) {
      console.log(`WebSocket: Manually disconnecting from ${url}`);
      // Set attempts high to prevent immediate reconnect after manual close
      reconnectAttempt.current = reconnectAttempts + 1; 
      ws.current.close(code, reason); 
      ws.current = null;
      setIsConnected(false);
      isConnecting.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, reconnectAttempts]); 

  // Effect to connect and disconnect based on URL presence
  useEffect(() => {
    if (url) {
        // Reset reconnect attempts when URL changes or component mounts with a valid URL
        reconnectAttempt.current = 0; 
        connect();
    } else {
        disconnect(); // Disconnect if URL becomes null
    }

    // Cleanup on unmount OR when URL changes
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]); 

  // Function to manually send messages
  const sendMessage = useCallback((data: Record<string, unknown> | string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
       console.debug("WebSocket: Sending message:", message)
      ws.current.send(message);
    } else {
      console.warn('WebSocket: Attempted to send message, but connection is not open.');
      toast.warn('WebSocket is not connected. Message not sent.');
    }
  }, []);

  return { isConnected, sendMessage };
};