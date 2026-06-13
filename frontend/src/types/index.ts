// Type definitions
export type JarvisState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type Language = 'ru' | 'kk';

export type SpeechInputError =
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'UNKNOWN';

export interface TTSOptions {
  lang: Language;
  rate: number;
  pitch: number;
}

export type Intent = 'BOOK_DOCTOR' | 'CALL_TAXI' | 'READ_SIGN' | 'NONE';

export interface JarvisResponse {
  text: string;
  speak: string;
  intent: Intent;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type JarvisAction =
  | { type: 'START_LISTENING' }
  | { type: 'TRANSCRIPT_RECEIVED'; payload: string }
  | { type: 'RESPONSE_RECEIVED'; payload: JarvisResponse }
  | { type: 'SPEECH_ENDED' }
  | { type: 'CANCEL' }
  | { type: 'ERROR'; payload: string };
