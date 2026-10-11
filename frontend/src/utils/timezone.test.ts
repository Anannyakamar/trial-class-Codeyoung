import { describe, it, expect } from 'vitest';
import {
  getUserBrowserTimezone,
  formatInstantDisplay,
  formatTimeOnly,
  formatDateOnly,
  getFormattedUtcOffset,
  hasCrossTimezoneDateDifference,
  COMMON_TIMEZONES,
} from './timezone.js';

describe('Frontend Timezone Utilities', () => {
  it('should include major supported regions in COMMON_TIMEZONES', () => {
    const tzValues = COMMON_TIMEZONES.map((t) => t.value);
    expect(tzValues).toContain('Asia/Kolkata');
    expect(tzValues).toContain('America/New_York');
    expect(tzValues).toContain('Europe/London');
  });

  it('should detect a valid browser timezone string', () => {
    const tz = getUserBrowserTimezone();
    expect(typeof tz).toBe('string');
    expect(tz.length).toBeGreaterThan(0);
  });

  it('should format time only in 12-hour AM/PM format', () => {
    const instant = '2026-10-15T14:30:00.000Z';
    // 14:30 UTC = 10:30 AM EDT
    const formatted = formatTimeOnly(instant, 'America/New_York');
    expect(formatted).toBe('10:30 AM');
  });

  it('should format date only with weekday and month', () => {
    const instant = '2026-10-15T14:30:00.000Z';
    const formatted = formatDateOnly(instant, 'America/New_York');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('15');
  });

  it('should format full instant display with timezone name', () => {
    const instant = '2026-10-15T14:30:00.000Z';
    const formatted = formatInstantDisplay(instant, 'America/New_York');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('10:30');
  });

  it('should compute formatted UTC offset string', () => {
    const instant = '2026-10-15T14:30:00.000Z';
    const offset = getFormattedUtcOffset(instant, 'America/New_York');
    expect(offset).toBe('UTC-04:00');
  });

  it('should detect cross-timezone calendar date differences', () => {
    // 2026-10-15 22:00:00 UTC is Oct 15 in New York (18:00 EDT) but Oct 16 in Kolkata (03:30 IST)
    const instant = '2026-10-15T22:00:00.000Z';
    const diff = hasCrossTimezoneDateDifference(instant, 'America/New_York', 'Asia/Kolkata');
    expect(diff).toBe(true);
  });
});
