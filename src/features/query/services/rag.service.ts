import type { RagQueryRequest, RagResponse } from '../../../domain/rag/types';
import { mockQuery } from '../../../mocks/rag.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true';

class RagService {
  async query(payload: RagQueryRequest): Promise<RagResponse> {
    if (USE_MOCKS) {
      return mockQuery(payload.query);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Falha ao consultar o RAG: HTTP ${response.status}`);
    }

    return (await response.json()) as RagResponse;
  }

  async health(): Promise<boolean> {
    if (USE_MOCKS) return true;

    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ragService = new RagService();
