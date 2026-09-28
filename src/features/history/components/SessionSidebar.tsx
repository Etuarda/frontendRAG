import type { ApiHealthStatus, SessionEntry } from '../../../domain/rag/types';
import { CONFIDENCE_LABELS } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';
import { formatTime } from '../../../shared/utils/formatters';

interface SessionSidebarProps {
  open: boolean;
  entries: SessionEntry[];
  currentQuery?: string;
  apiStatus: ApiHealthStatus;
  onSelect: (entry: SessionEntry) => void;
  onClear: () => void;
}

const apiLabels: Record<ApiHealthStatus, string> = {
  checking: 'Verificando API',
  online: 'API conectada',
  offline: 'API indisponível',
};

export function SessionSidebar({ open, entries, currentQuery, apiStatus, onSelect, onClear }: SessionSidebarProps) {
  return (
    <aside className={`session-sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-heading">
        <div><Icon name="clock" size={15} /><span>Histórico da sessão</span></div>
        {entries.length > 0 ? (
          <button type="button" className="clear-history" onClick={onClear}><Icon name="trash" size={13} />Limpar</button>
        ) : null}
      </div>

      <div className="history-scroll">
        {entries.length === 0 ? (
          <div className="empty-history">
            <div className="empty-history-icon"><Icon name="terminal" size={20} /></div>
            <strong>Nenhuma consulta realizada.</strong>
            <span>As perguntas desta sessão aparecerão aqui.</span>
          </div>
        ) : (
          entries.map((entry) => {
            const response = entry.response;
            const active = response.query === currentQuery;
            return (
              <button key={entry.id} type="button" className={`history-card ${active ? 'is-active' : ''}`} onClick={() => onSelect(entry)}>
                <div className="history-card-meta">
                  <span className={`history-status ${response.is_refusal ? 'is-refusal' : ''}`}>{CONFIDENCE_LABELS[response.confidence_level]}</span>
                  <span>{formatTime(entry.createdAt)}</span>
                </div>
                <strong>{response.query}</strong>
              </button>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <span>Adaptive RAG</span>
        <span className={`api-state api-${apiStatus}`}><i />{apiLabels[apiStatus]}</span>
      </div>
    </aside>
  );
}
