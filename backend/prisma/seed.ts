import { PrismaClient } from '@prisma/client';
import { seed } from '../src/db/seedData.js';

const prisma = new PrismaClient();

seed(prisma)
  .catch((e) => {
    console.error('❌ Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
