import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/speech/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'NO_FILE',
          message: 'No audio file provided',
        },
      });
    }

    // TODO: Реализовать транскрипцию через alem.plus
    // Пока возвращаем заглушку
    res.json({
      ok: true,
      data: {
        transcript: 'Демо транскрипция',
        confidence: 0.95,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
