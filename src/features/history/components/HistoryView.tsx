import { useState } from 'react';
import type { SessionEntry } from '../../../domain/rag/types';
import { Icon } from '../../../shared/components/Icon';
import { formatTime } from '../../../shared/utils/formatters';

interface HistoryViewProps {
  entries: SessionEntry[];
  onSelectQuery: (entry: SessionEntry) => void;
  onClearHistory: () => void;
}

export function HistoryView({ entries, onSelectQuery, onClearHistory }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('todas');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.response.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConfidence =
      confidenceFilter === 'todas' || entry.response.confidence_level === confidenceFilter;
    return matchesSearch && matchesConfidence;
  });

  return (
    <div className="view-container">
      <header className="view-header">
        <div className="hero-kicker">
          <Icon name="clock" size={14} />
          <span>Sessão & Histórico</span>
        </div>
        <h1>Histórico de <em>Consultas</em></h1>
        <p>Consulte, reabra e analise as perguntas e respostas geradas nesta sessão.</p>
      </header>

      <section className="dashboard-card" aria-labelledby="history-list-heading">
        <div className="section-toolbar">
          <h2 id="history-list-heading" className="card-title">
            <Icon name="file-text" size={18} />
            <span>Consultas Registradas ({entries.length})</span>
          </h2>
          <div className="toolbar-controls">
            <div className="search-input-wrapper">
              <Icon name="search" size={15} />
              <input
                type="search"
                placeholder="Buscar no histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select-control"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
            >
              <option value="todas">Todas as confianças</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
              <option value="recusado">Recusado</option>
            </select>
            {entries.length > 0 ? (
              <button type="button" className="btn-secondary" onClick={onClearHistory}>
                <Icon name="trash" size={14} />
                <span>Limpar</span>
              </button>
            ) : null}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <Icon name="search" size={24} />
            </div>
            <h3>Nenhuma consulta encontrada</h3>
            <p>Faça uma pergunta na aba Consulta ou ajuste os filtros acima.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Pergunta</th>
                  <th>Confiança</th>
                  <th>Bases</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatTime(entry.createdAt)}</td>
                    <td>
                      <strong>{entry.response.query}</strong>
                    </td>
                    <td>
                      <span
                        className={`confidence-pill confidence-${entry.response.confidence_level}`}
                      >
                        {entry.response.confidence_level}
                      </span>
                    </td>
                    <td>
                      <div className="badge-row">
                        {entry.response.bases_consultadas.map((b) => (
                          <span key={b} className={`nature-badge nature-${b} badge-compact`}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-action-primary"
                        onClick={() => onSelectQuery(entry)}
                      >
                        <span>Reabrir</span>
                        <Icon name="arrow-up-right" size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

