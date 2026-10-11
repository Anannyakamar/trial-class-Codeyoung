import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  formatTimeOnly,
  hasCrossTimezoneDateDifference,
} from './timezone.js';

const bookingSchema = z.object({
  parentName: z.string().min(2, 'Name too short'),
  parentEmail: z.string().email('Invalid email'),
  studentGrade: z.string().optional(),
  notes: z.string().max(500).optional(),
});

describe('Phase 7: Frontend Form Validation & Timezone Display Regressions', () => {
  describe('Zod Booking Form Schema Validation', () => {
    it('should validate valid parent details', () => {
      const validData = {
        parentName: 'Sarah Jenkins',
        parentEmail: 'sarah.jenkins@example.com',
        studentGrade: 'Grade 5-8',
        notes: 'Enthusiastic beginner',
      };
      const result = bookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short parent name and invalid email format', () => {
      const invalidData = {
        parentName: 'S',
        parentEmail: 'not-an-email',
      };
      const result = bookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.parentName).toBeDefined();
        expect(result.error.flatten().fieldErrors.parentEmail).toBeDefined();
      }
    });
  });

  describe('Timezone Formatting & Cross-Date Calculations', () => {
    it('should correctly format 12-hour AM/PM times across timezones', () => {
      // 2026-10-20 18:00:00 UTC
      // NY (EDT, UTC-4): 2:00 PM
      // London (BST, UTC+1): 7:00 PM
      // Kolkata (IST, UTC+5:30): 11:30 PM
      const instant = '2026-10-20T18:00:00.000Z';

      expect(formatTimeOnly(instant, 'America/New_York')).toBe('2:00 PM');
      expect(formatTimeOnly(instant, 'Europe/London')).toBe('7:00 PM');
      expect(formatTimeOnly(instant, 'Asia/Kolkata')).toBe('11:30 PM');
    });

    it('should detect cross-date boundary differences between US and India', () => {
      // 2026-10-20 20:00:00 UTC
      // NY (EDT): 4:00 PM on Oct 20
      // Kolkata (IST): 1:30 AM on Oct 21 (Next Day!)
      const instant = '2026-10-20T20:00:00.000Z';
      const hasDiff = hasCrossTimezoneDateDifference(instant, 'America/New_York', 'Asia/Kolkata');
      expect(hasDiff).toBe(true);
    });
  });
});
