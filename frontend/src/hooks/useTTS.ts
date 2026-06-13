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
  rate: 0.95,
  pitch: 0.75, // Более низкий pitch для мужского голоса
};

const MAX_TEXT_LENGTH = 500;

export function useTTS(): TTSHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const timeoutRef = useRef<number>();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      utterance.rate = mergedOptions.rate ?? 0.95;
      utterance.pitch = mergedOptions.pitch ?? 0.75;

      // Попытка выбрать мужской голос
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(voice => 
        voice.lang.startsWith(utterance.lang.split('-')[0]) && 
        (voice.name.toLowerCase().includes('male') || 
         voice.name.toLowerCase().includes('yuri') ||
         voice.name.toLowerCase().includes('dmitry') ||
         voice.name.toLowerCase().includes('milena') === false)
      );
      
      if (maleVoice) {
        utterance.voice = maleVoice;
        console.log('🎙️ Selected voice:', maleVoice.name);
      }

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
