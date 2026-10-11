import { describe, it, expect } from 'vitest';
import { ApiError } from './client.js';

describe('Frontend API Client Utilities', () => {
  it('should instantiate ApiError with code and status', () => {
    const error = new ApiError(400, 'VALIDATION_ERROR', 'Invalid parameters');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Invalid parameters');
  });
});
