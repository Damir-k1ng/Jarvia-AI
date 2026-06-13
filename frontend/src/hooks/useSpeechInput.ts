import { useState, useCallback, useRef, useEffect } from 'react';
import type { SpeechInputError } from '../types';

interface SpeechInputHook {
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  transcript: string;
  error: SpeechInputError | null;
  isSupported: boolean;
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEMO_DELAY = 1500;
const TIMEOUT_MS = 10000;

export function useSpeechInput(): SpeechInputHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<SpeechInputError | null>(null);
  const [isSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number>();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!isSupported || DEMO_MODE) return;

    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.error('❌ SpeechRecognition API not available');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // Настройки распознавания
    recognition.lang = 'ru-RU';
    recognition.continuous = false;  // Останавливаться после одной фразы
    recognition.interimResults = false;  // Только финальные результаты
    recognition.maxAlternatives = 1;

    console.log('🎤 SpeechRecognition initialized:', {
      lang: recognition.lang,
      continuous: recognition.continuous,
      interimResults: recognition.interimResults
    });

    recognition.onstart = () => {
      console.log('🎤 Recognition started');
      setIsListening(true);
      setError(null);
      isProcessingRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('📝 Recognition result event:', event);
      
      if (isProcessingRef.current) {
        console.log('⚠️ Already processing, ignoring duplicate result');
        return;
      }
      
      isProcessingRef.current = true;

      const result = event.results[0];
      if (result && result[0]) {
        const transcriptText = result[0].transcript.trim();
        const confidence = result[0].confidence;
        
        console.log('✅ Transcript:', transcriptText);
        console.log('📊 Confidence:', confidence);
        
        if (transcriptText) {
          setTranscript(transcriptText);
          setIsListening(false);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        } else {
          console.warn('⚠️ Empty transcript');
          setError('UNKNOWN');
          setIsListening(false);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Recognition error:', event.error, event.message);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      let errorType: SpeechInputError;
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          errorType = 'PERMISSION_DENIED';
          break;
        case 'network':
          errorType = 'NETWORK_ERROR';
          break;
        case 'aborted':
          errorType = 'ABORTED';
          break;
        case 'no-speech':
          errorType = 'TIMEOUT';
          break;
        default:
          errorType = 'UNKNOWN';
      }

      setError(errorType);
      setIsListening(false);
      isProcessingRef.current = false;
    };

    recognition.onend = () => {
      console.log('🎤 Recognition ended');
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('⚠️ Error stopping recognition:', e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    console.log('🎤 startListening called');
    setTranscript('');
    setError(null);
    isProcessingRef.current = false;

    if (DEMO_MODE) {
      console.log('🎭 DEMO MODE: Simulating speech input');
      setIsListening(true);
      
      timeoutRef.current = window.setTimeout(() => {
        const demoTranscripts = [
          'запиши меня к терапевту',
          'вызови такси',
          'прочитай вывеску'
        ];
        const randomTranscript = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];
        
        console.log('🎭 DEMO: Setting transcript:', randomTranscript);
        setTranscript(randomTranscript);
        setIsListening(false);
      }, DEMO_DELAY);
      return;
    }

    if (!isSupported) {
      console.error('❌ Speech recognition not supported');
      setError('NOT_SUPPORTED');
      return;
    }

    if (!recognitionRef.current) {
      console.error('❌ Recognition not initialized');
      setError('UNKNOWN');
      return;
    }

    try {
      console.log('🎤 Starting recognition...');
      recognitionRef.current.start();

      // Таймаут на случай если распознавание зависнет
      timeoutRef.current = window.setTimeout(() => {
        console.warn('⏱️ Recognition timeout');
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.warn('⚠️ Error stopping on timeout:', e);
          }
          setError('TIMEOUT');
          setIsListening(false);
        }
      }, TIMEOUT_MS);
    } catch (err) {
      console.error('❌ Error starting recognition:', err);
      setError('UNKNOWN');
      setIsListening(false);
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    console.log('🛑 stopListening called');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (DEMO_MODE) {
      setIsListening(false);
      return;
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('⚠️ Error stopping recognition:', err);
      }
    }
    
    setIsListening(false);
  }, [isListening]);

  return {
    startListening,
    stopListening,
    isListening,
    transcript,
    error,
    isSupported,
  };
}
