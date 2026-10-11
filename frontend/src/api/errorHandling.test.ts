import { describe, it, expect } from 'vitest';
import { ApiError } from './client.js';

describe('Frontend Reliability & Error Handling', () => {
  it('should format user-friendly message for network failures', () => {
    const error = new ApiError(500, 'NETWORK_ERROR', 'Failed to connect to backend server');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toContain('Failed to connect');
  });

  it('should parse 409 conflict errors with alternative slot suggestions', () => {
    const error = new ApiError(409, 'SLOT_UNAVAILABLE', 'No mentors are available for the selected slot', {
      suggestedAlternatives: [
        {
          startAt: '2026-10-15T15:00:00.000Z',
          endAt: '2026-10-15T15:30:00.000Z',
          parentLocalDate: '2026-10-15',
          parentLocalTime: '11:00',
          parentDisplay: 'Thursday, Oct 15, 2026 at 11:00 AM',
          parentUtcOffset: '-04:00',
          mentorLocalDate: '2026-10-15',
          mentorLocalTime: '20:30',
          availableMentorsCount: 3,
        },
      ],
    });

    expect(error.statusCode).toBe(409);
    expect(error.details?.suggestedAlternatives).toBeDefined();
    expect(error.details?.suggestedAlternatives?.length).toBe(1);
  });
});
