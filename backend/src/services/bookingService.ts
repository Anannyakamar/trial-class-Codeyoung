import crypto from 'crypto';
import { prisma } from '../db/prisma.js';
import { slotService } from './slotService.js';
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
import { AppError } from '../middlewares/errorHandler.js';

export interface CreateBookingParams {
  parentName: string;
  parentEmail: string;
  parentTimezone: string;
  startTime: string; // ISO 8601 UTC
  studentGrade?: string;
  notes?: string;
  studentName?: string;
  phoneNumber?: string;
  courseName?: string;
}

export const bookingService = {
  /**
   * Atomically creates a new trial class booking, assigning an eligible mentor.
   */
  async createBooking(params: CreateBookingParams) {
    const { parentName, parentEmail, parentTimezone, startTime } = params;

    // 1. Validate start instant
    const startInstant = parseToInstant(startTime);
    if (!isInstantInFuture(startInstant)) {
      const err: AppError = new Error('Cannot book an appointment in the past');
      err.statusCode = 400;
      err.code = 'PAST_TIME_NOT_ALLOWED';
      throw err;
    }

    const endInstant = addMinutesToInstant(startInstant, 30);
    const startAtUtc = new Date(startInstant.epochMilliseconds);
    const endAtUtc = new Date(endInstant.epochMilliseconds);

    // 2. Resolve Parent (find or create)
    const parent = await prisma.parent.upsert({
      where: { email: parentEmail.toLowerCase().trim() },
      update: {
        name: parentName.trim(),
        timezone: parentTimezone,
      },
      create: {
        name: parentName.trim(),
        email: parentEmail.toLowerCase().trim(),
        timezone: parentTimezone,
      },
    });

    // 3. Check if parent already has an overlapping confirmed booking
    const parentOverlap = await prisma.booking.findFirst({
      where: {
        parentId: parent.id,
        status: 'CONFIRMED',
        startAt: { lt: endAtUtc },
        endAt: { gt: startAtUtc },
      },
      include: {
        mentor: true,
        parent: true,
      },
    });

    if (parentOverlap) {
      // If the parent is submitting for the exact same start time, treat as idempotent retry
      if (parentOverlap.startAt.getTime() === startAtUtc.getTime()) {
        const courseName = params.courseName || (params.notes?.match(/Course:\s*([^|]+)/i)?.[1]?.trim()) || 'Trial Class';
        const studentName = params.studentName || (params.notes?.match(/Student:\s*([^|]+)/i)?.[1]?.trim()) || undefined;
        const phoneNumber = params.phoneNumber || (params.notes?.match(/Phone:\s*([^|]+)/i)?.[1]?.trim()) || undefined;

        return {
          id: parentOverlap.id,
          status: parentOverlap.status,
          classLink: parentOverlap.classLink,
          startAtUtc: parentOverlap.startAt.toISOString(),
          endAtUtc: parentOverlap.endAt.toISOString(),
          parentTimezone: parentOverlap.parent.timezone,
          mentorTimezone: parentOverlap.mentor.timezone,
          courseName,
          studentName,
          phoneNumber,
          studentGrade: params.studentGrade,
          parent: {
            id: parentOverlap.parent.id,
            name: parentOverlap.parent.name,
            email: parentOverlap.parent.email,
            phoneNumber,
            timezone: parentOverlap.parent.timezone,
            localDate: getLocalDateString(parentOverlap.startAt, parentOverlap.parent.timezone),
            localStartTime: getLocalTimeString(parentOverlap.startAt, parentOverlap.parent.timezone),
            localEndTime: getLocalTimeString(parentOverlap.endAt, parentOverlap.parent.timezone),
            formattedDisplay: formatLocalDisplay(parentOverlap.startAt, parentOverlap.parent.timezone),
            utcOffset: getUtcOffsetString(parentOverlap.startAt, parentOverlap.parent.timezone),
          },
          mentor: {
            id: parentOverlap.mentor.id,
            name: parentOverlap.mentor.name,
            timezone: parentOverlap.mentor.timezone,
            bio: 'Verified Codeyoung Educator specializing in live interactive STEM and coding instruction.',
            localDate: getLocalDateString(parentOverlap.startAt, parentOverlap.mentor.timezone),
            localStartTime: getLocalTimeString(parentOverlap.startAt, parentOverlap.mentor.timezone),
            localEndTime: getLocalTimeString(parentOverlap.endAt, parentOverlap.mentor.timezone),
            formattedDisplay: formatLocalDisplay(parentOverlap.startAt, parentOverlap.mentor.timezone),
            utcOffset: getUtcOffsetString(parentOverlap.startAt, parentOverlap.mentor.timezone),
          },
          simulationNotice:
            'Appointment was previously confirmed and retrieved via safe idempotent recovery.',
        };
      }

      const err: AppError = new Error(
        'You already have a confirmed trial class appointment during this time interval'
      );
      err.statusCode = 409;
      err.code = 'PARENT_DOUBLE_BOOKING';
      throw err;
    }

    // 4. Mentor Assignment within an ACID transaction
    const mentorWeekday = getLocalWeekday(startInstant, MENTOR_DEFAULT_TIMEZONE);
    const slotStartTimeStr = getLocalTimeString(startInstant, MENTOR_DEFAULT_TIMEZONE);
    const slotEndTimeStr = getLocalTimeString(endInstant, MENTOR_DEFAULT_TIMEZONE);
    const mentorLocalDate = getLocalDateString(startInstant, MENTOR_DEFAULT_TIMEZONE);

    const { startUtc: mentorDayStartUtc, endUtc: mentorDayEndUtc } = getDayUtcBounds(
      mentorLocalDate,
      MENTOR_DEFAULT_TIMEZONE
    );

    const confirmedBooking = await prisma.$transaction(
      async (tx) => {
        // Fetch all active mentors
        const activeMentors = await tx.mentor.findMany({
          where: { isActive: true },
          include: {
            availabilities: {
              where: {
                isActive: true,
                weekday: mentorWeekday,
              },
            },
            bookings: {
              where: {
                status: 'CONFIRMED',
                startAt: { gte: mentorDayStartUtc, lt: mentorDayEndUtc },
              },
            },
          },
        });

        // Evaluate eligible mentors
        interface MentorCandidate {
          mentor: (typeof activeMentors)[0];
          dayBookingsCount: number;
          totalBookingsCount: number;
        }

        const eligibleCandidates: MentorCandidate[] = [];

        for (const mentor of activeMentors) {
          // Check working availability window
          const coversTime = mentor.availabilities.some((avail) => {
            return avail.startTime <= slotStartTimeStr && avail.endTime >= slotEndTimeStr;
          });
          if (!coversTime) continue;

          // Check direct slot overlap
          const hasOverlap = await tx.booking.findFirst({
            where: {
              mentorId: mentor.id,
              status: 'CONFIRMED',
              startAt: { lt: endAtUtc },
              endAt: { gt: startAtUtc },
            },
          });
          if (hasOverlap) continue;

          // Check daily limit of 2 classes per mentor-local calendar day in Asia/Kolkata
          const dayCount = mentor.bookings.length;
          if (dayCount >= 2) continue;

          // Count overall historical bookings for tie-breaking
          const totalCount = await tx.booking.count({
            where: { mentorId: mentor.id, status: 'CONFIRMED' },
          });

          eligibleCandidates.push({
            mentor,
            dayBookingsCount: dayCount,
            totalBookingsCount: totalCount,
          });
        }

        // If no mentor is available, throw error to trigger alternative suggestions
        if (eligibleCandidates.length === 0) {
          const err: AppError = new Error(
            'No mentors are available for the selected slot. Please select an alternative time.'
          );
          err.statusCode = 409;
          err.code = 'SLOT_UNAVAILABLE';
          throw err;
        }

        // Deterministic, fair assignment:
        // 1. Least booked today (load balancing)
        // 2. Least booked overall (fairness)
        // 3. Deterministic mentor ID
        eligibleCandidates.sort((a, b) => {
          if (a.dayBookingsCount !== b.dayBookingsCount) {
            return a.dayBookingsCount - b.dayBookingsCount;
          }
          if (a.totalBookingsCount !== b.totalBookingsCount) {
            return a.totalBookingsCount - b.totalBookingsCount;
          }
          return a.mentor.id.localeCompare(b.mentor.id);
        });

        const selectedMentor = eligibleCandidates[0].mentor;
        const meetingToken = crypto.randomUUID();
        const classLink = `https://meet.codeyoung.com/trial-${meetingToken}`;

        // Create the confirmed booking record
        const booking = await tx.booking.create({
          data: {
            parentId: parent.id,
            mentorId: selectedMentor.id,
            startAt: startAtUtc,
            endAt: endAtUtc,
            status: 'CONFIRMED',
            classLink,
          },
          include: {
            mentor: true,
            parent: true,
          },
        });

        return booking;
      },
      {
        isolationLevel: 'Serializable',
      }
    ).catch(async (err) => {
      // If slot unavailable, fetch suggestions outside transaction
      if (err.code === 'SLOT_UNAVAILABLE') {
        const alternatives = await slotService.findAlternativeSlots(startAtUtc, parentTimezone, 5);
        err.details = { suggestedAlternatives: alternatives };
      }
      throw err;
    });

    const courseName = params.courseName || (params.notes?.match(/Course:\s*([^|]+)/i)?.[1]?.trim()) || 'Trial Class';
    const studentName = params.studentName || (params.notes?.match(/Student:\s*([^|]+)/i)?.[1]?.trim()) || undefined;
    const phoneNumber = params.phoneNumber || (params.notes?.match(/Phone:\s*([^|]+)/i)?.[1]?.trim()) || undefined;

    return {
      id: confirmedBooking.id,
      status: confirmedBooking.status,
      classLink: confirmedBooking.classLink,
      startAtUtc: confirmedBooking.startAt.toISOString(),
      endAtUtc: confirmedBooking.endAt.toISOString(),
      parentTimezone: confirmedBooking.parent.timezone,
      mentorTimezone: confirmedBooking.mentor.timezone,
      courseName,
      studentName,
      phoneNumber,
      studentGrade: params.studentGrade,
      parent: {
        id: confirmedBooking.parent.id,
        name: confirmedBooking.parent.name,
        email: confirmedBooking.parent.email,
        phoneNumber,
        timezone: confirmedBooking.parent.timezone,
        localDate: getLocalDateString(confirmedBooking.startAt, confirmedBooking.parent.timezone),
        localStartTime: getLocalTimeString(confirmedBooking.startAt, confirmedBooking.parent.timezone),
        localEndTime: getLocalTimeString(confirmedBooking.endAt, confirmedBooking.parent.timezone),
        formattedDisplay: formatLocalDisplay(confirmedBooking.startAt, confirmedBooking.parent.timezone),
        utcOffset: getUtcOffsetString(confirmedBooking.startAt, confirmedBooking.parent.timezone),
      },
      mentor: {
        id: confirmedBooking.mentor.id,
        name: confirmedBooking.mentor.name,
        timezone: confirmedBooking.mentor.timezone,
        bio: 'Verified Codeyoung Educator specializing in live interactive STEM and coding instruction.',
        localDate: getLocalDateString(confirmedBooking.startAt, confirmedBooking.mentor.timezone),
        localStartTime: getLocalTimeString(confirmedBooking.startAt, confirmedBooking.mentor.timezone),
        localEndTime: getLocalTimeString(confirmedBooking.endAt, confirmedBooking.mentor.timezone),
        formattedDisplay: formatLocalDisplay(confirmedBooking.startAt, confirmedBooking.mentor.timezone),
        utcOffset: getUtcOffsetString(confirmedBooking.startAt, confirmedBooking.mentor.timezone),
      },
      simulationNotice:
        'Appointment is confirmed and scheduled in the system. External email delivery is simulated in this environment.',
    };
  },

  /**
   * Retrieves booking details by ID.
   */
  async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        mentor: true,
        parent: true,
      },
    });

    if (!booking) {
      const err: AppError = new Error(`Booking with ID ${id} not found`);
      err.statusCode = 404;
      err.code = 'BOOKING_NOT_FOUND';
      throw err;
    }

    return {
      id: booking.id,
      status: booking.status,
      classLink: booking.classLink,
      startAtUtc: booking.startAt.toISOString(),
      endAtUtc: booking.endAt.toISOString(),
      parentTimezone: booking.parent.timezone,
      mentorTimezone: booking.mentor.timezone,
      parent: {
        name: booking.parent.name,
        email: booking.parent.email,
        timezone: booking.parent.timezone,
        localDate: getLocalDateString(booking.startAt, booking.parent.timezone),
        localStartTime: getLocalTimeString(booking.startAt, booking.parent.timezone),
        localEndTime: getLocalTimeString(booking.endAt, booking.parent.timezone),
        formattedDisplay: formatLocalDisplay(booking.startAt, booking.parent.timezone),
        utcOffset: getUtcOffsetString(booking.startAt, booking.parent.timezone),
      },
      mentor: {
        id: booking.mentor.id,
        name: booking.mentor.name,
        timezone: booking.mentor.timezone,
        bio: 'Verified Codeyoung Educator specializing in live interactive STEM and coding instruction.',
        localDate: getLocalDateString(booking.startAt, booking.mentor.timezone),
        localStartTime: getLocalTimeString(booking.startAt, booking.mentor.timezone),
        localEndTime: getLocalTimeString(booking.endAt, booking.mentor.timezone),
        formattedDisplay: formatLocalDisplay(booking.startAt, booking.mentor.timezone),
        utcOffset: getUtcOffsetString(booking.startAt, booking.mentor.timezone),
      },
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  },

  /**
   * Cancels an existing confirmed booking.
   */
  async cancelBooking(id: string) {
    const existing = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existing) {
      const err: AppError = new Error(`Booking with ID ${id} not found`);
      err.statusCode = 404;
      err.code = 'BOOKING_NOT_FOUND';
      throw err;
    }

    if (existing.status === 'CANCELLED') {
      const err: AppError = new Error('Booking has already been cancelled');
      err.statusCode = 400;
      err.code = 'ALREADY_CANCELLED';
      throw err;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        mentor: true,
        parent: true,
      },
    });

    return {
      id: updated.id,
      status: updated.status,
      message: 'Booking successfully cancelled. Mentor capacity has been released.',
      cancelledAt: updated.updatedAt.toISOString(),
    };
  },
};
