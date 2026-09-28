import type { ApiHealthStatus, SessionEntry } from '../../../domain/rag/types';
import { EVIDENCE_LEVEL_LABELS } from '../../../domain/rag/catalog';
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
  checking: 'Verificando serviço...',
  online: 'Sistema disponível',
  offline: 'Não foi possível conectar ao serviço. Tente novamente em alguns instantes.',
};

export function SessionSidebar({
  open,
  entries,
  currentQuery,
  apiStatus,
  onSelect,
  onClear,
}: SessionSidebarProps) {
  return (
    <aside className={`session-sidebar ${open ? 'is-open' : ''}`} aria-label="Histórico da sessão">
      <div className="sidebar-heading">
        <div>
          <Icon name="clock" size={15} />
          <span>Histórico da Sessão</span>
        </div>
        {entries.length > 0 ? (
          <button
            type="button"
            className="clear-history"
            onClick={onClear}
            aria-label="Limpar histórico da sessão"
          >
            <Icon name="trash" size={13} />
            <span>Limpar</span>
          </button>
        ) : null}
      </div>

      <div className="history-scroll">
        {entries.length === 0 ? (
          <div className="empty-history">
            <div className="empty-history-icon">
              <Icon name="search" size={18} />
            </div>
            <strong>Nenhuma consulta recente.</strong>
            <span>As perguntas desta sessão serão listadas aqui.</span>
          </div>
        ) : (
          entries.map((entry) => {
            const response = entry.response;
            const active = response.query === currentQuery;
            const isRefusal = response.is_refusal;
            const level = response.confidence_level;
            return (
              <button
                key={entry.id}
                type="button"
                className={`history-card ${active ? 'is-active' : ''}`}
                onClick={() => onSelect(entry)}
                aria-label={`Abrir consulta: ${response.query}`}
              >
                <div className="history-card-meta">
                  <span className="history-status-label">
                    <span
                      className={`dot-indicator ${
                        isRefusal
                          ? 'dot-danger'
                          : level === 'alta'
                          ? 'dot-success'
                          : 'dot-warning'
                      }`}
                    />
                    {isRefusal ? 'Evidência insuficiente' : `Evidência: ${EVIDENCE_LEVEL_LABELS[level]}`}
                  </span>
                  <span>{formatTime(entry.createdAt)}</span>
                </div>
                <strong>{response.query}</strong>
              </button>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-brand">Nexo RJ · Contratações Públicas</span>
        <span
          className={`api-state api-${apiStatus}`}
          title={apiLabels[apiStatus]}
          role="status"
        >
          <i />
          <span>{apiLabels[apiStatus]}</span>
        </span>
      </div>
    </aside>
  );
}
