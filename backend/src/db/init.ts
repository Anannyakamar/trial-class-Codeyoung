import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from './prisma.js';
import { seed } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures the SQLite database schema is applied and initial demo mentors/parents exist.
 * This operation is completely idempotent:
 * - If tables exist and have data, it will not overwrite or delete existing records.
 * - If tables do not exist (fresh clone), it runs migrations and populates seed data.
 */
export async function ensureDatabaseInitialized(): Promise<void> {
  const backendRoot = path.resolve(__dirname, '../..');
  const prismaDir = path.resolve(backendRoot, 'prisma');

  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }

  let isSchemaReady = false;

  try {
    const mentorCount = await prisma.mentor.count();
    isSchemaReady = true;

    if (mentorCount === 0) {
      console.log('📦 Database tables exist but are empty. Seeding initial data...');
      await seed(prisma);
    } else {
      console.log(`✅ SQLite Database connected (${mentorCount} mentors available)`);
    }
  } catch {
    isSchemaReady = false;
  }

  if (!isSchemaReady) {
    console.log('🔄 Initializing SQLite database schema...');
    try {
      const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      execSync(`${npxCmd} prisma migrate deploy`, {
        cwd: backendRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
        },
      });

      console.log('🌱 Populating initial seed data...');
      await seed(prisma);
      console.log('✅ SQLite Database successfully initialized and seeded.');
    } catch (migrateErr) {
      console.error('❌ Failed to run Prisma migrations automatically:', migrateErr);
      throw migrateErr;
    }
  }
}
