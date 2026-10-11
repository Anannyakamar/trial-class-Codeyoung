import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/db/prisma.js';
import { ensureDatabaseInitialized } from '../../src/db/init.js';
import { PrismaClient } from '@prisma/client';

const app = createApp();

describe('SQLite Database Persistence & Booking Lifecycle', () => {
  beforeAll(async () => {
    await ensureDatabaseInitialized();
  });

  it('should have 10 mentors seeded in the persistent SQLite database', async () => {
    const mentors = await prisma.mentor.findMany({ where: { isActive: true } });
    expect(mentors.length).toBe(10);
  });

  it('should query availability from SQLite database', async () => {
    const res = await request(app).get(
      '/api/availability?date=2026-10-25&timezone=America/New_York&durationMinutes=30'
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.slots)).toBe(true);
    expect(res.body.data.slots.length).toBeGreaterThan(0);
  });

  it('should create, persist, retrieve, and cancel a booking in SQLite', async () => {
    // 1. Create booking for a future slot (e.g., 2026-10-25 14:00 UTC)
    const bookingPayload = {
      parentName: 'Test Recruiter',
      parentEmail: 'recruiter.test@example.com',
      parentTimezone: 'America/New_York',
      startTime: '2026-10-25T14:00:00.000Z',
    };

    const createRes = await request(app).post('/api/bookings').send(bookingPayload);
    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const bookingId = createRes.body.data.id;
    expect(bookingId).toBeDefined();

    // 2. Query the SQLite database using a completely fresh PrismaClient instance
    const freshPrisma = new PrismaClient();
    try {
      const persistedRecord = await freshPrisma.booking.findUnique({
        where: { id: bookingId },
        include: { mentor: true, parent: true },
      });
      expect(persistedRecord).toBeDefined();
      expect(persistedRecord?.parent.email).toBe('recruiter.test@example.com');
      expect(persistedRecord?.status).toBe('CONFIRMED');
    } finally {
      await freshPrisma.$disconnect();
    }

    // 3. Retrieve booking via API GET endpoint
    const getRes = await request(app).get(`/api/bookings/${bookingId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.id).toBe(bookingId);
    expect(getRes.body.data.parent.name).toBe('Test Recruiter');

    // 4. Cancel booking via API POST endpoint
    const cancelRes = await request(app).post(`/api/bookings/${bookingId}/cancel`);
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.status).toBe('CANCELLED');

    // 5. Verify status updated in database
    const cancelledRecord = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    expect(cancelledRecord?.status).toBe('CANCELLED');
  });

  it('should maintain existing bookings when ensureDatabaseInitialized runs idempotently', async () => {
    const totalBookingsBefore = await prisma.booking.count();
    await ensureDatabaseInitialized();
    const totalBookingsAfter = await prisma.booking.count();
    expect(totalBookingsAfter).toBe(totalBookingsBefore);
  });
});
