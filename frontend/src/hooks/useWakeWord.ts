import { useState, useEffect, useCallback, useRef } from 'react';

interface WakeWordHook {
  isListening: boolean;
  isActive: boolean;
  startListening: () => void;
  stopListening: () => void;
  pauseListening: () => void;
  resumeListening: () => void;
  lastHeard: string;
}

const WAKE_WORDS = ['джарвис', 'jarvis', 'жарвис', 'ярвис'];
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export function useWakeWord(onWakeWordDetected: () => void): WakeWordHook {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isProcessingRef = useRef(false);

  const checkForWakeWord = useCallback((transcript: string): boolean => {
    const lowerTranscript = transcript.toLowerCase().trim();
    setLastHeard(lowerTranscript);
    
    const hasWakeWord = WAKE_WORDS.some(word => lowerTranscript.includes(word));
    
    if (hasWakeWord) {
      console.log('🎯 Wake word detected:', lowerTranscript);
      return true;
    }
    
    return false;
  }, []);

  const stopListening = useCallback(() => {
    console.log('🛑 Wake word listening stopped');
    setIsListening(false);
    setIsPaused(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const pauseListening = useCallback(() => {
    console.log('⏸️ Wake word listening paused');
    setIsPaused(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resumeListening = useCallback(() => {
    console.log('▶️ Wake word listening resumed');
    setIsPaused(false);
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to resume recognition:', e);
      }
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (DEMO_MODE) {
      console.log('🎤 Wake word listening started (demo mode)');
      setIsListening(true);
      return;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('⚠️ Speech recognition not supported');
      return;
    }

    try {
      const SpeechRecognitionAPI = 
        (window as any).webkitSpeechRecognition || window.SpeechRecognition;
      
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ru-RU';

      recognition.onstart = () => {
        console.log('🎤 Wake word listening started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (isProcessingRef.current || isPaused) return;

        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;

        console.log('👂 Heard:', transcript);

        if (checkForWakeWord(transcript)) {
          isProcessingRef.current = true;
          setIsActive(true);
          
          // Останавливаем wake word detection
          pauseListening();
          
          // Активируем основной STT
          onWakeWordDetected();
          
          // Сбрасываем флаг и возобновляем через 10 секунд
          setTimeout(() => {
            isProcessingRef.current = false;
            setIsActive(false);
            resumeListening();
          }, 10000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Wake word recognition error:', event.error);
        
        if (event.error !== 'aborted' && event.error !== 'no-speech' && !isPaused) {
          setTimeout(() => {
            if (recognitionRef.current && !isPaused) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🔄 Wake word recognition ended');
        if (isListening && !isPaused) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Failed to start wake word recognition:', error);
    }
  }, [isListening, isPaused, checkForWakeWord, onWakeWordDetected, pauseListening, resumeListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    isActive,
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    lastHeard,
  };
}
