import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK with service metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('codeyoung-trial-booking-api');
    });
  });

  describe('Validation & Error Handling', () => {
    it('should return 400 Bad Request on missing date in /api/availability', async () => {
      const res = await request(app).get('/api/availability?timezone=America/New_York');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request on invalid timezone in /api/availability', async () => {
      const res = await request(app).get('/api/availability?date=2026-10-15&timezone=InvalidZone');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request on invalid email in POST /api/bookings', async () => {
      const res = await request(app).post('/api/bookings').send({
        parentName: 'Jane Doe',
        parentEmail: 'invalid-email',
        parentTimezone: 'America/New_York',
        startTime: '2026-10-15T14:00:00Z',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should accept valid parent booking payload with optional studentName, phoneNumber, and courseName', async () => {
      // Testing schema validation rejection on bad email while including optional fields
      const res = await request(app).post('/api/bookings').send({
        parentName: 'Jane Doe',
        parentEmail: 'jane.doe@example.com',
        parentTimezone: 'America/New_York',
        startTime: 'not-valid-date-instant',
        studentName: 'Leo Doe',
        phoneNumber: '+1 555-0199',
        courseName: 'Python Programming',
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      // Verify validation failed on startTime, not on the optional fields
      expect(JSON.stringify(res.body.error.details)).toContain('startTime');
    });

    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
