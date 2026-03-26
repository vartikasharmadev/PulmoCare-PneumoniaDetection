import type { Prediction, StoredPrediction } from '../types';

function predictUrl(baseUrl: string): string {
  if (!baseUrl) return '/api/predict';
  return `${baseUrl.replace(/\/$/, '')}/api/predict`;
}

function recentUrl(baseUrl: string, limit: number): string {
  if (!baseUrl) return `/api/predictions/recent?limit=${limit}`;
  return `${baseUrl.replace(/\/$/, '')}/api/predictions/recent?limit=${limit}`;
}

async function readJsonMessage(res: Response): Promise<string | undefined> {
  const ct = res.headers.get('content-type');
  if (!ct?.includes('application/json')) return undefined;
  try {
    const body = (await res.json()) as { message?: string };
    return body.message;
  } catch {
    return undefined;
  }
}

/**
 * Dev: empty base → same-origin `/api/*` (Vite proxies to Express).
 * Set `VITE_API_URL` only for a direct API base (custom port / deployed API).
 */
export function getApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_URL;
  if (explicit && String(explicit).trim() !== '') {
    return String(explicit).replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return '';
  }
  return 'http://127.0.0.1:5000';
}

export async function postPredict(
  baseUrl: string,
  file: File,
): Promise<Prediction> {
  const body = new FormData();
  body.append('file', file);

  let res: Response;
  try {
    res = await fetch(predictUrl(baseUrl), {
      method: 'POST',
      body,
    });
  } catch {
    throw new Error(
      'Network error: nothing answered at the API. In a terminal run: cd backend && npm run dev (leave it running). Restart the frontend (npm run dev) if you started the backend after Vite.',
    );
  }

  if (res.ok) {
    return res.json() as Promise<Prediction>;
  }

  const serverMsg = await readJsonMessage(res);

  if (res.status === 503) {
    throw new Error(
      serverMsg ??
        'Model not ready yet. In the Python terminal wait for “Model ready.” then try again.',
    );
  }

  if (res.status === 502) {
    throw new Error(
      serverMsg ??
        'Cannot reach the model service. Start Python: cd backend && source ../fl_env/bin/activate && python main.py',
    );
  }

  throw new Error(
    serverMsg ?? `Analysis request failed (HTTP ${res.status}).`,
  );
}

/** Returns null if the request fails so callers can keep existing UI state. */
export async function getRecentPredictions(
  baseUrl: string,
  limit = 8,
): Promise<StoredPrediction[] | null> {
  try {
    const res = await fetch(recentUrl(baseUrl, limit));
    if (!res.ok) return null;
    return (await res.json()) as StoredPrediction[];
  } catch {
    return null;
  }
}
