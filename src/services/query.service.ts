import { apiRequest, TIMEOUT_QUERY_MS } from './api';
import type { ConversationHistoryItem, RagQueryRequest, RagResponse } from '../types/api';
import { ApiError } from './api';
import { sessionService } from './session.service';

// Quantidade de evidências pedidas ao pipeline; o padrão do contrato também é 5.
const DEFAULT_TOP_K = 5;

/** Envia a pergunta ao pipeline RAG (POST /api/v1/query). */
function invalidSession(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status !== 422) return false;
  return JSON.stringify(error.data).toLowerCase().includes('session_id');
}

async function send(body: RagQueryRequest): Promise<RagResponse> {
  return apiRequest<RagResponse>('/api/v1/query', {
    method: 'POST',
    body,
    timeoutMs: TIMEOUT_QUERY_MS,
  });
}

export async function queryRag(query: string, historico: ConversationHistoryItem[] = []): Promise<RagResponse> {
  const sessionId = sessionService.getSessionId();
  const body: RagQueryRequest = {
    query: query.trim(), top_k: DEFAULT_TOP_K,
    ...(sessionId ? { session_id: sessionId } : {}),
    ...(historico.length ? { historico: historico.slice(-10) } : {}),
  };
  try {
    const response = await send(body);
    sessionService.setSessionId(response.session_id);
    return response;
  } catch (error) {
    if (!sessionId || !invalidSession(error)) throw error;
    sessionService.clearSession();
    const response = await send({ ...body, session_id: undefined });
    sessionService.setSessionId(response.session_id);
    return response;
  }
}
