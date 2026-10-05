import { useEffect, useRef } from 'react';
import type { AppView, Conversation } from '../../types';
import { SearchComposer } from '../../components/search/SearchComposer';
import { FollowUpComposer } from '../../components/search/FollowUpComposer';
import { ConversationTurnView } from '../../components/results/ConversationTurnView';
import { Icon } from '../../components/ui/Icon';

interface ConsultaPageProps {
  conversation: Conversation | null;
  pendingQuery: string | null;
  loading: boolean;
  error: string | null;
  fonteFilter: string;
  onFonteChange: (fonte: string) => void;
  searchStrategy: 'automatica' | 'hibrida' | 'normativa';
  onStrategyChange: (strategy: 'automatica' | 'hibrida' | 'normativa') => void;
  onSubmitQuery: (query: string) => void;
  onRateTurn: (turnId: string, useful: boolean) => void;
  onNewConversation: () => void;
  onNavigate: (view: AppView) => void;
}

export function ConsultaPage({
  conversation,
  pendingQuery,
  loading,
  error,
  fonteFilter,
  onFonteChange,
  searchStrategy,
  onStrategyChange,
  onSubmitQuery,
  onRateTurn,
  onNewConversation,
  onNavigate,
}: ConsultaPageProps) {
  const latestRef = useRef<HTMLDivElement>(null);
  const turnCount = conversation?.turns.length ?? 0;
  const hasThread = turnCount > 0 || pendingQuery !== null;

  // Leva o usuário até a pergunta nova, em vez de deixá-lo no topo da conversa.
  useEffect(() => {
    if (turnCount > 1 || pendingQuery) {
      latestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [turnCount, pendingQuery]);

  if (!hasThread) {
    return (
      <div className="consulta-page-container">
        <SearchComposer
          loading={loading}
          onSubmit={onSubmitQuery}
          onNavigate={onNavigate}
          fonteFilter={fonteFilter}
          onFonteChange={onFonteChange}
          searchStrategy={searchStrategy}
          onStrategyChange={onStrategyChange}
        />
        {error ? <ErrorNotice message={error} /> : null}
      </div>
    );
  }

  const turns = conversation?.turns ?? [];

  return (
    <div className="conversation-page">
      <header className="conversation-header">
        <div className="conversation-header-copy">
          <span className="result-badge-label">CONVERSA</span>
          <h1 className="conversation-title">{conversation?.title ?? pendingQuery}</h1>
        </div>
        <button
          type="button"
          className="btn-new-search-link"
          onClick={onNewConversation}
          aria-label="Iniciar nova conversa"
        >
          <Icon name="plus" size={13} />
          <span>Nova conversa</span>
        </button>
      </header>

      <div className="conversation-thread" aria-live="polite">
        {turns.map((turn, index) => (
          <div key={turn.id} ref={index === turns.length - 1 && !pendingQuery ? latestRef : null}>
            <ConversationTurnView turn={turn} onRate={onRateTurn} />
          </div>
        ))}

        {pendingQuery ? (
          <div ref={latestRef} className="conversation-turn">
            <div className="turn-question">
              <p>{pendingQuery}</p>
            </div>
            <div className="processing-indicator-box">
              <div className="processing-spinner">
                <Icon name="refresh-cw" size={20} className="spin-animation" />
              </div>
              <div className="processing-text-group">
                <h2 className="processing-title">Consultando fontes oficiais...</h2>
                <p className="processing-sub">
                  Buscando e cruzando evidências em editais, atas e contratos vigentes do Rio de Janeiro.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {error && !loading ? <ErrorNotice message={error} /> : null}
      </div>

      <div className="conversation-composer-dock">
        <FollowUpComposer loading={loading} onSubmit={onSubmitQuery} />
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
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
