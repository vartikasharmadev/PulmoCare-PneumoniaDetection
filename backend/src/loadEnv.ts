import path from 'path';
import { config as loadEnv } from 'dotenv';

// When `npm run dev` runs from backend/, load repo-root .env first, then backend/.env
loadEnv({ path: path.resolve(process.cwd(), '..', '.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });
