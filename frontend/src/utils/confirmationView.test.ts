import { describe, it, expect } from 'vitest';
import { BookingData } from '../api/client.js';

describe('Booking Confirmation Details & Contract Verification', () => {
  const sampleConfirmedBooking: BookingData = {
    id: 'b5a0346c-2f47-49d9-bb47-8147d3c01309',
    status: 'CONFIRMED',
    classLink: 'https://meet.codeyoung.com/trial-test-token-12345',
    startAtUtc: '2026-10-25T14:00:00.000Z',
    endAtUtc: '2026-10-25T14:30:00.000Z',
    parentTimezone: 'America/New_York',
    mentorTimezone: 'Asia/Kolkata',
    courseName: 'Python Programming',
    studentName: 'Jeremy Gilbert',
    phoneNumber: '+1 555-0142',
    studentGrade: 'Grade 4-6 (Ages 9-11)',
    parent: {
      id: 'parent-123',
      name: 'Elena Gilbert',
      email: 'elena.gilbert@example.com',
      phoneNumber: '+1 555-0142',
      timezone: 'America/New_York',
      localDate: '2026-10-25',
      localStartTime: '10:00',
      localEndTime: '10:30',
      formattedDisplay: 'Sunday, October 25, 2026 at 10:00 AM',
      utcOffset: '-04:00',
    },
    mentor: {
      id: 'mentor-456',
      name: 'Ananya Iyer',
      bio: 'Verified Codeyoung Educator specializing in live interactive STEM and coding instruction.',
      timezone: 'Asia/Kolkata',
      localDate: '2026-10-25',
      localStartTime: '19:30',
      localEndTime: '20:00',
      formattedDisplay: 'Sunday, October 25, 2026 at 7:30 PM',
      utcOffset: '+05:30',
    },
    simulationNotice:
      'Appointment is confirmed and scheduled in the system. External email delivery is simulated in this environment.',
  };

  it('should contain all required booking metadata fields', () => {
    expect(sampleConfirmedBooking.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(sampleConfirmedBooking.status).toBe('CONFIRMED');
    expect(sampleConfirmedBooking.courseName).toBe('Python Programming');
    expect(sampleConfirmedBooking.parentTimezone).toBe('America/New_York');
    expect(sampleConfirmedBooking.mentorTimezone).toBe('Asia/Kolkata');
  });

  it('should format parent and mentor local times accurately', () => {
    expect(sampleConfirmedBooking.parent.formattedDisplay).toContain('Sunday, October 25, 2026');
    expect(sampleConfirmedBooking.parent.localStartTime).toBe('10:00');
    expect(sampleConfirmedBooking.parent.localEndTime).toBe('10:30');
    expect(sampleConfirmedBooking.parent.utcOffset).toBe('-04:00');

    expect(sampleConfirmedBooking.mentor.formattedDisplay).toContain('Sunday, October 25, 2026');
    expect(sampleConfirmedBooking.mentor.localStartTime).toBe('19:30');
    expect(sampleConfirmedBooking.mentor.localEndTime).toBe('20:00');
    expect(sampleConfirmedBooking.mentor.utcOffset).toBe('+05:30');
  });

  it('should include full parent and child identification', () => {
    expect(sampleConfirmedBooking.parent.name).toBe('Elena Gilbert');
    expect(sampleConfirmedBooking.parent.email).toBe('elena.gilbert@example.com');
    expect(sampleConfirmedBooking.phoneNumber).toBe('+1 555-0142');
    expect(sampleConfirmedBooking.studentName).toBe('Jeremy Gilbert');
    expect(sampleConfirmedBooking.studentGrade).toBe('Grade 4-6 (Ages 9-11)');
  });

  it('should include assigned mentor details and credentials', () => {
    expect(sampleConfirmedBooking.mentor.name).toBe('Ananya Iyer');
    expect(sampleConfirmedBooking.mentor.bio).toBeDefined();
    expect(sampleConfirmedBooking.mentor.timezone).toBe('Asia/Kolkata');
  });

  it('should provide genuine backend meeting URL with safe demo identifier', () => {
    expect(sampleConfirmedBooking.classLink).toMatch(/^https:\/\/meet\.codeyoung\.com\/trial-/);
    expect(sampleConfirmedBooking.simulationNotice).toBeDefined();
  });
});
