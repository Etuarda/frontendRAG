import { apiRequest, TIMEOUT_QUERY_MS } from './api';
import type { RagQueryRequest, RagResponse } from '../types/api';

// Quantidade de evidências pedidas ao pipeline; o padrão do contrato também é 5.
const DEFAULT_TOP_K = 5;

interface QueryOptions {
  sessionId?: string;
  historico?: { pergunta: string; resposta: string | null }[];
}

/** Envia a pergunta ao pipeline RAG (POST /api/v1/query). */
export function queryRag(query: string, options?: QueryOptions): Promise<RagResponse> {
  const body: RagQueryRequest = { query: query.trim(), top_k: DEFAULT_TOP_K };
  if (options?.sessionId) body.session_id = options.sessionId;
  if (options?.historico?.length) body.historico = options.historico;
  return apiRequest<RagResponse>('/api/v1/query', {
    method: 'POST',
    body,
    timeoutMs: TIMEOUT_QUERY_MS,
  });
}
