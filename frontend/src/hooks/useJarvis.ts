import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { useTTS } from './useTTS';
import { useSpeechInput } from './useSpeechInput';
import type { JarvisState, JarvisAction, Language } from '../types';
import { getDemoResponse } from '../services/demoResponses';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

interface JarvisHook {
  state: JarvisState;
  language: Language;
  setLanguage: (lang: Language) => void;
  startListening: () => void;
  cancel: () => void;
  lastResponse: string;
}

function jarvisReducer(state: JarvisState, action: JarvisAction): JarvisState {
  console.log('🔄 State transition:', state, '→', action.type);
  
  switch (action.type) {
    case 'START_LISTENING':
      return state === 'idle' ? 'listening' : state;
    case 'TRANSCRIPT_RECEIVED':
      return state === 'listening' ? 'thinking' : state;
    case 'RESPONSE_RECEIVED':
      return state === 'thinking' ? 'speaking' : state;
    case 'SPEECH_ENDED':
      return state === 'speaking' ? 'idle' : state;
    case 'ERROR':
      return 'error';
    case 'CANCEL':
      return 'idle';
    default:
      return state;
  }
}

export function useJarvis(): JarvisHook {
  const [state, dispatch] = useReducer(jarvisReducer, 'idle');
  const [language, setLanguage] = useState<Language>('ru');
  const [lastResponse, setLastResponse] = useState('');
  const processedTranscriptRef = useRef<string>('');
  
  const { speak, cancel: cancelTTS, isSpeaking } = useTTS();
  const { startListening: startSTT, transcript, error: sttError } = useSpeechInput();

  // Handle STT errors
  useEffect(() => {
    if (sttError) {
      console.error('❌ STT Error:', sttError);
      dispatch({ type: 'ERROR', payload: sttError });
    }
  }, [sttError]);

  // Handle transcript received
  useEffect(() => {
    if (transcript && state === 'listening' && transcript !== processedTranscriptRef.current) {
      console.log('📝 Transcript received:', transcript);
      processedTranscriptRef.current = transcript;
      
      dispatch({ type: 'TRANSCRIPT_RECEIVED', payload: transcript });
      
      // Process response
      setTimeout(() => {
        console.log('🤔 Processing response...');
        const response = getDemoResponse(transcript);
        console.log('💬 Response:', response);
        
        setLastResponse(response.speak);
        dispatch({ type: 'RESPONSE_RECEIVED', payload: response });
        
        // Start speaking
        console.log('🔊 Starting TTS...');
        speak(response.speak, { lang: language });
      }, 800);
    }
  }, [transcript, state, language, speak]);

  // Handle speech ended
  useEffect(() => {
    console.log('🔊 isSpeaking:', isSpeaking, 'state:', state);
    if (!isSpeaking && state === 'speaking') {
      console.log('✅ Speech ended, returning to idle');
      dispatch({ type: 'SPEECH_ENDED' });
    }
  }, [isSpeaking, state]);

  const startListening = useCallback(() => {
    console.log('🎤 Start listening');
    processedTranscriptRef.current = '';
    dispatch({ type: 'START_LISTENING' });
    startSTT(language);
  }, [language, startSTT]);

  const cancel = useCallback(() => {
    console.log('❌ Cancel');
    cancelTTS();
    processedTranscriptRef.current = '';
    dispatch({ type: 'CANCEL' });
  }, [cancelTTS]);

  return { state, language, setLanguage, startListening, cancel, lastResponse };
}
