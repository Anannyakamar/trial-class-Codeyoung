export interface TimezoneOption {
  value: string;
  label: string;
  region: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET) — New York', region: 'North America' },
  { value: 'America/Chicago', label: 'Central Time (CT) — Chicago', region: 'North America' },
  { value: 'America/Denver', label: 'Mountain Time (MT) — Denver', region: 'North America' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) — Los Angeles', region: 'North America' },
  { value: 'Europe/London', label: 'UK Time (GMT/BST) — London', region: 'Europe' },
  { value: 'Europe/Paris', label: 'Central European (CET) — Paris', region: 'Europe' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST) — Asia/Kolkata', region: 'Asia' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) — Dubai', region: 'Middle East' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT) — Singapore', region: 'Asia' },
  { value: 'Australia/Sydney', label: 'Sydney Time (AEST/AEDT) — Sydney', region: 'Australia' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)', region: 'Global' },
];

/**
 * Detects the user's current browser IANA timezone identifier.
 */
export function getUserBrowserTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'America/New_York';
  } catch {
    return 'America/New_York';
  }
}

/**
 * Formats an ISO instant into a full date and time string in a specific timezone.
 */
export function formatInstantDisplay(
  isoInstant: string,
  timeZone: string
): string {
  try {
    const date = new Date(isoInstant);
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return isoInstant;
  }
}

/**
 * Formats an ISO instant into 12-hour local time format with AM/PM (e.g. "9:30 AM").
 */
export function formatTimeOnly(
  isoInstant: string,
  timeZone: string
): string {
  try {
    const date = new Date(isoInstant);
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Formats an ISO instant into local calendar date string (e.g. "Thursday, Oct 15").
 */
export function formatDateOnly(
  isoInstant: string,
  timeZone: string
): string {
  try {
    const date = new Date(isoInstant);
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Computes the formatted UTC offset string (e.g., "UTC-4", "UTC+5:30") for an instant in a timezone.
 */
export function getFormattedUtcOffset(
  isoInstant: string,
  timeZone: string
): string {
  try {
    const date = new Date(isoInstant);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value.replace('GMT', 'UTC') : '';
  } catch {
    return '';
  }
}

/**
 * Checks if the local calendar date differs between two timezones for the same instant.
 */
export function hasCrossTimezoneDateDifference(
  isoInstant: string,
  tz1: string,
  tz2: string
): boolean {
  try {
    const date = new Date(isoInstant);
    const d1 = new Intl.DateTimeFormat('en-CA', { timeZone: tz1 }).format(date); // YYYY-MM-DD
    const d2 = new Intl.DateTimeFormat('en-CA', { timeZone: tz2 }).format(date);
    return d1 !== d2;
  } catch {
    return false;
  }
}
