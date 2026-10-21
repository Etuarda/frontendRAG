import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState';
import { Icon } from '../../components/ui/Icon';
import { useHistory } from '../../hooks/useHistory';
import { formatDateTime } from '../../utils/format';
import type { HistoryItem } from '../../types/api';

interface HistoricoPageProps {
  sessionId: string | null;
  onNewQuery: () => void;
  onOpenConversation: (item: HistoryItem) => void;
}

export function HistoricoPage({ sessionId, onNewQuery, onOpenConversation }: HistoricoPageProps) {
  const history = useHistory(sessionId);
  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">CONVERSA ATUAL</span>
        <h1 className="page-title">Histórico</h1>
        <p className="page-description">Somente as consultas da sua sessão atual, identificada com segurança pelo navegador.</p>
      </header>

      {!sessionId ? (
        <EmptyState title="Inicie uma conversa para consultar o histórico desta sessão.">
          <button type="button" className="btn-empty-start" onClick={onNewQuery}>
            <Icon name="plus" size={15} /><span>Nova conversa</span>
          </button>
        </EmptyState>
      ) : null}
      {sessionId && history.status === 'loading' ? <LoadingState label="Carregando histórico..." /> : null}
      {sessionId && history.status === 'error' && history.error ? <ErrorState message={history.error} onRetry={history.reload} /> : null}
      {sessionId && history.status === 'empty' ? <EmptyState title="Nenhuma consulta nesta conversa." /> : null}
      {sessionId && history.status === 'success' ? (
        <ul className="history-items-feed" aria-label="Consultas desta conversa">
          {history.items.map((item) => (
            <li key={item.query_id} className="history-feed-card history-feed-card--clickable">
              <button
                type="button"
                className="history-feed-card-btn"
                onClick={() => onOpenConversation(item)}
                aria-label={`Abrir conversa: ${item.query}`}
              >
                <div className="feed-card-header">
                  <strong>{item.query}</strong>
                  <time dateTime={item.ts}>{formatDateTime(item.ts)}</time>
                </div>
                <p>{item.resposta.answer}</p>
                <span className="feed-card-cta"><Icon name="arrow-right" size={14} /> Abrir conversa</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
