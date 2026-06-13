const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendChatMessage(message: string, sessionId: string) {
  const response = await fetch(\`\${API_BASE}/api/chat\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, mode: 'demo' }),
  });
  if (!response.ok) throw new Error('Chat request failed');
  return response.json();
}
