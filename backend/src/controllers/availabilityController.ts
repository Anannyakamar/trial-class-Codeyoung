import { Request, Response, NextFunction } from 'express';
import { getAvailabilityQuerySchema } from '../schemas/booking.js';
import { slotService } from '../services/slotService.js';

export const availabilityController = {
  async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getAvailabilityQuerySchema.parse(req.query);
      const slots = await slotService.getAvailableSlots(
        query.date,
        query.timezone,
        query.durationMinutes
      );

      res.status(200).json({
        success: true,
        data: {
          requestedDate: query.date,
          requestedTimezone: query.timezone,
          durationMinutes: query.durationMinutes || 30,
          totalAvailableSlots: slots.length,
          slots,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
