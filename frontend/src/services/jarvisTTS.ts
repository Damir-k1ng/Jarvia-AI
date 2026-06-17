// Сервис для воспроизведения голоса JARVIS из фильмов
// Использует готовые WAV файлы вместо синтеза речи

export type JarvisPhrase = 
  | 'greet'      // Приветствие
  | 'ok'         // Подтверждение
  | 'thanks'     // Благодарность
  | 'run'        // Запуск
  | 'off'        // Выключение
  | 'stupid'     // Непонимание
  | 'not_found'  // Не найдено
  | 'game_mode'  // Игровой режим
  | 'shazam_on'  // Активация
  | 'shazam_off'; // Деактивация

interface JarvisTTSOptions {
  phrase: JarvisPhrase;
  volume?: number; // 0.0 - 1.0
}

// Маппинг фраз на файлы
const PHRASE_FILES: Record<JarvisPhrase, string[]> = {
  greet: ['greet1.wav', 'greet2.wav', 'greet3.wav'],
  ok: ['ok1.wav', 'ok2.wav', 'ok3.wav', 'ok4.wav'],
  thanks: ['thanks.wav'],
  run: ['run.wav'],
  off: ['off.wav'],
  stupid: ['stupid.wav'],
  not_found: ['not_found.wav'],
  game_mode: ['game_mode.wav'],
  shazam_on: ['Shazam-Detected.wav'],
  shazam_off: ['Shazam-Detected-rev.wav'],
};

// Текущий проигрываемый аудио
let currentAudio: HTMLAudioElement | null = null;

/**
 * Воспроизвести фразу JARVIS
 */
export function playJarvisPhrase(options: JarvisTTSOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const { phrase, volume = 0.8 } = options;

    // Остановить предыдущее воспроизведение
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // Получить список файлов для фразы
    const files = PHRASE_FILES[phrase];
    if (!files || files.length === 0) {
      reject(new Error(`Фраза "${phrase}" не найдена`));
      return;
    }

    // Выбрать случайный файл (для разнообразия)
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const audioPath = `/sounds/jarvis-og/${randomFile}`;

    console.log('🎬 [JARVIS Audio] Playing:', audioPath);

    // Создать и воспроизвести аудио
    const audio = new Audio(audioPath);
    audio.volume = volume;
    currentAudio = audio;

    audio.onended = () => {
      console.log('🎬 [JARVIS Audio] Ended');
      currentAudio = null;
      resolve();
    };

    audio.onerror = (error) => {
      console.error('🎬 [JARVIS Audio] Error:', error);
      currentAudio = null;
      reject(error);
    };

    audio.play().catch(reject);
  });
}

/**
 * Остановить текущее воспроизведение
 */
export function stopJarvisPhrase(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Проверить, воспроизводится ли сейчас фраза
 */
export function isJarvisSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}

/**
 * Определить подходящую фразу JARVIS по тексту ответа
 */
export function detectJarvisPhrase(text: string): JarvisPhrase | null {
  const lowerText = text.toLowerCase();
  console.log('🔍 [detectJarvisPhrase] Анализ текста:', text);

  // Приветствия
  if (lowerText.match(/^(привет|здравствуй|добр|hi|hello|сәлем)/) ||
      lowerText.match(/я (джарвис|jarvis)/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: greet');
    return 'greet';
  }

  // Подтверждения действий (записываю, вызываю, записал, вызвал)
  if (lowerText.match(/записыва|вызыва|записал|вызвал|нашел|готово|сделал|выполнил/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: ok');
    return 'ok';
  }

  // Благодарность
  if (lowerText.match(/спасибо|благодар|thanks|рахмет/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: thanks');
    return 'thanks';
  }

  // Запуск/активация
  if (lowerText.match(/запуск|старт|начина|активир|включ/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: run');
    return 'run';
  }

  // Выключение
  if (lowerText.match(/выключ|стоп|завершен|деактивир/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: off');
    return 'off';
  }

  // Непонимание
  if (lowerText.match(/не понял|не понима|не знаю|извини|прости/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: stupid');
    return 'stupid';
  }

  // Не найдено
  if (lowerText.match(/не найден|не нашел|отсутству|нет данных/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: not_found');
    return 'not_found';
  }

  // Для коротких подтверждений
  if (lowerText.match(/^(хорошо|ладно|понял|ok|да|иә)$/)) {
    console.log('✅ [detectJarvisPhrase] Найдено: ok (короткое)');
    return 'ok';
  }

  console.log('❌ [detectJarvisPhrase] Фраза не найдена');
  return null;
}

// Made with Bob