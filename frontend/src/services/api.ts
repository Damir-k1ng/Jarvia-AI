// API client для backend (опционально в demo mode)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendChatMessage(message: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  const data = await response.json();
  return data.speak;
}
