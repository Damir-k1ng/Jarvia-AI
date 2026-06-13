import { Router } from 'express';
import { z } from 'zod';
import { processMessage } from '../services/agentService.js';
import { sessionStore } from '../services/sessionStore.js';

const router = Router();

const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string(),
  language: z.enum(['ru', 'kk']).optional(),
  mode: z.enum(['demo', 'live']).optional(),
});

router.post('/chat', async (req, res, next) => {
  try {
    const body = chatRequestSchema.parse(req.body);

    // Получить историю сессии
    const sessionMessages = await sessionStore.get(body.sessionId);

    // Обработать сообщение
    const response = await processMessage(
      body.message,
      sessionMessages,
      body.mode || 'demo'
    );

    // Сохранить в историю
    await sessionStore.set(body.sessionId, [
      ...sessionMessages,
      { role: 'user', content: body.message },
      { role: 'assistant', content: response.text },
    ]);

    res.json({
      ok: true,
      data: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0]?.message || 'Invalid request',
        },
      });
    }
    next(error);
  }
});

export default router;
