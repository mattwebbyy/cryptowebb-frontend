/**
 * Single source of truth for backend endpoints.
 * Configure via .env: VITE_BACKEND_URL (and optionally VITE_WS_URL).
 */
const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? 'http://localhost:8080';

/** HTTP API origin, no trailing slash. */
export const API_BASE_URL = rawBackendUrl.replace(/\/+$/, '');

/** WebSocket origin, no trailing slash. Derived from API_BASE_URL unless VITE_WS_URL is set. */
export const WS_BASE_URL =
  (import.meta.env.VITE_WS_URL as string | undefined)?.replace(/\/+$/, '') ||
  API_BASE_URL.replace(/^http/, 'ws');
