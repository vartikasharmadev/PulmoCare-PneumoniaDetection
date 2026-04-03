import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import predictionRoutes from './routes/predictionRoutes.js';
import { config } from './config/env.js';
import { sendModelStatus } from './modelStatus.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/model-status', sendModelStatus);
  app.get('/model-status', sendModelStatus);

  app.use('/api', predictionRoutes);

  return app;
}

