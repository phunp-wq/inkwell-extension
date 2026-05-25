import { getSettings } from './storage';

export type PipelineEvents = {
  start: { url: string };
  extracted: {
    id: string;
    title: string;
    siteName: string;
    byline: string;
    wordCount: number;
  };
  ai_start: Record<string, never>;
  summary_chunk: { text: string };
  done: {
    id: string;
    url: string;
    title: string;
    summary: string;
    tags: string[];
    category: string;
    lang: string;
  };
  error: { message: string; code?: string; id?: string };
};

type Handler = <K extends keyof PipelineEvents>(name: K, data: PipelineEvents[K]) => void;

export async function runPipeline(url: string, onEvent: Handler): Promise<void> {
  const { apiUrl, token } = await getSettings();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${apiUrl}/api/pipeline/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url }),
  });

  if (!res.ok || !res.body) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      if (!part.trim()) continue;
      let eventName = 'message';
      let dataLine = '';
      for (const line of part.split('\n')) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLine += line.slice(5).trim();
      }
      if (!dataLine) continue;
      try {
        const data = JSON.parse(dataLine);
        onEvent(eventName as keyof PipelineEvents, data);
      } catch (e) {
        console.warn('[pipeline] parse error', e, dataLine);
      }
    }
  }
}

export type RecentItem = {
  id: string;
  title: string;
  url: string;
  category: string | null;
  saved_at: string;
};

export async function fetchRecent(limit = 3): Promise<RecentItem[]> {
  const { apiUrl, token } = await getSettings();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${apiUrl}/api/recent?limit=${limit}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function toggleFavorite(id: string): Promise<{ favorite: boolean }> {
  const { apiUrl, token } = await getSettings();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${apiUrl}/api/articles/${id}/favorite`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
