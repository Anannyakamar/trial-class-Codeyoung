import { createApp } from './app.js';
import { env } from './config/env.js';
import { ensureDatabaseInitialized } from './db/init.js';

async function bootstrap() {
  await ensureDatabaseInitialized();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Codeyoung Booking API running on port ${env.PORT} (${env.NODE_ENV})`);
    console.log(`📡 Health endpoint: http://localhost:${env.PORT}/api/health`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
