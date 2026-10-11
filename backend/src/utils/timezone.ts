import { Temporal } from '@js-temporal/polyfill';

export const MENTOR_DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Common supported IANA Timezones for Codeyoung trial bookings
 */
export const SUPPORTED_TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
  'UTC',
] as const;

/**
 * Validates whether a string is a recognized IANA timezone identifier.
 */
export function isValidIanaTimezone(tz: string): boolean {
  if (!tz || typeof tz !== 'string' || tz.trim() === '') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses an ISO 8601 string or Date object into a Temporal.Instant.
 */
export function parseToInstant(value: string | Date): Temporal.Instant {
  if (value instanceof Date) {
    return Temporal.Instant.fromEpochMilliseconds(value.getTime());
  }
  return Temporal.Instant.from(value);
}

/**
 * Returns the calendar date string ('YYYY-MM-DD') for an instant in a given timezone.
 */
export function getLocalDateString(
  instant: Temporal.Instant | string | Date,
  timeZone: string = MENTOR_DEFAULT_TIMEZONE
): string {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const zonedDateTime = inst.toZonedDateTimeISO(timeZone);
  return zonedDateTime.toPlainDate().toString();
}

/**
 * Returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * for an instant in a given timezone.
 */
export function getLocalWeekday(
  instant: Temporal.Instant | string | Date,
  timeZone: string = MENTOR_DEFAULT_TIMEZONE
): number {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const zonedDateTime = inst.toZonedDateTimeISO(timeZone);
  const dow = zonedDateTime.dayOfWeek;
  return dow === 7 ? 0 : dow;
}

/**
 * Returns the local time in "HH:mm" 24h format for an instant in a given timezone.
 */
export function getLocalTimeString(
  instant: Temporal.Instant | string | Date,
  timeZone: string
): string {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const zdt = inst.toZonedDateTimeISO(timeZone);
  const hour = String(zdt.hour).padStart(2, '0');
  const minute = String(zdt.minute).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * Returns the formatted UTC offset string (e.g. '+05:30', '-04:00', 'Z') for an instant in a given timezone.
 */
export function getUtcOffsetString(
  instant: Temporal.Instant | string | Date,
  timeZone: string
): string {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const zdt = inst.toZonedDateTimeISO(timeZone);
  return zdt.offset;
}

/**
 * Returns the UTC Date boundaries (start and end) for a whole calendar day in a specific timezone.
 */
export function getDayUtcBounds(
  dateString: string, // "YYYY-MM-DD"
  timeZone: string = MENTOR_DEFAULT_TIMEZONE
): { startUtc: Date; endUtc: Date } {
  const plainDate = Temporal.PlainDate.from(dateString);
  const startZdt = plainDate.toZonedDateTime({
    timeZone,
    plainTime: Temporal.PlainTime.from('00:00:00'),
  });
  const nextDay = plainDate.add({ days: 1 });
  const endZdt = nextDay.toZonedDateTime({
    timeZone,
    plainTime: Temporal.PlainTime.from('00:00:00'),
  });

  return {
    startUtc: new Date(startZdt.epochMilliseconds),
    endUtc: new Date(endZdt.epochMilliseconds),
  };
}

/**
 * Formats an instant in a human-readable format with time and timezone name/offset.
 */
export function formatLocalDisplay(
  instant: Temporal.Instant | string | Date,
  timeZone: string
): string {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const date = new Date(inst.epochMilliseconds);
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Adds minutes to an instant and returns the new instant.
 */
export function addMinutesToInstant(
  instant: Temporal.Instant,
  minutes: number
): Temporal.Instant {
  return instant.add({ minutes });
}

/**
 * Validates if an instant is in the future compared to now.
 */
export function isInstantInFuture(
  instant: Temporal.Instant,
  bufferMinutes: number = 5
): boolean {
  const now = Temporal.Now.instant();
  const minAllowed = now.add({ minutes: bufferMinutes });
  return Temporal.Instant.compare(instant, minAllowed) > 0;
}

/**
 * Converts a local calendar date and local time string into an exact UTC Temporal.Instant.
 * Disambiguation options:
 * - 'reject': Throws error if local time falls into a spring-forward gap (nonexistent) or fall-back overlap (ambiguous).
 * - 'compatible' (default): Shifts spring-forward forward and uses earlier time for fall-back.
 * - 'earlier': Uses earlier transition instant.
 * - 'later': Uses later transition instant.
 */
export function localDateTimeToInstant(
  dateString: string, // "YYYY-MM-DD"
  timeString: string, // "HH:mm"
  timeZone: string,
  disambiguation: 'compatible' | 'reject' | 'earlier' | 'later' = 'compatible'
): Temporal.Instant {
  try {
    const pdt = Temporal.PlainDateTime.from(`${dateString}T${timeString}`);
    const zdt = pdt.toZonedDateTime(timeZone, { disambiguation });
    return zdt.toInstant();
  } catch (err: unknown) {
    throw new Error(
      `The local time ${dateString} ${timeString} is invalid in timezone ${timeZone} due to Daylight Saving Time transition: ${(err as Error).message}`
    );
  }
}

/**
 * Validates if a given ISO 8601 instant corresponds to a valid, non-gap wall clock time in a timezone.
 */
export function validateInstantInTimezone(
  instant: Temporal.Instant | string | Date,
  timeZone: string
): { isValid: boolean; localDate: string; localTime: string; offset: string } {
  const inst = typeof instant === 'string' || instant instanceof Date ? parseToInstant(instant) : instant;
  const zdt = inst.toZonedDateTimeISO(timeZone);
  return {
    isValid: true,
    localDate: zdt.toPlainDate().toString(),
    localTime: getLocalTimeString(inst, timeZone),
    offset: zdt.offset,
  };
}
