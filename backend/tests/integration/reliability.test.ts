import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

describe('Reliability & Error Handling Integration Tests', () => {
  describe('Input Validation & Error Responses', () => {
    it('should return 400 Bad Request when booking in the past', async () => {
      const res = await request(app).post('/api/bookings').send({
        parentName: 'Alice Smith',
        parentEmail: 'alice.smith@example.com',
        parentTimezone: 'America/New_York',
        startTime: '2020-01-01T10:00:00Z', // Far in the past
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PAST_TIME_NOT_ALLOWED');
    });

    it('should return 400 Bad Request on invalid parent timezone in booking', async () => {
      const res = await request(app).post('/api/bookings').send({
        parentName: 'Alice Smith',
        parentEmail: 'alice.smith@example.com',
        parentTimezone: 'Invalid/NonExistent_Zone',
        startTime: '2027-10-15T14:00:00Z',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request on invalid email format', async () => {
      const res = await request(app).post('/api/bookings').send({
        parentName: 'Alice Smith',
        parentEmail: 'not-an-email',
        parentTimezone: 'America/New_York',
        startTime: '2027-10-15T14:00:00Z',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when booking ID is not a valid UUID', async () => {
      const res = await request(app).get('/api/bookings/invalid-id-123');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when cancelling with invalid UUID', async () => {
      const res = await request(app).post('/api/bookings/not-a-uuid/cancel');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Slot Availability Query Validation', () => {
    it('should reject invalid date format in availability query', async () => {
      const res = await request(app).get('/api/availability?date=15-10-2026&timezone=America/New_York');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid duration values (e.g. less than 15 mins or > 120 mins)', async () => {
      const res = await request(app).get('/api/availability?date=2026-10-15&timezone=America/New_York&durationMinutes=5');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
