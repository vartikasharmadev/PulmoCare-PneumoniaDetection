import './loadEnv.js';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { connectToDatabase } from './config/db.js';

async function start() {
  await connectToDatabase();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`[Server] Listening on port ${config.port}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `[Server] Port ${config.port} is already in use. Stop the other process or run: npm run ports:free`,
      );
    } else {
      console.error('[Server] Listen error:', err);
    }
    process.exit(1);
  });
}

start().catch((error) => {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
});

