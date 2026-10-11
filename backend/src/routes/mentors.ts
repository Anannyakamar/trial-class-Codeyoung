import { Router } from 'express';
import { mentorsController } from '../controllers/mentorsController.js';

export const mentorsRouter = Router();

mentorsRouter.get('/', mentorsController.getMentors);
