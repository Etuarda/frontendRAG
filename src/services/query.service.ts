import { apiRequest, TIMEOUT_QUERY_MS } from './api';
import type { ConversationHistoryTurn, RagQueryRequest, RagResponse } from '../types/api';

// Quantidade de evidências pedidas ao pipeline; o padrão do contrato também é 5.
const DEFAULT_TOP_K = 5;

/** Envia a pergunta ao pipeline RAG (POST /api/v1/query). */
export interface QueryContext {
  sessionId?: string | null;
  history?: ConversationHistoryTurn[];
}

export function queryRag(query: string, context: QueryContext = {}): Promise<RagResponse> {
  const body: RagQueryRequest = {
    query: query.trim(),
    top_k: DEFAULT_TOP_K,
    ...(context.sessionId ? { session_id: context.sessionId } : {}),
    ...(context.history?.length ? { historico: context.history.slice(-10) } : {}),
  };
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
