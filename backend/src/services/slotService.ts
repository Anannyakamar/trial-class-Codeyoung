import { Temporal } from '@js-temporal/polyfill';
import { prisma } from '../db/prisma.js';
import {
  parseToInstant,
  getLocalDateString,
  getLocalWeekday,
  getLocalTimeString,
  getDayUtcBounds,
  formatLocalDisplay,
  getUtcOffsetString,
  MENTOR_DEFAULT_TIMEZONE,
  addMinutesToInstant,
  isInstantInFuture,
} from '../utils/timezone.js';

export interface BookableSlot {
  startAt: string; // ISO 8601 UTC
  endAt: string; // ISO 8601 UTC
  parentLocalDate: string;
  parentLocalTime: string;
  parentDisplay: string;
  parentUtcOffset: string;
  mentorLocalDate: string;
  mentorLocalTime: string;
  availableMentorsCount: number;
}

export const slotService = {
  /**
   * Generates all available trial class slots for a parent on a given calendar date in their timezone.
   */
  async getAvailableSlots(
    dateString: string,
    parentTimezone: string,
    durationMinutes: number = 30
  ): Promise<BookableSlot[]> {
    // 1. Get UTC range for the parent's requested calendar day
    const { startUtc: parentDayStartUtc, endUtc: parentDayEndUtc } = getDayUtcBounds(
      dateString,
      parentTimezone
    );

    // 2. Fetch all active mentors with availabilities and confirmed bookings in a wide window around this day
    // Window expanded +/- 24 hours to cover cross-timezone boundaries (e.g. US to IST)
    const windowStartUtc = new Date(parentDayStartUtc.getTime() - 24 * 60 * 60 * 1000);
    const windowEndUtc = new Date(parentDayEndUtc.getTime() + 24 * 60 * 60 * 1000);

    const mentors = await prisma.mentor.findMany({
      where: { isActive: true },
      include: {
        availabilities: {
          where: { isActive: true },
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
            startAt: { gte: windowStartUtc, lte: windowEndUtc },
          },
        },
      },
    });

    const bookableSlots: BookableSlot[] = [];

    // 3. Step through the parent's calendar day in 30-minute intervals
    let currentInstant = parseToInstant(parentDayStartUtc);
    const endInstant = parseToInstant(parentDayEndUtc);

    while (Temporal.Instant.compare(currentInstant, endInstant) < 0) {
      const slotStartUtc = new Date(currentInstant.epochMilliseconds);
      const slotEndInstant = addMinutesToInstant(currentInstant, durationMinutes);
      const slotEndUtc = new Date(slotEndInstant.epochMilliseconds);

      // Skip past slots (must be at least 5 minutes in the future)
      if (isInstantInFuture(currentInstant)) {
        // Evaluate mentor availability for this slot in Asia/Kolkata
        const mentorWeekday = getLocalWeekday(currentInstant, MENTOR_DEFAULT_TIMEZONE);
        const slotStartTimeStr = getLocalTimeString(currentInstant, MENTOR_DEFAULT_TIMEZONE);
        const slotEndTimeStr = getLocalTimeString(slotEndInstant, MENTOR_DEFAULT_TIMEZONE);
        const mentorLocalDate = getLocalDateString(currentInstant, MENTOR_DEFAULT_TIMEZONE);

        // Get mentor day bounds to count daily confirmed classes
        const { startUtc: mentorDayStartUtc, endUtc: mentorDayEndUtc } = getDayUtcBounds(
          mentorLocalDate,
          MENTOR_DEFAULT_TIMEZONE
        );

        let availableMentorsCount = 0;

        for (const mentor of mentors) {
          // Check if mentor has weekly availability covering this weekday & time
          const hasAvailability = mentor.availabilities.some((avail) => {
            if (avail.weekday !== mentorWeekday) return false;
            return avail.startTime <= slotStartTimeStr && avail.endTime >= slotEndTimeStr;
          });

          if (!hasAvailability) continue;

          // Check if mentor has an overlapping confirmed booking
          const hasOverlap = mentor.bookings.some((b) => {
            return b.startAt < slotEndUtc && b.endAt > slotStartUtc;
          });

          if (hasOverlap) continue;

          // Check if mentor has reached max 2 confirmed classes on this mentor calendar day
          const dailyBookingsCount = mentor.bookings.filter((b) => {
            return b.startAt >= mentorDayStartUtc && b.startAt < mentorDayEndUtc;
          }).length;

          if (dailyBookingsCount >= 2) continue;

          // Mentor is available
          availableMentorsCount++;
        }

        if (availableMentorsCount > 0) {
          bookableSlots.push({
            startAt: slotStartUtc.toISOString(),
            endAt: slotEndUtc.toISOString(),
            parentLocalDate: getLocalDateString(currentInstant, parentTimezone),
            parentLocalTime: getLocalTimeString(currentInstant, parentTimezone),
            parentDisplay: formatLocalDisplay(currentInstant, parentTimezone),
            parentUtcOffset: getUtcOffsetString(currentInstant, parentTimezone),
            mentorLocalDate,
            mentorLocalTime: slotStartTimeStr,
            availableMentorsCount,
          });
        }
      }

      currentInstant = addMinutesToInstant(currentInstant, 30);
    }

    return bookableSlots;
  },

  /**
   * Finds alternative candidate slots within +/- 2 days when a requested slot is unavailable.
   */
  async findAlternativeSlots(
    requestedStartUtc: Date,
    parentTimezone: string,
    maxAlternatives: number = 5
  ): Promise<BookableSlot[]> {
    const parentLocalDate = getLocalDateString(requestedStartUtc, parentTimezone);
    const plainDate = Temporal.PlainDate.from(parentLocalDate);

    const alternativeDays = [
      plainDate.toString(),
      plainDate.add({ days: 1 }).toString(),
      plainDate.subtract({ days: 1 }).toString(),
      plainDate.add({ days: 2 }).toString(),
      plainDate.subtract({ days: 2 }).toString(),
    ];

    const results: BookableSlot[] = [];

    for (const day of alternativeDays) {
      const slots = await this.getAvailableSlots(day, parentTimezone);
      for (const slot of slots) {
        if (slot.startAt !== requestedStartUtc.toISOString()) {
          results.push(slot);
          if (results.length >= maxAlternatives) {
            return results;
          }
        }
      }
    }

    return results;
  },
};
