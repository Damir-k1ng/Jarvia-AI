import { useState, useEffect, useCallback, useRef } from 'react';
import type { TTSOptions, Language } from '../types';

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
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    console.log('🔇 TTS cancel');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(
    (text: string, options: Partial<TTSOptions> = {}) => {
      console.log('🔊 TTS speak called:', text.substring(0, 50) + '...');
      
      if (!isSupported) {
        console.warn('⚠️ TTS не поддерживается');
        return;
      }

      if (isSpeaking) {
        console.log('🔇 Cancelling previous speech');
        cancel();
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

      let textToSpeak = text;
      if (text.length > MAX_TEXT_LENGTH) {
        textToSpeak = text.substring(0, MAX_TEXT_LENGTH) + '...';
      }

      const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      const langMap: Record<Language, string> = {
        ru: 'ru-RU',
        kk: 'kk-KZ',
      };
      utterance.lang = langMap[mergedOptions.lang] || 'ru-RU';
      utterance.rate = mergedOptions.rate ?? 1.0;
      utterance.pitch = mergedOptions.pitch ?? 0.8;

      // Используем лучший голос если он найден
      if (bestVoiceRef.current) {
        utterance.voice = bestVoiceRef.current;
        console.log('🎙️ Using voice:', bestVoiceRef.current.name);
      } else {
        console.warn('⚠️ No specific voice selected, using default');
      }

      // Добавляем паузы для естественности
      utterance.text = textToSpeak
        .replace(/\./g, '. ')
        .replace(/,/g, ', ')
        .replace(/:/g, ': ');

      utterance.onstart = () => {
        console.log('▶️ TTS started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('⏹️ TTS ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      utterance.onerror = (event) => {
        console.error('❌ TTS error:', event);
        setIsSpeaking(false);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      console.log('🎤 Calling speechSynthesis.speak()');
      console.log('📊 Settings:', {
        voice: utterance.voice?.name || 'default',
        rate: utterance.rate,
        pitch: utterance.pitch,
        lang: utterance.lang
      });

      // Важно: сначала отменяем все предыдущие, потом говорим
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      // iOS fallback timeout
      const estimatedDuration = (textToSpeak.length / 10) * 1000 + 2000;
      console.log(`⏱️ Setting fallback timeout: ${estimatedDuration}ms`);
      timeoutRef.current = window.setTimeout(() => {
        console.log('⏱️ Fallback timeout triggered');
        if (isSpeaking) {
          setIsSpeaking(false);
          utteranceRef.current = null;
        }
      }, estimatedDuration);
    },
    [isSupported, isSpeaking, cancel]
  );

  return {
    speak,
    cancel,
    isSupported,
    isSpeaking,
  };
}
