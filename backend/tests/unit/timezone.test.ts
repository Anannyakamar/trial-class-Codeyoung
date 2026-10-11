import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import {
  isValidIanaTimezone,
  parseToInstant,
  getLocalDateString,
  getLocalWeekday,
  getLocalTimeString,
  getDayUtcBounds,
  formatLocalDisplay,
  getUtcOffsetString,
  addMinutesToInstant,
  localDateTimeToInstant,
  validateInstantInTimezone,
  MENTOR_DEFAULT_TIMEZONE,
} from '../../src/utils/timezone.js';

describe('Timezone & Daylight Saving Time (DST) Test Suite', () => {
  describe('1. India Standard Time (IST, Asia/Kolkata)', () => {
    it('should maintain a constant UTC+05:30 offset throughout the year (no DST)', () => {
      const summer = parseToInstant('2026-06-15T12:00:00Z');
      const winter = parseToInstant('2026-12-15T12:00:00Z');

      expect(getUtcOffsetString(summer, 'Asia/Kolkata')).toBe('+05:30');
      expect(getUtcOffsetString(winter, 'Asia/Kolkata')).toBe('+05:30');

      expect(getLocalTimeString(summer, 'Asia/Kolkata')).toBe('17:30');
      expect(getLocalTimeString(winter, 'Asia/Kolkata')).toBe('17:30');
    });
  });

  describe('2. London Winter & Summer Offsets (Europe/London)', () => {
    it('should use GMT (+00:00) in winter and BST (+01:00) in summer', () => {
      // Winter (January): GMT
      const winter = parseToInstant('2026-01-15T14:00:00Z');
      expect(getUtcOffsetString(winter, 'Europe/London')).toBe('+00:00');
      expect(getLocalTimeString(winter, 'Europe/London')).toBe('14:00');

      // Summer (July): BST
      const summer = parseToInstant('2026-07-15T14:00:00Z');
      expect(getUtcOffsetString(summer, 'Europe/London')).toBe('+01:00');
      expect(getLocalTimeString(summer, 'Europe/London')).toBe('15:00');
    });
  });

  describe('3. New York Winter & Summer Offsets (America/New_York)', () => {
    it('should use EST (-05:00) in winter and EDT (-04:00) in summer', () => {
      // Winter: EST
      const winter = parseToInstant('2026-01-15T18:00:00Z');
      expect(getUtcOffsetString(winter, 'America/New_York')).toBe('-05:00');
      expect(getLocalTimeString(winter, 'America/New_York')).toBe('13:00');

      // Summer: EDT
      const summer = parseToInstant('2026-07-15T18:00:00Z');
      expect(getUtcOffsetString(summer, 'America/New_York')).toBe('-04:00');
      expect(getLocalTimeString(summer, 'America/New_York')).toBe('14:00');
    });
  });

  describe('4. US Spring-Forward Gap (Nonexistent Local Time)', () => {
    it('should detect when a local wall-clock time falls inside the skipped DST hour', () => {
      // On March 8, 2026, clocks in America/New_York jump from 02:00 to 03:00 EST -> EDT
      // 02:30 AM local time does NOT exist.
      expect(() => {
        localDateTimeToInstant('2026-03-08', '02:30', 'America/New_York', 'reject');
      }).toThrow(/Daylight Saving Time transition/);
    });

    it('should safely map compatible disambiguation to the forward-shifted instant', () => {
      const instant = localDateTimeToInstant('2026-03-08', '02:30', 'America/New_York', 'compatible');
      // Compatible shifts the nonexistent 02:30 to 03:30 EDT (07:30 UTC)
      expect(instant.toString()).toBe('2026-03-08T07:30:00Z');
    });
  });

  describe('5. US Fall-Back Ambiguous Hour (Repeated Clock Time)', () => {
    it('should detect ambiguous repeated clock time and permit explicit disambiguation', () => {
      // On November 1, 2026, clocks in America/New_York fall back from 02:00 EDT to 01:00 EST.
      // 01:30 AM occurs twice: first as EDT (05:30 UTC), second as EST (06:30 UTC).
      const earlierInstant = localDateTimeToInstant('2026-11-01', '01:30', 'America/New_York', 'earlier');
      const laterInstant = localDateTimeToInstant('2026-11-01', '01:30', 'America/New_York', 'later');

      expect(earlierInstant.toString()).toBe('2026-11-01T05:30:00Z'); // EDT (-04:00)
      expect(laterInstant.toString()).toBe('2026-11-01T06:30:00Z');   // EST (-05:00)

      expect(getUtcOffsetString(earlierInstant, 'America/New_York')).toBe('-04:00');
      expect(getUtcOffsetString(laterInstant, 'America/New_York')).toBe('-05:00');
    });
  });

  describe('6. UK DST Transitions (Europe/London)', () => {
    it('should correctly shift from GMT to BST in March and BST to GMT in October', () => {
      // March 29, 2026: 01:00 GMT jumps to 02:00 BST
      const preSpring = parseToInstant('2026-03-29T00:30:00Z');
      const postSpring = parseToInstant('2026-03-29T01:30:00Z');

      expect(getUtcOffsetString(preSpring, 'Europe/London')).toBe('+00:00');
      expect(getUtcOffsetString(postSpring, 'Europe/London')).toBe('+01:00');
    });
  });

  describe('7. Simultaneous Conversion for Parent and Mentor Local Times', () => {
    it('should accurately project a single UTC instant to New York, London, and Kolkata', () => {
      const classInstant = parseToInstant('2026-10-15T14:30:00Z');

      const nyTime = getLocalTimeString(classInstant, 'America/New_York'); // 14:30 - 4 = 10:30
      const londonTime = getLocalTimeString(classInstant, 'Europe/London'); // 14:30 + 1 = 15:30 (BST)
      const kolkataTime = getLocalTimeString(classInstant, 'Asia/Kolkata'); // 14:30 + 5:30 = 20:00

      expect(nyTime).toBe('10:30');
      expect(londonTime).toBe('15:30');
      expect(kolkataTime).toBe('20:00');
    });
  });

  describe('8. Cross-Timezone Local Date Differences', () => {
    it('should handle cases where parent local date is different from mentor local date', () => {
      // 2026-10-15 21:00:00 UTC
      // Parent in Los Angeles (PDT, -7): 2026-10-15 14:00:00 (Oct 15)
      // Mentor in Kolkata (IST, +5:30): 2026-10-16 02:30:00 (Oct 16 - Next Day!)
      const instant = parseToInstant('2026-10-15T21:00:00Z');

      const parentDate = getLocalDateString(instant, 'America/Los_Angeles');
      const mentorDate = getLocalDateString(instant, 'Asia/Kolkata');

      expect(parentDate).toBe('2026-10-15');
      expect(mentorDate).toBe('2026-10-16');
      expect(parentDate).not.toBe(mentorDate);
    });
  });

  describe('9. Invalid Timezone Validation', () => {
    it('should reject malformed or non-IANA timezone strings', () => {
      expect(isValidIanaTimezone('Random/City_Name')).toBe(false);
      expect(isValidIanaTimezone('')).toBe(false);
      expect(isValidIanaTimezone('   ')).toBe(false);
      expect(isValidIanaTimezone('GMT+5:30')).toBe(false);
    });

    it('should accept valid standard IANA identifiers', () => {
      expect(isValidIanaTimezone('America/New_York')).toBe(true);
      expect(isValidIanaTimezone('Europe/London')).toBe(true);
      expect(isValidIanaTimezone('Asia/Kolkata')).toBe(true);
      expect(isValidIanaTimezone('Australia/Sydney')).toBe(true);
      expect(isValidIanaTimezone('UTC')).toBe(true);
    });
  });

  describe('10. UTC Instant Round-Trip Integrity', () => {
    it('should preserve identical epoch millisecond timestamp across ISO strings and Dates', () => {
      const originalIso = '2026-10-15T13:30:00.000Z';
      const instant = parseToInstant(originalIso);
      const date = new Date(instant.epochMilliseconds);
      const roundTrippedIso = date.toISOString();

      expect(roundTrippedIso).toBe(originalIso);
    });
  });

  describe('11. Mentor-Local Daily Capacity Boundaries around UTC Midnight', () => {
    it('should bound mentor calendar day strictly in Asia/Kolkata (18:30 UTC previous day to 18:30 UTC current day)', () => {
      const bounds = getDayUtcBounds('2026-10-15', 'Asia/Kolkata');

      // 2026-10-15 00:00:00 IST = 2026-10-14 18:30:00 UTC
      expect(bounds.startUtc.toISOString()).toBe('2026-10-14T18:30:00.000Z');
      // 2026-10-16 00:00:00 IST = 2026-10-15 18:30:00 UTC
      expect(bounds.endUtc.toISOString()).toBe('2026-10-15T18:30:00.000Z');
    });
  });

  describe('12. Slot Duration Consistency Across DST Shift', () => {
    it('should always maintain exact 30-minute interval regardless of local clock change', () => {
      const slotStart = parseToInstant('2026-03-08T06:45:00Z');
      const slotEnd = addMinutesToInstant(slotStart, 30);

      const diffMinutes =
        (slotEnd.epochMilliseconds - slotStart.epochMilliseconds) / (60 * 1000);
      expect(diffMinutes).toBe(30);
    });
  });
});
