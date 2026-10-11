import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'codeyoung-trial-booking-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});
