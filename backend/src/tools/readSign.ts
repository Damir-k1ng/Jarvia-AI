import type { ReadSignResult, ToolMode } from '../types/index.js';
import { env } from '../config/env.js';

export async function readSign(
  imageBuffer: Buffer,
  mode: ToolMode = 'demo'
): Promise<ReadSignResult> {
  if (mode === 'demo') {
    await new Promise(resolve => setTimeout(resolve, 800));

    const exampleTexts = [
      'Аптека 24/7\nКруглосуточно',
      'Магазин "Продукты"\nРежим работы: 8:00 - 22:00',
      'Кафе "Алатау"\nДоставка еды',
      'Банкомат Kaspi\nКруглосуточно',
    ];

    const randomText = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];

    return {
      success: true,
      mode: 'demo',
      extractedText: randomText || '',
      confidence: 0.95,
      speak: `На вывеске написано: ${randomText?.replace('\n', '. ')}`,
      errorCode: null,
    };
  }

  try {
    if (!env.ALEM_PLUS_BASE_URL || !env.ALEM_PLUS_API_KEY || !env.ALEM_PLUS_OCR_MODEL) {
      throw new Error('alem.plus OCR not configured');
    }
    throw new Error('Live mode not implemented - check alem.plus documentation first');
  } catch (error) {
    return {
      success: false,
      mode: 'live',
      extractedText: '',
      confidence: null,
      speak: 'Извините, не удалось прочитать текст. Попробуйте сделать фото ближе.',
      errorCode: 'OCR_FAILED',
    };
  }
}
