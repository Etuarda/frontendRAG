import { apiRequest } from './api';
import type { HistoryItem } from '../types/api';

// Máximo aceito pelo contrato; o histórico não tem paginação por offset.
export const HISTORY_LIMIT = 100;

/** Consultas persistidas pelo backend, da mais recente para a mais antiga (GET /api/v1/history). */
export function getHistory(limit = HISTORY_LIMIT): Promise<HistoryItem[]> {
  return apiRequest<HistoryItem[]>('/api/v1/history', { params: { limit } });
}
