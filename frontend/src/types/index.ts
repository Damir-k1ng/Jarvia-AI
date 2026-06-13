export type JarvisState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type Language = 'ru' | 'kk';
export type Intent = 'BOOK_DOCTOR' | 'CALL_TAXI' | 'READ_SIGN' | 'NONE';

export interface TTSOptions {
  lang: Language;
  rate: number;
  pitch: number;
}

export interface JarvisResponse {
  text: string;
  speak: string;
  intent: Intent;
  toolResult?: unknown;
}

export type JarvisAction =
  | { type: 'START_LISTENING' }
  | { type: 'TRANSCRIPT_RECEIVED'; payload: string }
  | { type: 'RESPONSE_RECEIVED'; payload: JarvisResponse }
  | { type: 'SPEECH_ENDED' }
  | { type: 'CANCEL' }
  | { type: 'ERROR'; payload: string };
