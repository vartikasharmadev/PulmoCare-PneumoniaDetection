import axios from 'axios';
import type { Request, Response } from 'express';
import { config } from './config/env.js';

export function pythonServiceRoot(predictUrl: string): string {
  try {
    const u = new URL(predictUrl);
    return `${u.origin}/`;
  } catch {
    return predictUrl.replace(/\/predict\/?$/i, '/') || predictUrl;
  }
}

/** GET handler: can Express reach the FastAPI root (same host as MODEL_API_URL)? */
export async function sendModelStatus(_req: Request, res: Response): Promise<void> {
  const root = pythonServiceRoot(config.pythonPredictUrl);
  try {
    await axios.get(root, { timeout: 3000 });
    res.json({
      ok: true,
      predictUrl: config.pythonPredictUrl,
      checked: root,
    });
  } catch (err) {
    const detail = axios.isAxiosError(err) ? err.message : String(err);
    res.status(503).json({
      ok: false,
      predictUrl: config.pythonPredictUrl,
      checked: root,
      error: detail,
      hint:
        'Deploy or start the Python FastAPI service and set MODEL_API_URL to its /predict URL.',
    });
  }
}
