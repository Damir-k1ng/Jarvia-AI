import type { JarvisResponse } from '../types';

export function getDemoResponse(transcript: string): JarvisResponse {
  const lower = transcript.toLowerCase();

  if (lower.includes('терапевт') || lower.includes('врач') || lower.includes('доктор')) {
    return {
      text: 'Записываю вас к терапевту',
      speak: 'Записал вас к терапевту Айгуль Сериковой на завтра в 10 утра в поликлинику номер 5',
      intent: 'BOOK_DOCTOR',
      toolResult: {
        success: true,
        doctorName: 'Айгуль Серикова',
        specialty: 'Терапевт',
        appointmentTime: 'Завтра 10:00',
        clinicName: 'Поликлиника №5',
      },
    };
  }

  if (lower.includes('такси') || lower.includes('машин')) {
    return {
      text: 'Вызываю такси',
      speak: 'Такси вызвано. Водитель Ерлан на белой Тойота Камри приедет через 5 минут. Стоимость поездки 1200 тенге',
      intent: 'CALL_TAXI',
      toolResult: {
        success: true,
        driverName: 'Ерлан',
        carModel: 'Toyota Camry',
        plateNumber: '777 ABC 01',
        etaMinutes: 5,
        priceEstimate: 1200,
      },
    };
  }

  if (lower.includes('вывеск') || lower.includes('прочита') || lower.includes('текст')) {
    return {
      text: 'Прочитаю текст',
      speak: 'На вывеске написано: Аптека 24 часа. Режим работы круглосуточно',
      intent: 'READ_SIGN',
      toolResult: {
        success: true,
        extractedText: 'Аптека 24 часа\nРежим работы: круглосуточно',
        confidence: 0.95,
      },
    };
  }

  return {
    text: 'Понял',
    speak: 'Я вас слушаю. Скажите что нужно сделать: записать к врачу, вызвать такси или прочитать текст',
    intent: 'NONE',
  };
}
