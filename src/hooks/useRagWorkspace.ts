import { useCallback, useRef, useState } from 'react';
import type { Avaliacao, ConversationTurn } from '../types/app';
import { queryRag } from '../services/query.service';
import { errorMessage } from './useApiResource';
import { sessionService } from '../services/session.service';

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
        const historico = turns.map(({ response }) => ({ pergunta: response.query, resposta: response.answer }));
        const response = await queryRag(normalized, historico);
        if (requestId !== requestIdRef.current) return;
        setTurns((current) => [...current, { response }]);
      } catch (err) {
        if (requestId === requestIdRef.current) setError(errorMessage(err));
      } finally {
        if (requestId === requestIdRef.current) setPendingQuery(null);
      }
    },
    [loading, turns]
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
    sessionService.clearSession();
  }, []);

  /** Reabre uma consulta do histórico como início de conversa, para poder continuar perguntando. */
  return {
    turns,
    pendingQuery,
    loading,
    error,
    submitQuery,
    markRated,
    startNewConversation,
    sessionId: sessionService.getSessionId(),
  };
}
