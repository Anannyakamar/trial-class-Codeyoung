import { Request, Response, NextFunction } from 'express';
import { mentorService } from '../services/mentorService.js';

export const mentorsController = {
  async getMentors(_req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await mentorService.getActiveMentors();
      res.status(200).json({
        success: true,
        data: mentors,
        count: mentors.length,
      });
    } catch (err) {
      next(err);
    }
  },
};
