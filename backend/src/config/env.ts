import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  process.env.DATABASE_URL = result.data.DATABASE_URL;
  return result.data;
};

export const env = parseEnv();
