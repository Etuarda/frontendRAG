import { useState } from 'react';
import type { HistoryItem } from '../../types/api';
import { useHistory } from '../../hooks/useHistory';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState';
import { EVIDENCE_LEVEL_LABELS } from '../../constants/labels';
import { formatDateTime } from '../../utils/format';

interface HistoricoPageProps {
  onOpenItem: (item: HistoryItem) => void;
  onNewQuery: () => void;
}

const SUMMARY_LENGTH = 160;

function summarize(text: string): string {
  const flat = text.replace(/\n+/g, ' ');
  return flat.length > SUMMARY_LENGTH ? `${flat.slice(0, SUMMARY_LENGTH)}...` : flat;
}

export function HistoricoPage({ onOpenItem, onNewQuery }: HistoricoPageProps) {
  const { status, items, error, reload } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra só o que já veio do backend; não cria nem completa registros.
  const term = searchTerm.trim().toLowerCase();
  const filtered = items.filter((item) => item.query.toLowerCase().includes(term));

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">REGISTRO DE CONSULTAS</span>
        <h1 className="page-title">Histórico</h1>
        <p className="page-description">
          Consultas gravadas pelo servidor, da mais recente para a mais antiga. Abra uma consulta para
          rever a resposta e continuar perguntando.
        </p>
      </header>

      {status === 'success' ? (
        <div className="history-toolbar">
          <div className="history-search-input">
            <Icon name="search" size={15} />
            <input
              type="search"
              placeholder="Filtrar consultas carregadas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filtrar consultas carregadas"
            />
          </div>
        </div>
      ) : null}

      {status === 'loading' ? <LoadingState label="Carregando histórico..." /> : null}

      {status === 'error' && error ? <ErrorState message={error} onRetry={reload} /> : null}

      {status === 'empty' ? (
        <EmptyState title="Nenhuma consulta registrada ainda.">
          <button type="button" className="btn-empty-start" onClick={onNewQuery}>
            <Icon name="plus" size={15} />
            <span>Fazer a primeira consulta</span>
          </button>
        </EmptyState>
      ) : null}

      {status === 'success' && filtered.length === 0 ? (
        <EmptyState title="Nenhuma consulta corresponde ao filtro." />
      ) : null}

      {status === 'success' && filtered.length > 0 ? (
        <ul className="history-items-feed" aria-label="Consultas registradas">
          {filtered.map((item) => {
            const lastFeedback = item.feedback[item.feedback.length - 1];
            return (
              <li key={item.query_id} className="history-feed-card">
                <button
                  type="button"
                  className="feed-card-open"
                  onClick={() => onOpenItem(item)}
                  aria-label={`Abrir consulta: ${item.query}`}
                >
                  <div className="feed-card-header">
                    <span className="feed-card-timestamp">
                      <Icon name="clock" size={13} />
                      <time dateTime={item.ts}>{formatDateTime(item.ts)}</time>
                    </span>
                    <span className="feed-card-badge">
                      {EVIDENCE_LEVEL_LABELS[item.resposta.confidence_level]}
                    </span>
                  </div>

                  <h2 className="feed-card-query">{item.query}</h2>
                  <p className="feed-card-summary">{summarize(item.resposta.answer)}</p>

                  <div className="feed-card-footer">
                    <span className="feed-card-sources">
                      <Icon name="file-text" size={13} />
                      <span>
                        {item.resposta.sources_used.length}{' '}
                        {item.resposta.sources_used.length === 1 ? 'fonte' : 'fontes'}
                      </span>
                    </span>
                    <span className="feed-card-sources">
                      <Icon name={lastFeedback?.avaliacao === 'negativo' ? 'thumbs-down' : 'thumbs-up'} size={13} />
                      <span>
                        {lastFeedback
                          ? lastFeedback.avaliacao === 'positivo'
                            ? 'Avaliada como útil'
                            : 'Avaliada como não útil'
                          : 'Sem avaliação'}
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
