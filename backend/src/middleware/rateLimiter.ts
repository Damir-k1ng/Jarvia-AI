import type { Request, Response, NextFunction } from 'express';

// Простой in-memory rate limiter
const requests = new Map<string, number[]>();

const WINDOW_MS = 60000; // 1 минута
const MAX_REQUESTS = 60; // 60 запросов в минуту

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const userRequests = requests.get(ip)!;
  
  // Удалить старые запросы
  const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return res.status(429).json({
      ok: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
      },
    });
  }

  recentRequests.push(now);
  requests.set(ip, recentRequests);

  next();
}
