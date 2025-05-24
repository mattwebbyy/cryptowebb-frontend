// src/lib/utils.test.ts
import { generateRandomChar, randomRange } from './utils';

describe('Utility Functions', () => {
  describe('generateRandomChar', () => {
    it('should return a character from the provided string', () => {
      const chars = 'abc';
      const result = generateRandomChar(chars);
      expect(chars).toContain(result);
      expect(result).toHaveLength(1);
    });

    it('should handle an empty string', () => {
      const chars = '';
      const result = generateRandomChar(chars);
      expect(result).toBeUndefined(); // Or expect it to throw, depending on desired behavior
    });
  });

  describe('randomRange', () => {
    it('should return a number within the specified range', () => {
      const min = 10;
      const max = 20;
      const result = randomRange(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThan(max); // Math.random() is exclusive of 1
    });

    it('should handle min and max being the same', () => {
      const min = 15;
      const max = 15;
      const result = randomRange(min, max);
      expect(result).toBe(min);
    });
  });
});