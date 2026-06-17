import { useState, useEffect, useCallback, useRef } from 'react';
import type { TTSOptions, Language } from '../types';
import { playJarvisPhrase, stopJarvisPhrase, isJarvisSpeaking, detectJarvisPhrase } from '../services/jarvisTTS';

interface TTSHook {
  speak: (text: string, options?: Partial<TTSOptions>) => void;
  cancel: () => void;
  isSupported: boolean;
  isSpeaking: boolean;
}

const DEFAULT_OPTIONS: TTSOptions = {
  lang: 'ru',
  rate: 1.0,
  pitch: 0.8,  // Немного ниже для мужского голоса
};

const MAX_TEXT_LENGTH = 500;

export function useTTS(): TTSHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const timeoutRef = useRef<number>();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);
  const bestVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const checkIntervalRef = useRef<number>();

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        
        // Ищем лучший русский голос
        const russianVoices = voices.filter(v => v.lang.startsWith('ru'));
        
        console.log('🎙️ Available Russian voices:', russianVoices.map(v => v.name));
        
        // Приоритет голосов
        const preferredNames = ['Yuri', 'Google русский', 'Milena', 'Microsoft Pavel'];
        
        for (const preferred of preferredNames) {
          const voice = russianVoices.find(v => v.name.includes(preferred));
          if (voice) {
            bestVoiceRef.current = voice;
            console.log('✅ Selected voice:', voice.name);
            return;
          }
        }
        
        // Если не нашли предпочтительный, берём первый русский
        if (russianVoices.length > 0) {
          bestVoiceRef.current = russianVoices[0];
          console.log('✅ Selected fallback voice:', russianVoices[0].name);
        }
      }
    };

    // Загружаем голоса сразу
    loadVoices();
    
    // И подписываемся на событие загрузки
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      stopJarvisPhrase();
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    console.log('🔇 TTS cancel');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    // Остановить браузерный TTS
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    
    // Остановить JARVIS аудио
    stopJarvisPhrase();
    
    setIsSpeaking(false);
  }, []);

  /**
   * Озвучивание через голос JARVIS (WAV файлы)
   */
  const speakWithJarvis = useCallback(
    async (text: string) => {
      try {
        console.log('🎬 [JARVIS TTS] Текст для озвучивания:', text);
        setIsSpeaking(true);

        // Определить подходящую фразу JARVIS
        const phrase = detectJarvisPhrase(text);
        console.log('🎬 [JARVIS TTS] Определенная фраза:', phrase);
        
        if (phrase) {
          // Воспроизвести готовую фразу JARVIS
          console.log('🎬 [JARVIS TTS] Воспроизведение голоса JARVIS:', phrase);
          await playJarvisPhrase({ phrase, volume: 0.8 });
          console.log('🎬 [JARVIS TTS] Воспроизведение завершено');
          setIsSpeaking(false);
        } else {
          // Если нет подходящей фразы - использовать браузерный TTS
          console.log('🤖 [Browser TTS] Фраза не найдена, используем браузерный TTS');
          speakWithBrowser(text, DEFAULT_OPTIONS);
        }
      } catch (error) {
        console.error('❌ [JARVIS TTS] Ошибка:', error);
        setIsSpeaking(false);
        // Fallback на браузерный TTS
        speakWithBrowser(text, DEFAULT_OPTIONS);
      }
    },
    []
  );

  /**
   * Озвучивание через браузерный Web Speech API
   */
  const speakWithBrowser = useCallback(
    (text: string, options: TTSOptions) => {
      if (!isSupported) {
        console.warn('TTS не поддерживается в этом браузере');
        return;
      }

      // Если голоса ещё не загружены, загружаем их сейчас
      if (!voicesLoadedRef.current) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const russianVoices = voices.filter(v => v.lang.startsWith('ru'));
          if (russianVoices.length > 0) {
            bestVoiceRef.current = russianVoices[0];
            voicesLoadedRef.current = true;
          }
        }
      }

      // Создать utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Настроить язык
      const langMap: Record<Language, string> = {
        ru: 'ru-RU',
        kk: 'kk-KZ',
      };
      utterance.lang = langMap[options.lang] || 'ru-RU';
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 0.8;

      // Используем лучший голос если он найден
      if (bestVoiceRef.current) {
        utterance.voice = bestVoiceRef.current;
        console.log('🎙️ Using voice:', bestVoiceRef.current.name);
      }

      // Обработчики событий
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      utterance.onerror = (event) => {
        console.error('Browser TTS ошибка:', event);
        setIsSpeaking(false);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      // Запустить озвучивание
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      // Fallback таймаут для iOS
      const estimatedDuration = (text.length / 10) * 1000 + 2000;
      timeoutRef.current = window.setTimeout(() => {
        if (isSpeaking) {
          setIsSpeaking(false);
          utteranceRef.current = null;
        }
      }, estimatedDuration);
    },
    [isSupported, isSpeaking]
  );

  const speak = useCallback(
    (text: string, options: Partial<TTSOptions> = {}) => {
      console.log('🎤 [TTS speak] ВЫЗВАНА ФУНКЦИЯ speak()');
      console.log('🎤 [TTS speak] Текст:', text);
      
      // Если уже говорит - сначала остановить
      if (isSpeaking) {
        console.log('🎤 [TTS speak] Останавливаем предыдущее воспроизведение');
        cancel();
      }

      // Обрезать слишком длинный текст
      let textToSpeak = text;
      if (text.length > MAX_TEXT_LENGTH) {
        textToSpeak = text.substring(0, MAX_TEXT_LENGTH) + '...';
      }

      const mergedOptions: TTSOptions = { ...DEFAULT_OPTIONS, ...options };

      console.log('🎤 [TTS speak] Вызываем speakWithJarvis()');
      // Попробовать использовать голос JARVIS
      speakWithJarvis(textToSpeak);
    },
    [isSpeaking, cancel, speakWithJarvis]
  );

  // Проверять статус JARVIS аудио
  useEffect(() => {
    checkIntervalRef.current = window.setInterval(() => {
      if (isSpeaking && !isJarvisSpeaking() && !utteranceRef.current) {
        setIsSpeaking(false);
      }
    }, 100);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isSpeaking]);

  return {
    speak,
    cancel,
    isSupported,
    isSpeaking,
  };
}
