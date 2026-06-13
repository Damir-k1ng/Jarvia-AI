import type { Message } from '../types/index.js';

/**
 * In-memory хранилище сессий
 * В продакшене можно заменить на Redis
 */

interface SessionData {
  messages: Message[];
  lastAccess: number;
}

const sessions = new Map<string, SessionData>();

const MAX_SESSIONS = 100;
const SESSION_TTL = 30 * 60 * 1000; // 30 минут

// Очистка старых сессий каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of sessions.entries()) {
    if (now - data.lastAccess > SESSION_TTL) {
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);

export const sessionStore = {
  async get(sessionId: string): Promise<Message[]> {
    const data = sessions.get(sessionId);
    if (data) {
      data.lastAccess = Date.now();
      return data.messages;
    }
    return [];
  },

  async set(sessionId: string, messages: Message[]): Promise<void> {
    // LRU eviction если слишком много сессий
    if (sessions.size >= MAX_SESSIONS && !sessions.has(sessionId)) {
      const oldestSession = Array.from(sessions.entries())
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess)[0];
      if (oldestSession) {
        sessions.delete(oldestSession[0]);
      }
    }

    sessions.set(sessionId, {
      messages,
      lastAccess: Date.now(),
    });
  },

  async clear(sessionId: string): Promise<void> {
    sessions.delete(sessionId);
  },
};
