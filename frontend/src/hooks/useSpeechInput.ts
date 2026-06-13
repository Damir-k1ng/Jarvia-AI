import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '../types';

type SpeechInputError = 'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'NETWORK_ERROR' | 'TIMEOUT' | 'ABORTED' | 'UNKNOWN';

interface SpeechInputHook {
  startListening: (language?: Language) => void;
  stopListening: () => void;
  isListening: boolean;
  transcript: string;
  error: SpeechInputError | null;
  isSupported: boolean;
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const TIMEOUT_MS = 10000;

export function useSpeechInput(): SpeechInputHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<SpeechInputError | null>(null);
  const [isSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback((language: Language = 'ru') => {
    setError(null);
    setTranscript('');

    if (DEMO_MODE) {
      setIsListening(true);
      setTimeout(() => {
        setTranscript('запиши меня к терапевту');
        setIsListening(false);
      }, 1500);
      return;
    }

    if (!isSupported) {
      setError('NOT_SUPPORTED');
      return;
    }

    try {
      const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || window.SpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setError('NOT_SUPPORTED');
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.lang = language === 'kk' ? 'kk-KZ' : 'ru-RU';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        timeoutRef.current = window.setTimeout(() => {
          setError('TIMEOUT');
          stopListening();
        }, TIMEOUT_MS);
      };

      recognition.onresult = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const result = event.results[0];
        if (result?.[0]) setTranscript(result[0].transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        let errorType: SpeechInputError = 'UNKNOWN';
        if (event.error === 'not-allowed') errorType = 'PERMISSION_DENIED';
        else if (event.error === 'network') errorType = 'NETWORK_ERROR';
        else if (event.error === 'aborted') errorType = 'ABORTED';
        else if (event.error === 'no-speech') errorType = 'TIMEOUT';
        setError(errorType);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setError('UNKNOWN');
      setIsListening(false);
    }
  }, [isSupported, stopListening]);

  return { startListening, stopListening, isListening, transcript, error, isSupported };
}
