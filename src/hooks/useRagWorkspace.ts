import { useCallback, useState } from 'react';
import type { RagQueryRequest, RagResponse } from '../types';
import { ragService } from '../services/rag.service';
import { historyService } from '../services/history.service';

/** Estado da consulta atual (resposta, carregamento, filtros) compartilhado pelas telas. */
export function useRagWorkspace() {
  const [currentResponse, setCurrentResponse] = useState<RagResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fonteFilter, setFonteFilter] = useState<string>('todas');
  const [searchStrategy, setSearchStrategy] = useState<'automatica' | 'hibrida' | 'normativa'>('automatica');

  const submitQuery = useCallback(
    async (queryText: string) => {
      const normalized = queryText.trim();
      if (!normalized || loading) return;

      setLoading(true);
      setError(null);

      try {
        const payload: RagQueryRequest = {
          query: normalized,
          fonte_filter: fonteFilter !== 'todas' ? fonteFilter : undefined,
          search_strategy: searchStrategy,
        };

        const response = await ragService.query(payload);
        setCurrentResponse(response);

        // Salvar aqui garante que toda consulta concluída entre no histórico.
        historyService.saveQuery(response);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível concluir a consulta.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [loading, fonteFilter, searchStrategy]
  );

  const resetResponse = useCallback(() => {
    setCurrentResponse(null);
    setError(null);
  }, []);

  const selectHistoryResponse = useCallback((response: RagResponse) => {
    setCurrentResponse(response);
    setError(null);
  }, []);

  return {
    currentResponse,
    loading,
    error,
    fonteFilter,
    setFonteFilter,
    searchStrategy,
    setSearchStrategy,
    submitQuery,
    resetResponse,
    selectHistoryResponse,
  };
}
