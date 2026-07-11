// src/lib/flags.ts — minimal feature-flag system (LaunchDarkly-lite).
// Resolution order: localStorage override → VITE_* env default.
// Overrides survive reloads, so demo/mock mode can be flipped at runtime
// without a rebuild; unset the override to fall back to the env value.
import { useSyncExternalStore } from 'react';

export type FlagName = 'mockData';

const ENV_DEFAULTS: Record<FlagName, boolean> = {
  // Serve generated demo data instead of calling the backend indexer proxy —
  // for dev/demo while the chain backfill is still running.
  mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
};

const storageKey = (name: FlagName) => `cw:flag:${name}`;
const FLAGS_EVENT = 'cw:flags-changed';

export function flagEnabled(name: FlagName): boolean {
  try {
    const override = localStorage.getItem(storageKey(name));
    if (override !== null) return override === 'true';
  } catch {
    /* storage unavailable (SSR/incognito) — env default applies */
  }
  return ENV_DEFAULTS[name];
}

/** Set a runtime override (`null` clears it back to the env default). */
export function setFlagOverride(name: FlagName, value: boolean | null): void {
  try {
    if (value === null) {
      localStorage.removeItem(storageKey(name));
    } else {
      localStorage.setItem(storageKey(name), String(value));
    }
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(FLAGS_EVENT));
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(FLAGS_EVENT, onChange);
  window.addEventListener('storage', onChange); // cross-tab
  return () => {
    window.removeEventListener(FLAGS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** Reactive flag read for components. */
export function useFlag(name: FlagName): boolean {
  return useSyncExternalStore(subscribe, () => flagEnabled(name));
}
