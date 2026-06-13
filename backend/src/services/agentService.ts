import type { Intent, JarvisResponse, Message, ToolMode, LLMResponse } from '../types/index.js';
import { bookDoctor } from '../tools/bookDoctor.js';
import { callTaxi } from '../tools/callTaxi.js';
import { readSign } from '../tools/readSign.js';
import { env } from '../config/env.js';

/**
 * Агент-сервис: определяет намерение и вызывает нужный tool
 */

// Простая эвристика для определения намерения (для demo mode)
function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();
  
  if (lower.includes('врач') || lower.includes('доктор') || lower.includes('запис')) {
    return 'BOOK_DOCTOR';
  }
  
  if (lower.includes('такси') || lower.includes('машин')) {
    return 'CALL_TAXI';
  }
  
  if (lower.includes('прочита') || lower.includes('вывеск') || lower.includes('текст') || lower.includes('камер')) {
    return 'READ_SIGN';
  }
  
  return 'NONE';
}

// Получить ответ от LLM (alem.plus)
async function getLLMResponse(messages: Message[]): Promise<LLMResponse> {
  if (env.DEMO_MODE) {
    // Demo mode - простая эвристика
    const lastMessage = messages[messages.length - 1];
    const intent = detectIntent(lastMessage?.content || '');
    
    const responses: Record<Intent, string> = {
      BOOK_DOCTOR: 'Хорошо, записываю вас к врачу',
      CALL_TAXI: 'Вызываю такси',
      READ_SIGN: 'Сейчас прочитаю текст с изображения',
      NONE: 'Я JARVIS, ваш голосовой помощник. Могу записать к врачу, вызвать такси или прочитать текст.',
    };

    return {
      intent,
      speak: responses[intent] || responses.NONE,
    };
  }

  // Live mode - реальный запрос к alem.plus LLM
  // TODO: Прочитать документацию alem.plus и реализовать правильный endpoint
  throw new Error('Live mode LLM not implemented - check alem.plus documentation first');
}

export async function processMessage(
  userMessage: string,
  sessionMessages: Message[],
  mode: ToolMode = 'demo'
): Promise<JarvisResponse> {
  // Добавить сообщение пользователя
  const messages: Message[] = [
    ...sessionMessages,
    { role: 'user', content: userMessage },
  ];

  // Получить намерение от LLM
  const llmResponse = await getLLMResponse(messages);

  // Выполнить соответствующий tool
  let toolResult = null;

  switch (llmResponse.intent) {
    case 'BOOK_DOCTOR':
      toolResult = await bookDoctor(userMessage, mode);
      break;
    case 'CALL_TAXI':
      toolResult = await callTaxi(userMessage, mode);
      break;
    case 'READ_SIGN':
      // READ_SIGN вызывается отдельно через /api/ocr
      break;
    case 'NONE':
      // Обычный разговор
      break;
  }

  return {
    text: toolResult?.speak || llmResponse.speak,
    speak: toolResult?.speak || llmResponse.speak,
    intent: llmResponse.intent,
    toolResult,
  };
}
