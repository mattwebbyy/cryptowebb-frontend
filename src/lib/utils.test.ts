import { afterEach, describe, expect, it, vi } from 'vitest';
import { cn, generateRandomChar, randomRange } from './utils';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cn', () => {
  it('merges Tailwind classes giving precedence to the latest duplicates', () => {
    expect(cn('p-2', 'text-sm', 'p-4')).toBe('text-sm p-4');
  });

  it('filters out falsy values and keeps truthy conditional classes', () => {
    const result = cn('bg-red-500', ['text-white', undefined], { 'p-2': false, 'p-4': true });
    expect(result).toBe('bg-red-500 text-white p-4');
  });
});

describe('generateRandomChar', () => {
  it('returns a predictable character when Math.random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.75);
    expect(generateRandomChar('abcd')).toBe('d');
  });

  it('returns undefined when provided string is empty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    expect(generateRandomChar('')).toBeUndefined();
  });
});

describe('randomRange', () => {
  it('scales Math.random output to the requested range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomRange(10, 20)).toBeCloseTo(15, 5);
  });

  it('resolves to the lower bound when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomRange(5, 9)).toBe(5);
  });

  it('returns the lower bound when min and max are equal', () => {
    expect(randomRange(7, 7)).toBe(7);
  });
});
