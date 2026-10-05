import { useCallback, useEffect, useState } from 'react';
import type { HistoryItem } from '../types';
import { historyService } from '../services/history.service';

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await historyService.getHistory();
      setItems(data);
    } catch {
      setError('Não foi possível carregar o histórico no momento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const clearHistory = useCallback(async () => {
    await historyService.clearHistory();
    setItems([]);
  }, []);

  return {
    items,
    loading,
    error,
    refresh: fetchHistory,
    clearHistory,
  };
}
