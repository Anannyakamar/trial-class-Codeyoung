import { describe, it, expect } from 'vitest';
import { parentBookingFormSchema } from '../components/catalog/ParentBookingForm.js';

describe('Parent Booking Form Schema Validation', () => {
  it('should successfully validate valid parent registration data', () => {
    const validData = {
      parentName: 'Eleanor Vance',
      parentEmail: 'eleanor.vance@example.com',
      countryCode: '+1',
      phoneNumber: '555-0199',
      courseId: 'python-programming',
      studentName: 'Oliver',
      studentGrade: 'Grade 4-6 (Ages 9-11)',
      notes: 'Interested in game creation',
    };

    const result = parentBookingFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject short parent name and invalid email format', () => {
    const invalidData = {
      parentName: 'E',
      parentEmail: 'not-an-email',
      countryCode: '+1',
      phoneNumber: '555-0199',
      courseId: 'science',
    };

    const result = parentBookingFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.parentName).toBeDefined();
      expect(fieldErrors.parentEmail).toBeDefined();
    }
  });

  it('should reject phone numbers that are too short or contain invalid characters', () => {
    const invalidPhoneData = {
      parentName: 'Sarah Jenkins',
      parentEmail: 'sarah@example.com',
      countryCode: '+1',
      phoneNumber: '123', // Too short
      courseId: 'web-development',
    };

    const resultShort = parentBookingFormSchema.safeParse(invalidPhoneData);
    expect(resultShort.success).toBe(false);

    const invalidCharData = {
      parentName: 'Sarah Jenkins',
      parentEmail: 'sarah@example.com',
      countryCode: '+1',
      phoneNumber: 'abc-def-ghij',
      courseId: 'web-development',
    };

    const resultChars = parentBookingFormSchema.safeParse(invalidCharData);
    expect(resultChars.success).toBe(false);
  });

  it('should require a courseId to be selected', () => {
    const missingCourseData = {
      parentName: 'Sarah Jenkins',
      parentEmail: 'sarah@example.com',
      countryCode: '+1',
      phoneNumber: '555-0199',
      courseId: '',
    };

    const result = parentBookingFormSchema.safeParse(missingCourseData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.courseId).toBeDefined();
    }
  });
});
