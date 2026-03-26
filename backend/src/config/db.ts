import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectToDatabase() {
  if (!config.mongoUri) {
    console.warn('[DB] MONGODB_URI not set. Skipping database connection.');
    return;
  }

  try {
    await mongoose.connect(config.mongoUri);
    console.log('[DB] Connected to MongoDB');
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error);
  }
}

