// src/test/setup.ts
import '@testing-library/jest-dom';

// Ensure Jest globals are available
import { jest } from '@jest/globals';

// Make jest available globally for tests
globalThis.jest = jest;