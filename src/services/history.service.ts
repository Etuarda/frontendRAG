import { apiClient } from './api';
import type { HistoryItem, RagResponse } from '../types';

const LOCAL_STORAGE_KEY = 'nexo_session_history_v2';

class HistoryService {
  /**
   * Busca o histórico no backend (GET /api/v1/history).
   * Offline, usa o armazenamento local para o usuário não perder suas consultas.
   */
  async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await apiClient<HistoryItem[]>('/api/v1/history', {
        method: 'GET',
      });
      if (Array.isArray(data)) {
        return data;
      }
    } catch {
      // Backend indisponível: segue para o histórico local.
    }

    return this.getLocalHistory();
  }

  /**
   * Salva a consulta localmente, sem duplicar perguntas e limitada a 50 itens para não estourar o storage.
   */
  saveQuery(response: RagResponse): HistoryItem {
    const summary = response.answer
      ? response.answer.slice(0, 160).replace(/\n/g, ' ') + (response.answer.length > 160 ? '...' : '')
      : 'Sem resposta gerada';

    const newItem: HistoryItem = {
      id: response.pipeline_metadata?.query_id || `hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      query: response.query,
      answer_summary: summary,
      created_at: new Date().toISOString(),
      confidence_level: response.confidence_level,
      sources_count: response.sources_used.length,
      sources_used: response.sources_used,
      full_response: response,
    };

    const current = this.getLocalHistory();
    const updated = [newItem, ...current.filter((item) => item.query !== response.query)].slice(0, 50);
    this.setLocalHistory(updated);

    return newItem;
  }

  async clearHistory(): Promise<void> {
    try {
      await apiClient('/api/v1/history', { method: 'DELETE' });
    } catch {
      // A limpeza local deve acontecer mesmo se o backend falhar.
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  private getLocalHistory(): HistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw =
        window.sessionStorage.getItem(LOCAL_STORAGE_KEY) ||
        window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as HistoryItem[];
    } catch {
      return [];
    }
  }

  private setLocalHistory(items: HistoryItem[]) {
    if (typeof window === 'undefined') return;
    try {
      const str = JSON.stringify(items);
      window.sessionStorage.setItem(LOCAL_STORAGE_KEY, str);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, str);
    } catch {
      // Storage pode estar bloqueado (modo privado ou cota cheia); histórico é opcional.
    }
  }
}

export const historyService = new HistoryService();
