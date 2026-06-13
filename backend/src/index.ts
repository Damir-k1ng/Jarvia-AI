import express from 'express';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, logger } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import speechRouter from './routes/speech.js';
import ocrRouter from './routes/ocr.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api', healthRouter);
app.use('/api', chatRouter);
app.use('/api', speechRouter);
app.use('/api', ocrRouter);

// Error handler (должен быть последним)
app.use(errorHandler);

// Запуск сервера
app.listen(env.PORT, () => {
  logger.info(`🚀 JARVIS Backend запущен на порту ${env.PORT}`);
  logger.info(`📍 Режим: ${env.DEMO_MODE ? 'DEMO' : 'LIVE'}`);
  logger.info(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
});
