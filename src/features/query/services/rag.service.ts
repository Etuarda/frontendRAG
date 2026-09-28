import type { RagQueryRequest, RagResponse } from '../../../domain/rag/types';
import { mockQuery } from '../../../mocks/rag.mock';

const configuredApiUrl = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
const API_BASE_URL = (configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:8000' : ''))
  .replace(/\/$/, '');
const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true';

function apiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('API não configurada. Defina VITE_API_BASE_URL com a URL HTTPS do backend.');
  }
  return `${API_BASE_URL}${path}`;
}

class RagService {
  async query(payload: RagQueryRequest): Promise<RagResponse> {
    if (USE_MOCKS) {
      return mockQuery(payload.query);
    }

    const response = await fetch(apiUrl('/api/v1/query'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null) as { detail?: string } | null;
      throw new Error(error?.detail ?? `Falha ao consultar o RAG: HTTP ${response.status}`);
    }

    return (await response.json()) as RagResponse;
  }

  async health(): Promise<boolean> {
    if (USE_MOCKS) return true;

    try {
      const response = await fetch(apiUrl('/health'), { method: 'GET' });
      if (!response.ok) return false;
      const body = await response.json() as { status?: unknown };
      return body.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const ragService = new RagService();
