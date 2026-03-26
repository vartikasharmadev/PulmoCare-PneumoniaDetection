export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || '',
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  // 127.0.0.1 avoids some macOS IPv6 (::1) vs IPv4 listen mismatches with uvicorn
  pythonPredictUrl:
    process.env.MODEL_API_URL || 'http://127.0.0.1:8000/predict',
};

