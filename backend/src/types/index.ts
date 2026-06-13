// Типы для бэкенда
export type Intent = 'BOOK_DOCTOR' | 'CALL_TAXI' | 'READ_SIGN' | 'NONE';
export type Language = 'ru' | 'kk';
export type ToolMode = 'demo' | 'live';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface BookDoctorResult {
  success: boolean;
  mode: ToolMode;
  doctorName: string | null;
  specialty: string | null;
  appointmentTime: string | null;
  clinicName: string | null;
  speak: string;
  errorCode: string | null;
}

export interface CallTaxiResult {
  success: boolean;
  mode: ToolMode;
  driverName: string | null;
  carModel: string | null;
  plateNumber: string | null;
  etaMinutes: number | null;
  priceEstimate: number | null;
  currency: 'KZT';
  speak: string;
  errorCode: string | null;
}

export interface ReadSignResult {
  success: boolean;
  mode: ToolMode;
  extractedText: string;
  confidence: number | null;
  speak: string;
  errorCode: string | null;
}

export type ToolResult = BookDoctorResult | CallTaxiResult | ReadSignResult;

export interface JarvisResponse {
  text: string;
  speak: string;
  intent: Intent;
  toolResult: ToolResult | null;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  language?: Language;
  mode?: ToolMode;
}

export interface LLMResponse {
  intent: Intent;
  speak: string;
}
