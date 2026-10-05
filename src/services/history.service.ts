import { apiClient } from './api';
import type { Conversation, ConversationTurn, HistoryItem } from '../types';

const STORAGE_KEY = 'nexo_conversations_v1';
const LEGACY_KEY = 'nexo_session_history_v2';
const MAX_CONVERSATIONS = 50;

type Listener = () => void;

export function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Converte uma consulta avulsa (formato antigo ou do backend) em conversa de um turno. */
function fromHistoryItem(item: HistoryItem): Conversation {
  const response = item.full_response ?? {
    query: item.query,
    answer: item.answer_summary,
    bases_consultadas: ['estruturada'],
    sources_used: item.sources_used || [],
    confidence_level: item.confidence_level || 'alta',
    is_refusal: false,
    refusal_reason: null,
  };
  const turn: ConversationTurn = {
    id: item.id,
    query: item.query,
    response,
    created_at: item.created_at,
  };
  return {
    id: item.id,
    title: item.query,
    created_at: item.created_at,
    updated_at: item.created_at,
    turns: [turn],
  };
}

class HistoryService {
  private listeners = new Set<Listener>();

  /** Permite que sidebar e página de histórico reflitam a mesma lista sem recarregar. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Lista as conversas, da mais recente para a mais antiga.
   * O armazenamento local é a fonte principal; consultas do backend (GET /api/v1/history)
   * entram como conversas de um turno quando ainda não existem localmente.
   */
  async getConversations(): Promise<Conversation[]> {
    const local = this.readLocal();

    try {
      const remote = await apiClient<HistoryItem[]>('/api/v1/history', { method: 'GET' });
      if (Array.isArray(remote)) {
        const knownIds = new Set(local.flatMap((c) => [c.id, ...c.turns.map((t) => t.id)]));
        const missing = remote.filter((item) => !knownIds.has(item.id)).map(fromHistoryItem);
        return sortByRecent([...local, ...missing]);
      }
    } catch {
      // Backend indisponível: o histórico local já basta.
    }

    return local;
  }

  /** Cria ou atualiza a conversa, movendo-a para o topo do histórico. */
  saveConversation(conversation: Conversation): void {
    const others = this.readLocal().filter((c) => c.id !== conversation.id);
    this.writeLocal([conversation, ...others].slice(0, MAX_CONVERSATIONS));
  }

  deleteConversation(id: string): void {
    this.writeLocal(this.readLocal().filter((c) => c.id !== id));
  }

  async clearHistory(): Promise<void> {
    try {
      await apiClient('/api/v1/history', { method: 'DELETE' });
    } catch {
      // A limpeza local deve acontecer mesmo se o backend falhar.
    }
    this.writeLocal([]);
  }

  private readLocal(): Conversation[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Conversation[];
      return this.migrateLegacy();
    } catch {
      return [];
    }
  }

  /** Consultas salvas antes das conversas viram conversas de um turno, sem perder nada. */
  private migrateLegacy(): Conversation[] {
    const raw =
      window.localStorage.getItem(LEGACY_KEY) || window.sessionStorage.getItem(LEGACY_KEY);
    if (!raw) return [];

    const migrated = (JSON.parse(raw) as HistoryItem[]).map(fromHistoryItem);
    this.writeLocal(migrated, false);
    window.localStorage.removeItem(LEGACY_KEY);
    window.sessionStorage.removeItem(LEGACY_KEY);
    return migrated;
  }

  private writeLocal(conversations: Conversation[], notify = true): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Storage pode estar bloqueado (modo privado ou cota cheia); histórico é opcional.
    }
    if (notify) this.listeners.forEach((listener) => listener());
  }
}

function sortByRecent(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export const historyService = new HistoryService();
