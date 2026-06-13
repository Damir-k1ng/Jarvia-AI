import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

const startTime = Date.now();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    data: {
      status: 'ok',
      mode: env.DEMO_MODE ? 'demo' : 'live',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    },
  });
});

export default router;
