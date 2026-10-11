import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma.js';

export const SAMPLE_MENTORS = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@trial-mentors.example.com' },
  { name: 'Diya Patel', email: 'diya.patel@trial-mentors.example.com' },
  { name: 'Rohan Verma', email: 'rohan.verma@trial-mentors.example.com' },
  { name: 'Ananya Iyer', email: 'ananya.iyer@trial-mentors.example.com' },
  { name: 'Vikram Malhotra', email: 'vikram.malhotra@trial-mentors.example.com' },
  { name: 'Pooja Nair', email: 'pooja.nair@trial-mentors.example.com' },
  { name: 'Siddharth Rao', email: 'siddharth.rao@trial-mentors.example.com' },
  { name: 'Meera Sen', email: 'meera.sen@trial-mentors.example.com' },
  { name: 'Kabir Joshi', email: 'kabir.joshi@trial-mentors.example.com' },
  { name: 'Neha Mukherjee', email: 'neha.mukherjee@trial-mentors.example.com' },
];

export const SAMPLE_PARENTS = [
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', timezone: 'America/New_York' },
  { name: 'James Wilson', email: 'james.wilson@example.com', timezone: 'Europe/London' },
  { name: 'Rajesh Gupta', email: 'rajesh.gupta@example.com', timezone: 'Asia/Kolkata' },
];

export async function seed(client?: PrismaClient) {
  const prisma = client || defaultPrisma;
  console.log('🌱 Starting database seed...');

  // Seed Mentors with standard weekly availability (Mon-Sun, 09:00 - 21:00 IST)
  for (const mentorData of SAMPLE_MENTORS) {
    const mentor = await prisma.mentor.upsert({
      where: { email: mentorData.email },
      update: {
        name: mentorData.name,
        timezone: 'Asia/Kolkata',
        isActive: true,
      },
      create: {
        name: mentorData.name,
        email: mentorData.email,
        timezone: 'Asia/Kolkata',
        isActive: true,
      },
    });

    // Seed weekly availability (0=Sunday to 6=Saturday)
    for (let weekday = 0; weekday <= 6; weekday++) {
      const existingAvail = await prisma.mentorAvailability.findFirst({
        where: {
          mentorId: mentor.id,
          weekday,
        },
      });

      if (!existingAvail) {
        await prisma.mentorAvailability.create({
          data: {
            mentorId: mentor.id,
            weekday,
            startTime: '09:00',
            endTime: '21:00',
            isActive: true,
          },
        });
      }
    }
  }

  // Seed sample parents for development & testing
  for (const parentData of SAMPLE_PARENTS) {
    await prisma.parent.upsert({
      where: { email: parentData.email },
      update: {
        name: parentData.name,
        timezone: parentData.timezone,
      },
      create: {
        name: parentData.name,
        email: parentData.email,
        timezone: parentData.timezone,
      },
    });
  }

  const mentorCount = await prisma.mentor.count();
  const parentCount = await prisma.parent.count();
  const availabilityCount = await prisma.mentorAvailability.count();

  console.log(`✅ Seeding complete!`);
  console.log(`   - Mentors: ${mentorCount}`);
  console.log(`   - Parents: ${parentCount}`);
  console.log(`   - Availabilities: ${availabilityCount}`);
}
