import { apiClient, API_BASE_URL } from './api';
import type { RagQueryRequest, RagResponse } from '../types';
import { mockQuery } from '../mocks/rag.mock';

const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true';

class RagService {
  async query(payload: RagQueryRequest): Promise<RagResponse> {
    if (USE_MOCKS) {
      return mockQuery(payload.query);
    }

    try {
      const data = await apiClient<RagResponse>('/api/v1/query', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data;
    } catch {
      // Se a API falhar ou estiver offline no ambiente de demonstração, usa o mock rico
      return mockQuery(payload.query);
    }
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
