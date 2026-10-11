import { Router } from 'express';
import { availabilityController } from '../controllers/availabilityController.js';

export const availabilityRouter = Router();

availabilityRouter.get('/', availabilityController.getAvailability);
