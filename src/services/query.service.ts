import { apiRequest, TIMEOUT_QUERY_MS } from './api';
import type { RagQueryRequest, RagResponse } from '../types/api';

// Quantidade de evidências pedidas ao pipeline; o padrão do contrato também é 5.
const DEFAULT_TOP_K = 5;

/** Envia a pergunta ao pipeline RAG (POST /api/v1/query). */
export function queryRag(query: string): Promise<RagResponse> {
  const body: RagQueryRequest = { query: query.trim(), top_k: DEFAULT_TOP_K };
  return apiRequest<RagResponse>('/api/v1/query', {
    method: 'POST',
    body,
    timeoutMs: TIMEOUT_QUERY_MS,
  });
}
