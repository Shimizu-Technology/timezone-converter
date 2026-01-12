import { describe, it, expect } from 'vitest';
import {
  parseTime,
  convertTime,
  getTimezoneInfo,
  isValidTimezone,
  convertToMultipleTimezones,
  formatTimezoneOffset
} from './timezoneUtils';

describe('timezoneUtils', () => {
  describe('parseTime', () => {
    it('should parse 24-hour format correctly', () => {
      const result = parseTime('15:00');
      expect(result.time).toBe('15:00');
      expect(result.isNow).toBe(false);
    });

    it('should parse 12-hour format with pm', () => {
      const result = parseTime('3pm');
      expect(result.time).toBe('15:00');
      expect(result.isNow).toBe(false);
    });

    it('should parse 12-hour format with am', () => {
      const result = parseTime('9am');
      expect(result.time).toBe('09:00');
      expect(result.isNow).toBe(false);
    });

    it('should parse 12-hour format with minutes', () => {
      const result = parseTime('3:30 PM');
      expect(result.time).toBe('15:30');
      expect(result.isNow).toBe(false);
    });

    it('should parse noon correctly', () => {
      const result = parseTime('12pm');
      expect(result.time).toBe('12:00');
      expect(result.isNow).toBe(false);
    });

    it('should parse midnight correctly', () => {
      const result = parseTime('12am');
      expect(result.time).toBe('00:00');
      expect(result.isNow).toBe(false);
    });

    it('should handle "now" keyword', () => {
      const result = parseTime('now');
      expect(result.isNow).toBe(true);
      expect(result.time).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should throw error for invalid input', () => {
      expect(() => parseTime('invalid')).toThrow();
    });
  });

  describe('convertTime', () => {
    it('should convert EST to PST correctly', () => {
      const result = convertTime('15:00', 'America/New_York', 'America/Los_Angeles');
      expect(result.time).toBe('12:00 PM');
      expect(result.timezoneInfo.timezone).toBe('America/Los_Angeles');
    });

    it('should convert EST to JST correctly', () => {
      const result = convertTime('15:00', 'America/New_York', 'Asia/Tokyo');
      expect(result.time).toBe('5:00 AM');
      expect(result.timezoneInfo.timezone).toBe('Asia/Tokyo');
    });

    it('should detect day boundary crossing', () => {
      const result = convertTime('23:00', 'America/New_York', 'Asia/Tokyo');
      expect(result.isDifferentDay).toBe(true);
    });

    it('should handle GMT to EST conversion', () => {
      const result = convertTime('12:00', 'Europe/London', 'America/New_York');
      expect(result.time).toMatch(/AM/);
      expect(result.timezoneInfo.timezone).toBe('America/New_York');
    });
  });

  describe('getTimezoneInfo', () => {
    it('should return timezone info with correct structure', () => {
      const info = getTimezoneInfo('America/New_York');
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('timezone');
      expect(info).toHaveProperty('displayName');
      expect(info).toHaveProperty('abbreviation');
      expect(info.timezone).toBe('America/New_York');
    });

    it('should format timezone name correctly', () => {
      const info = getTimezoneInfo('America/Los_Angeles');
      expect(info.displayName).toContain('Los Angeles');
    });
  });

  describe('isValidTimezone', () => {
    it('should return true for valid timezones', () => {
      expect(isValidTimezone('America/New_York')).toBe(true);
      expect(isValidTimezone('Europe/London')).toBe(true);
      expect(isValidTimezone('Asia/Tokyo')).toBe(true);
    });

    it('should return false for invalid timezones', () => {
      expect(isValidTimezone('Invalid/Timezone')).toBe(false);
      expect(isValidTimezone('Not_A_Real_Place')).toBe(false);
    });
  });

  describe('convertToMultipleTimezones', () => {
    it('should convert to multiple timezones at once', () => {
      const results = convertToMultipleTimezones(
        '15:00',
        'America/New_York',
        ['America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']
      );

      expect(results).toHaveLength(3);
      expect(results[0].timezoneInfo.timezone).toBe('America/Los_Angeles');
      expect(results[1].timezoneInfo.timezone).toBe('Europe/London');
      expect(results[2].timezoneInfo.timezone).toBe('Asia/Tokyo');
    });
  });

  describe('formatTimezoneOffset', () => {
    it('should format positive offsets correctly', () => {
      const offset = formatTimezoneOffset('Asia/Tokyo');
      expect(offset).toMatch(/GMT\+/);
    });

    it('should format negative offsets correctly', () => {
      const offset = formatTimezoneOffset('America/New_York');
      expect(offset).toMatch(/GMT-/);
    });

    it('should handle UTC correctly', () => {
      const offset = formatTimezoneOffset('UTC');
      expect(offset).toBe('GMT+0');
    });
  });
});
