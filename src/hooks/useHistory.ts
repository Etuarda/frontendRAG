import { useCallback, useEffect, useState } from 'react';
import type { Conversation } from '../types';
import { historyService } from '../services/history.service';

/** Expõe as conversas salvas com estados de carregamento e erro para a UI. */
export function useHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setError(null);
    try {
      setConversations(await historyService.getConversations());
    } catch {
      setError('Não foi possível carregar o histórico no momento.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que outra parte do app salva, apaga ou limpa conversas.
  useEffect(() => {
    fetchHistory();
    return historyService.subscribe(fetchHistory);
  }, [fetchHistory]);

  const deleteConversation = useCallback((id: string) => {
    historyService.deleteConversation(id);
  }, []);

  const clearHistory = useCallback(async () => {
    await historyService.clearHistory();
  }, []);

  return { conversations, loading, error, deleteConversation, clearHistory };
}
