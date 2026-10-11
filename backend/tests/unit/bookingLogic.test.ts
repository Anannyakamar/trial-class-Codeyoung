import { describe, it, expect } from 'vitest';

describe('Mentor Ranking & Assignment Invariants', () => {
  interface Candidate {
    id: string;
    name: string;
    dayBookingsCount: number;
    totalBookingsCount: number;
  }

  function rankMentorCandidates(candidates: Candidate[]): Candidate[] {
    return [...candidates].sort((a, b) => {
      // 1. Load balance: least booked today first
      if (a.dayBookingsCount !== b.dayBookingsCount) {
        return a.dayBookingsCount - b.dayBookingsCount;
      }
      // 2. Long term fairness: least booked overall
      if (a.totalBookingsCount !== b.totalBookingsCount) {
        return a.totalBookingsCount - b.totalBookingsCount;
      }
      // 3. Deterministic tie-breaker
      return a.id.localeCompare(b.id);
    });
  }

  it('should select mentor with lowest bookings today for load balancing', () => {
    const candidates: Candidate[] = [
      { id: 'mentor-1', name: 'Mentor A', dayBookingsCount: 1, totalBookingsCount: 5 },
      { id: 'mentor-2', name: 'Mentor B', dayBookingsCount: 0, totalBookingsCount: 10 },
      { id: 'mentor-3', name: 'Mentor C', dayBookingsCount: 1, totalBookingsCount: 2 },
    ];

    const ranked = rankMentorCandidates(candidates);
    expect(ranked[0].id).toBe('mentor-2'); // 0 bookings today
  });

  it('should break ties using total historical bookings count', () => {
    const candidates: Candidate[] = [
      { id: 'mentor-1', name: 'Mentor A', dayBookingsCount: 1, totalBookingsCount: 8 },
      { id: 'mentor-2', name: 'Mentor B', dayBookingsCount: 1, totalBookingsCount: 3 },
      { id: 'mentor-3', name: 'Mentor C', dayBookingsCount: 1, totalBookingsCount: 5 },
    ];

    const ranked = rankMentorCandidates(candidates);
    expect(ranked[0].id).toBe('mentor-2'); // lowest total count (3)
  });

  it('should break exact ties deterministically by ID', () => {
    const candidates: Candidate[] = [
      { id: 'mentor-z', name: 'Mentor Z', dayBookingsCount: 0, totalBookingsCount: 2 },
      { id: 'mentor-a', name: 'Mentor A', dayBookingsCount: 0, totalBookingsCount: 2 },
    ];

    const ranked = rankMentorCandidates(candidates);
    expect(ranked[0].id).toBe('mentor-a');
  });

  describe('Interval Overlap Calculation', () => {
    function hasOverlap(
      slotStart: Date,
      slotEnd: Date,
      existingStart: Date,
      existingEnd: Date
    ): boolean {
      return slotStart < existingEnd && slotEnd > existingStart;
    }

    it('should detect exact matching interval as overlap', () => {
      const s1 = new Date('2026-10-15T10:00:00Z');
      const e1 = new Date('2026-10-15T10:30:00Z');
      expect(hasOverlap(s1, e1, s1, e1)).toBe(true);
    });

    it('should detect partial overlapping interval', () => {
      const s1 = new Date('2026-10-15T10:00:00Z');
      const e1 = new Date('2026-10-15T10:30:00Z');
      const s2 = new Date('2026-10-15T10:15:00Z');
      const e2 = new Date('2026-10-15T10:45:00Z');
      expect(hasOverlap(s1, e1, s2, e2)).toBe(true);
    });

    it('should allow adjacent consecutive intervals without overlap', () => {
      const s1 = new Date('2026-10-15T10:00:00Z');
      const e1 = new Date('2026-10-15T10:30:00Z');
      const s2 = new Date('2026-10-15T10:30:00Z');
      const e2 = new Date('2026-10-15T11:00:00Z');
      expect(hasOverlap(s1, e1, s2, e2)).toBe(false);
    });
  });
});
