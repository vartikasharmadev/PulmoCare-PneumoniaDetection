import './loadEnv.js';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { connectToDatabase } from './config/db.js';

async function start() {
  await connectToDatabase();

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`[Server] Listening on port ${config.port}`);
  });
}

start().catch((error) => {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
});

