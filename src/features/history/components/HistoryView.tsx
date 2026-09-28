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
        <span className="section-eyebrow">REGISTRO DE ATIVIDADE</span>
        <h1>Histórico de <em>Consultas</em></h1>
        <p>Acompanhe, filtre e reabra perguntas e respostas geradas nesta sessão de trabalho.</p>
      </header>

      <section className="dashboard-card" aria-labelledby="history-list-heading">
        <div className="section-toolbar">
          <h2 id="history-list-heading" className="card-title">
            <Icon name="clock" size={17} />
            <span>Consultas Registradas ({entries.length})</span>
          </h2>
          <div className="toolbar-controls">
            <div className="search-input-wrapper">
              <Icon name="search" size={15} />
              <input
                type="search"
                placeholder="Filtrar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar no histórico"
              />
            </div>
            <select
              className="select-control"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              aria-label="Filtrar por grau de confiança"
            >
              <option value="todas">Todos os níveis de certeza</option>
              <option value="alta">Alta certeza</option>
              <option value="media">Média certeza</option>
              <option value="baixa">Baixa certeza</option>
              <option value="recusado">Recusado</option>
            </select>
            {entries.length > 0 ? (
              <button type="button" className="btn-secondary" onClick={onClearHistory}>
                <Icon name="trash" size={14} />
                <span>Limpar Histórico</span>
              </button>
            ) : null}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <Icon name="search" size={20} />
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
                  <th>Certeza</th>
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
                      <span className="table-confidence-label">
                        <span
                          className={`dot-indicator ${
                            entry.response.confidence_level === 'alta'
                              ? 'dot-success'
                              : entry.response.confidence_level === 'recusado'
                              ? 'dot-danger'
                              : 'dot-warning'
                          }`}
                        />
                        {entry.response.confidence_level}
                      </span>
                    </td>
                    <td>
                      <div className="badge-row">
                        {entry.response.bases_consultadas.map((b) => (
                          <span key={b} className="table-nature-tag">
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
                        <Icon name="arrow-up-right" size={12} />
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
