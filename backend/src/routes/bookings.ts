import { Router } from 'express';
import { bookingsController } from '../controllers/bookingsController.js';

export const bookingsRouter = Router();

bookingsRouter.post('/', bookingsController.createBooking);
bookingsRouter.get('/:id', bookingsController.getBooking);
bookingsRouter.post('/:id/cancel', bookingsController.cancelBooking);
