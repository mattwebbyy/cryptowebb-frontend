// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { TextDecoder, TextEncoder } from 'util';
import './env-setup';

// Ensure DOM is cleaned between tests
afterEach(() => {
  cleanup();
});

// Provide TextEncoder/TextDecoder when running in Node
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  // Vitest runs in Node so util.TextDecoder is acceptable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

// Vitest exposes vi instead of jest; some legacy code may expect jest global
if (!globalThis.jest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.jest = vi as unknown as any;
}
