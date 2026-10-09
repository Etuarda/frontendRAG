import { useEffect, useRef, useState } from 'react';
import type { AppView, Avaliacao, ConversationTurn } from '../../types/app';
import { SearchComposer } from '../../components/search/SearchComposer';
import { FollowUpComposer } from '../../components/search/FollowUpComposer';
import { ConversationTurnView } from '../../components/results/ConversationTurnView';
import { Icon } from '../../components/ui/Icon';
import { QueryTracePanel } from '../../components/trace/QueryTracePanel';
import { SessionTracePanel } from '../../components/trace/SessionTracePanel';

interface ConsultaPageProps {
  turns: ConversationTurn[];
  pendingQuery: string | null;
  loading: boolean;
  error: string | null;
  onSubmitQuery: (query: string) => void;
  onRated: (queryId: string, avaliacao: Avaliacao) => void;
  onNewConversation: () => void;
  onNavigate: (view: AppView) => void;
  sessionId: string | null;
}

export function ConsultaPage({
  turns,
  pendingQuery,
  loading,
  error,
  onSubmitQuery,
  onRated,
  onNewConversation,
  onNavigate,
  sessionId,
}: ConsultaPageProps) {
  const latestRef = useRef<HTMLDivElement>(null);
  const hasThread = turns.length > 0 || pendingQuery !== null;
  const [queryTraceId, setQueryTraceId] = useState<string | null>(null);
  const [showSessionTrace, setShowSessionTrace] = useState(false);

  // Leva o usuário até a pergunta nova, em vez de deixá-lo no topo da conversa.
  useEffect(() => {
    if (turns.length > 1 || pendingQuery) {
      latestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [turns.length, pendingQuery]);

  if (!hasThread) {
    return (
      <div className="consulta-page-container">
        <SearchComposer loading={loading} onSubmit={onSubmitQuery} onNavigate={onNavigate} />
        {error ? <QueryError message={error} /> : null}
      </div>
    );
  }

  const title = turns[0]?.response.query ?? pendingQuery;

  return (
    <div className="conversation-page">
      <header className="conversation-header">
        <div className="conversation-header-copy">
          <span className="result-badge-label">CONVERSA</span>
          <h1 className="conversation-title">{title}</h1>
        </div>
        <div className="conversation-header-actions">
        {sessionId ? <button type="button" className="btn-new-search-link" onClick={() => setShowSessionTrace(true)}>Caminho da conversa</button> : null}
        <button
          type="button"
          className="btn-new-search-link"
          onClick={onNewConversation}
          aria-label="Iniciar nova conversa"
        >
          <Icon name="plus" size={13} />
          <span>Nova conversa</span>
        </button>
        </div>
      </header>

      <div className="conversation-thread" aria-live="polite">
        {turns.map((turn, index) => (
          <div
            key={turn.response.query_id}
            ref={index === turns.length - 1 && !pendingQuery ? latestRef : null}
          >
            <ConversationTurnView turn={turn} onRated={onRated} onViewTrace={setQueryTraceId} />
          </div>
        ))}

        {pendingQuery ? (
          <div ref={latestRef} className="conversation-turn">
            <div className="turn-question">
              <p>{pendingQuery}</p>
            </div>
            <div className="processing-indicator-box" role="status">
              <div className="processing-spinner">
                <Icon name="refresh-cw" size={20} className="spin-animation" />
              </div>
              <div className="processing-text-group">
                <h2 className="processing-title">Consultando fontes oficiais...</h2>
                <p className="processing-sub">
                  A busca nas evidências pode levar alguns segundos.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {error && !loading ? <QueryError message={error} /> : null}
      </div>

      <div className="conversation-composer-dock">
        <FollowUpComposer loading={loading} onSubmit={onSubmitQuery} />
      </div>
      {queryTraceId && sessionId ? <QueryTracePanel queryId={queryTraceId} sessionId={sessionId} onClose={() => setQueryTraceId(null)} /> : null}
      {showSessionTrace && sessionId ? <SessionTracePanel sessionId={sessionId} onClose={() => setShowSessionTrace(false)} onOpenQuery={(id) => { setShowSessionTrace(false); setQueryTraceId(id); }} /> : null}
    </div>
  );
}

function QueryError({ message }: { message: string }) {
  return (
    <div className="error-notice-card" role="alert">
      <Icon name="info" size={18} />
      <div className="error-copy">
        <strong>Não foi possível concluir a consulta</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}
