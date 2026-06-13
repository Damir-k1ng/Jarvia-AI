import { env } from '../config/env.js';

/**
 * Клиент для alem.plus API
 * 
 * ВАЖНО: НЕ угадывать endpoints!
 * Сначала прочитать документацию по адресу env.ALEM_PLUS_BASE_URL
 */

export const alemplusClient = {
  async chat(messages: Array<{ role: string; content: string }>) {
    if (!env.ALEM_PLUS_BASE_URL || !env.ALEM_PLUS_API_KEY) {
      throw new Error('alem.plus not configured');
    }

    // TODO: Прочитать документацию и реализовать правильный endpoint
    throw new Error('Not implemented - check alem.plus documentation first');
  },

  async transcribe(audioBuffer: Buffer) {
    if (!env.ALEM_PLUS_BASE_URL || !env.ALEM_PLUS_API_KEY) {
      throw new Error('alem.plus not configured');
    }

    // TODO: Прочитать документацию и реализовать правильный endpoint
    throw new Error('Not implemented - check alem.plus documentation first');
  },

  async ocr(imageBuffer: Buffer) {
    if (!env.ALEM_PLUS_BASE_URL || !env.ALEM_PLUS_API_KEY) {
      throw new Error('alem.plus not configured');
    }

    // TODO: Прочитать документацию и реализовать правильный endpoint
    throw new Error('Not implemented - check alem.plus documentation first');
  },
};
