import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { Prediction } from '../models/Prediction.js';
import { config } from '../config/env.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

interface PythonPredictResponse {
  prediction: 'NORMAL' | 'PNEUMONIA';
  confidence: number;
  raw_value?: number;
}

/** FastAPI uses `detail`; some routes use `message`. */
function pythonApiErrorText(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return 'Unknown error from model API';
  }
  const d = data as { detail?: unknown; message?: unknown };
  if (typeof d.detail === 'string') {
    return d.detail;
  }
  if (Array.isArray(d.detail)) {
    return d.detail.map((x) => JSON.stringify(x)).join('; ');
  }
  if (d.detail != null && typeof d.detail === 'object') {
    return JSON.stringify(d.detail);
  }
  if (typeof d.message === 'string') {
    return d.message;
  }
  return 'Unknown error from model API';
}

router.post(
  '/predict',
  upload.single('file'),
  async (req, res): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      if (!file.buffer) {
        res.status(400).json({ message: 'Invalid file buffer' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      let prediction: PythonPredictResponse['prediction'] = 'NORMAL';
      let confidence = 0.5;

      try {
        // validateStatus: never throw on 4xx/5xx — FastAPI 503 “model not loaded” must not look like “Python down”
        const pythonResponse = await axios.post<PythonPredictResponse>(
          config.pythonPredictUrl,
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 120_000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true,
          },
        );

        if (
          pythonResponse.status >= 200 &&
          pythonResponse.status < 300 &&
          pythonResponse.data?.prediction != null
        ) {
          prediction = pythonResponse.data.prediction;
          confidence = pythonResponse.data.confidence;
        } else {
          const piece = pythonApiErrorText(pythonResponse.data);
          console.error(
            '[Prediction] Python API HTTP',
            pythonResponse.status,
            piece,
            '→',
            config.pythonPredictUrl,
          );

          if (pythonResponse.status === 503) {
            res.status(503).json({
              message:
                'Model is not ready yet. In the Python terminal wait until you see “Model ready.” (first load can take a few minutes), then try again.',
            });
            return;
          }

          res.status(pythonResponse.status >= 400 ? pythonResponse.status : 502).json({
            message: piece,
          });
          return;
        }
      } catch (err) {
        const detail = axios.isAxiosError(err)
          ? err.code === 'ECONNREFUSED'
            ? 'nothing listening (connection refused)'
            : err.code === 'ECONNABORTED'
              ? 'request timed out (model may be slow on first run)'
              : err.message
          : String(err);
        console.error(
          '[Prediction] Python API error:',
          detail,
          '→',
          config.pythonPredictUrl,
        );
        res.status(502).json({
          message:
            `Cannot reach the model at ${config.pythonPredictUrl} (${detail}). ` +
            'In a terminal: cd backend && source ../fl_env/bin/activate && python main.py ' +
            '(wait until you see “Uvicorn running on … 8000”), then retry.',
        });
        return;
      }

      // Fire-and-forget save (if DB is connected)
      try {
        await Prediction.create({
          fileName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          prediction,
          confidence,
        });
      } catch (err) {
        // Log and continue – app should still respond
        console.error('[Prediction] Failed to persist prediction:', err);
      }

      res.json({ prediction, confidence });
    } catch (error) {
      console.error('[Prediction] Error handling /predict:', error);
      res.status(500).json({ message: 'Failed to analyze image' });
    }
  },
);

router.get(
  '/predictions/recent',
  async (req, res): Promise<void> => {
    try {
      const limit = Number(req.query.limit) || 5;

      const recent = await Prediction.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();

      res.json(recent);
    } catch (error) {
      console.error('[Prediction] Error fetching recent predictions:', error);
      res.status(500).json({ message: 'Failed to fetch recent predictions' });
    }
  },
);

export default router;

