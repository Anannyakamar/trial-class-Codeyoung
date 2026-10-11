import { z } from 'zod';
import { isValidIanaTimezone } from '../utils/timezone.js';

export const getAvailabilityQuerySchema = z.object({
  date: z
    .string({ required_error: 'Date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  timezone: z
    .string({ required_error: 'Timezone is required' })
    .refine((tz) => isValidIanaTimezone(tz), {
      message: 'Invalid IANA timezone identifier (e.g. America/New_York, Europe/London, Asia/Kolkata)',
    }),
  durationMinutes: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 30))
    .pipe(z.number().min(15).max(120)),
});

export const createBookingBodySchema = z.object({
  parentName: z
    .string({ required_error: 'Parent name is required' })
    .min(2, 'Parent name must be at least 2 characters')
    .max(100, 'Parent name must not exceed 100 characters'),
  parentEmail: z
    .string({ required_error: 'Parent email is required' })
    .email('Invalid email address'),
  parentTimezone: z
    .string({ required_error: 'Parent timezone is required' })
    .refine((tz) => isValidIanaTimezone(tz), {
      message: 'Invalid IANA timezone identifier',
    }),
  startTime: z
    .string({ required_error: 'Start time instant is required' })
    .refine(
      (val) => {
        try {
          const d = new Date(val);
          return !isNaN(d.getTime());
        } catch {
          return false;
        }
      },
      { message: 'Start time must be a valid ISO 8601 UTC timestamp string' }
    ),
  studentGrade: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  studentName: z.string().max(100).optional(),
  phoneNumber: z.string().max(50).optional(),
  courseName: z.string().max(100).optional(),
  idempotencyKey: z.string().max(100).optional(),
});

export const bookingIdParamSchema = z.object({
  id: z.string().uuid('Booking ID must be a valid UUID'),
});

export type GetAvailabilityQuery = z.infer<typeof getAvailabilityQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingBodySchema>;
