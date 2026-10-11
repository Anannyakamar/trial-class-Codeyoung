import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message = err.message || 'An unexpected error occurred';

  // Log error stack for unexpected server errors
  if (statusCode >= 500) {
    console.error('💥 Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
