import { apiRequest } from './api';
import type { QueryTrace, SessionTrace } from '../types/api';

const auth = (sessionId: string) => ({ 'X-Session-Id': sessionId });

export function getQueryTrace(queryId: string, sessionId: string): Promise<QueryTrace> {
  return apiRequest(`/api/v1/trace/${encodeURIComponent(queryId)}`, { headers: auth(sessionId) });
}

export function getSessionTrace(sessionId: string): Promise<SessionTrace> {
  return apiRequest(`/api/v1/sessions/${encodeURIComponent(sessionId)}/trace`, { headers: auth(sessionId) });
}
