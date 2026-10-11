import { prisma } from '../db/prisma.js';

export interface PublicMentor {
  id: string;
  name: string;
  timezone: string;
  isActive: boolean;
}

export const mentorService = {
  /**
   * Retrieves all active mentors with public fields.
   */
  async getActiveMentors(): Promise<PublicMentor[]> {
    const mentors = await prisma.mentor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        timezone: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    return mentors;
  },
};
