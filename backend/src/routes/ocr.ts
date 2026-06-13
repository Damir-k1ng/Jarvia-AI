import { Router } from 'express';
import multer from 'multer';
import { readSign } from '../tools/readSign.js';
import { env } from '../config/env.js';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/ocr', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'NO_FILE',
          message: 'No image file provided',
        },
      });
    }

    const mode = env.DEMO_MODE ? 'demo' : 'live';
    const result = await readSign(req.file.buffer, mode);

    res.json({
      ok: true,
      data: {
        text: result.extractedText,
        confidence: result.confidence,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
