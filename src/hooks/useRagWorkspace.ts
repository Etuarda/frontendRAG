import { useCallback, useRef, useState } from 'react';
import type { HistoryItem } from '../types/api';
import type { Avaliacao, ConversationTurn } from '../types/app';
import { queryRag } from '../services/query.service';
import { errorMessage } from './useApiResource';

/**
 * Conversa da sessão atual: turnos em memória, sem persistência no navegador.
 * Cada consulta é gravada pelo próprio backend e aparece no Histórico.
 */
export function useRagWorkspace() {
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Trocar de conversa invalida respostas ainda a caminho.
  const requestIdRef = useRef(0);

  const loading = pendingQuery !== null;

  const submitQuery = useCallback(
    async (queryText: string) => {
      const normalized = queryText.trim();
      if (!normalized || loading) return;

      const requestId = ++requestIdRef.current;
      setPendingQuery(normalized);
      setError(null);

      try {
        const response = await queryRag(normalized);
        if (requestId !== requestIdRef.current) return;
        setTurns((current) => [...current, { response }]);
      } catch (err) {
        if (requestId === requestIdRef.current) setError(errorMessage(err));
      } finally {
        if (requestId === requestIdRef.current) setPendingQuery(null);
      }
    },
    [loading]
  );

  /** Marca o turno como avaliado só depois que o backend confirmou o feedback. */
  const markRated = useCallback((queryId: string, avaliacao: Avaliacao) => {
    setTurns((current) =>
      current.map((turn) =>
        turn.response.query_id === queryId ? { ...turn, feedback: avaliacao } : turn
      )
    );
  }, []);

  const startNewConversation = useCallback(() => {
    requestIdRef.current++;
    setTurns([]);
    setPendingQuery(null);
    setError(null);
  }, []);

  /** Reabre uma consulta do histórico como início de conversa, para poder continuar perguntando. */
  const openHistoryItem = useCallback((item: HistoryItem) => {
    requestIdRef.current++;
    const lastFeedback = item.feedback[item.feedback.length - 1];
    setTurns([
      {
        response: { ...item.resposta, query_id: item.query_id },
        feedback: lastFeedback?.avaliacao,
      },
    ]);
    setPendingQuery(null);
    setError(null);
  }, []);

  return {
    turns,
    pendingQuery,
    loading,
    error,
    submitQuery,
    markRated,
    startNewConversation,
    openHistoryItem,
  };
}
