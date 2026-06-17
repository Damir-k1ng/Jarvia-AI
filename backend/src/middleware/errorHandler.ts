import type { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { env } from '../config/env.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    err,
    method: req.method,
    url: req.url,
  });

  res.status(500).json({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    },
  });
}

export { logger };
