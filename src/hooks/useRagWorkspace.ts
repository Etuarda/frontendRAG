import { useCallback, useRef, useState } from 'react';
import type { Conversation, ConversationTurn, RagQueryRequest } from '../types';
import { ragService } from '../services/rag.service';
import { createId, historyService } from '../services/history.service';

// Poucos turnos bastam para o contexto e mantêm a requisição leve.
const CONTEXT_TURNS = 5;

/** Estado da conversa atual (turnos, carregamento, filtros) compartilhado pelas telas. */
export function useRagWorkspace() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fonteFilter, setFonteFilter] = useState<string>('todas');
  const [searchStrategy, setSearchStrategy] = useState<'automatica' | 'hibrida' | 'normativa'>('automatica');

  const conversationRef = useRef<Conversation | null>(null);
  // Cada envio ganha um número; trocar de conversa invalida respostas ainda a caminho.
  const requestIdRef = useRef(0);
  const updateConversation = useCallback((next: Conversation | null) => {
    conversationRef.current = next;
    setConversation(next);
  }, []);

  const loading = pendingQuery !== null;

  const submitQuery = useCallback(
    async (queryText: string) => {
      const normalized = queryText.trim();
      if (!normalized || loading) return;

      const base = conversationRef.current;
      const requestId = ++requestIdRef.current;
      setPendingQuery(normalized);
      setError(null);

      try {
        const payload: RagQueryRequest = {
          query: normalized,
          fonte_filter: fonteFilter !== 'todas' ? fonteFilter : undefined,
          search_strategy: searchStrategy,
          conversation_id: base?.id,
          history: base?.turns
            .slice(-CONTEXT_TURNS)
            .map((turn) => ({ query: turn.query, answer: turn.response.answer })),
        };

        const response = await ragService.query(payload);
        if (requestId !== requestIdRef.current) return;

        const now = new Date().toISOString();
        const turn: ConversationTurn = {
          id: createId('turn'),
          query: normalized,
          response,
          created_at: now,
        };
        const next: Conversation = base
          ? { ...base, updated_at: now, turns: [...base.turns, turn] }
          : { id: createId('conv'), title: normalized, created_at: now, updated_at: now, turns: [turn] };

        updateConversation(next);
        // Salvar a cada turno garante que nenhuma pergunta se perca se a aba fechar.
        historyService.saveConversation(next);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        const message = err instanceof Error ? err.message : 'Não foi possível concluir a consulta.';
        setError(message);
      } finally {
        if (requestId === requestIdRef.current) setPendingQuery(null);
      }
    },
    [loading, fonteFilter, searchStrategy, updateConversation]
  );

  const rateTurn = useCallback(
    (turnId: string, useful: boolean) => {
      const current = conversationRef.current;
      if (!current) return;
      const next = {
        ...current,
        turns: current.turns.map((turn) => (turn.id === turnId ? { ...turn, feedback: useful } : turn)),
      };
      updateConversation(next);
      historyService.saveConversation(next);
    },
    [updateConversation]
  );

  const startNewConversation = useCallback(() => {
    requestIdRef.current++;
    updateConversation(null);
    setPendingQuery(null);
    setError(null);
  }, [updateConversation]);

  const openConversation = useCallback(
    (saved: Conversation) => {
      requestIdRef.current++;
      updateConversation(saved);
      setPendingQuery(null);
      setError(null);
    },
    [updateConversation]
  );

  return {
    conversation,
    pendingQuery,
    loading,
    error,
    fonteFilter,
    setFonteFilter,
    searchStrategy,
    setSearchStrategy,
    submitQuery,
    rateTurn,
    startNewConversation,
    openConversation,
  };
}
