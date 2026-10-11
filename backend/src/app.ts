import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { mentorsRouter } from './routes/mentors.js';
import { availabilityRouter } from './routes/availability.js';
import { bookingsRouter } from './routes/bookings.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // API Routes
  app.use('/api', healthRouter);
  app.use('/api/mentors', mentorsRouter);
  app.use('/api/availability', availabilityRouter);
  app.use('/api/bookings', bookingsRouter);

  // 404 Route handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
