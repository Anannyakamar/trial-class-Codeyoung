import { Request, Response, NextFunction } from 'express';
import {
  createBookingBodySchema,
  bookingIdParamSchema,
} from '../schemas/booking.js';
import { bookingService } from '../services/bookingService.js';

export const bookingsController = {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createBookingBodySchema.parse(req.body);
      const booking = await bookingService.createBooking(body);

      res.status(201).json({
        success: true,
        message: 'Trial class booked successfully',
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  },

  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = bookingIdParamSchema.parse(req.params);
      const booking = await bookingService.getBookingById(id);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  },

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = bookingIdParamSchema.parse(req.params);
      const result = await bookingService.cancelBooking(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
