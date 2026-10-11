import { describe, it, expect } from 'vitest';
import { ApiError } from './client.js';

describe('Frontend API Client & Error Contract Handling', () => {
  it('should instantiate ApiError with proper status, code and suggested alternatives', () => {
    const error = new ApiError(409, 'SLOT_UNAVAILABLE', 'No mentors are available for the selected slot', {
      suggestedAlternatives: [
        {
          startAt: '2026-10-15T14:00:00Z',
          endAt: '2026-10-15T14:30:00Z',
          parentLocalDate: '2026-10-15',
          parentLocalTime: '10:00',
          parentDisplay: 'Thursday, Oct 15, 2026 at 10:00 AM',
          parentUtcOffset: '-04:00',
          mentorLocalDate: '2026-10-15',
          mentorLocalTime: '19:30',
          availableMentorsCount: 2,
        },
      ],
    });

    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('SLOT_UNAVAILABLE');
    expect(error.details?.suggestedAlternatives?.length).toBe(1);
    expect(error.details?.suggestedAlternatives?.[0].parentLocalTime).toBe('10:00');
  });
});
