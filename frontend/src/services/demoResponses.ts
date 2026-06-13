import type { Intent, JarvisResponse } from '../types';

export function getDemoResponse(transcript: string): JarvisResponse {
  const lower = transcript.toLowerCase();
  
  let intent: Intent = 'NONE';
  let speak = '';
  
  if (lower.includes('терапевт') || lower.includes('врач') || lower.includes('доктор')) {
    intent = 'BOOK_DOCTOR';
    speak = 'Хорошо, записываю вас к терапевту на завтра в 10 утра. Клиника на Абая 150. Подтверждение отправлено на ваш телефон.';
  } else if (lower.includes('такси') || lower.includes('машин')) {
    intent = 'CALL_TAXI';
    speak = 'Вызываю такси. Водитель Асхат на белой Тойоте Камри, номер А777АА приедет через 5 минут. Стоимость поездки 1500 тенге.';
  } else if (lower.includes('вывеск') || lower.includes('прочита') || lower.includes('текст')) {
    intent = 'READ_SIGN';
    speak = 'На вывеске написано: Аптека 24 часа. Режим работы круглосуточно. Принимаем карты Каспи.';
  } else {
    intent = 'NONE';
    speak = 'Я вас слушаю. Чем могу помочь?';
  }
  
  return {
    text: speak,
    speak,
    intent,
  };
}
