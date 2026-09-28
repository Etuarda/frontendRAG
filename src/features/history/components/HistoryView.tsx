import { useState } from 'react';
import { EVIDENCE_LEVEL_LABELS } from '../../../domain/rag/catalog';
import type { SessionEntry } from '../../../domain/rag/types';
import { Icon } from '../../../shared/components/Icon';
import { formatTime } from '../../../shared/utils/formatters';

interface HistoryViewProps {
  entries: SessionEntry[];
  onSelectQuery: (entry: SessionEntry) => void;
  onRepeatQuery: (query: string) => void;
  onClearHistory: () => void;
}

export function HistoryView({
  entries,
  onSelectQuery,
  onRepeatQuery,
  onClearHistory,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) =>
    entry.response.query.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">REGISTRO DA SESSÃO</span>
        <h1>Histórico de <em>Consultas</em></h1>
        <p>
          Consulte, abra ou repita pesquisas realizadas nesta sessão de trabalho.
        </p>
      </header>

      {/* Aviso de Privacidade de Sessão */}
      <div className="session-notice-box" role="status">
        <Icon name="info" size={16} />
        <span>
          O histórico é armazenado apenas nesta sessão de navegação e não fica salvo em servidores
          externos.
        </span>
      </div>

      <section className="dashboard-card" aria-labelledby="history-list-heading">
        <div className="section-toolbar">
          <h2 id="history-list-heading" className="card-title">
            <Icon name="clock" size={17} />
            <span>Consultas da Sessão ({entries.length})</span>
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
            {entries.length > 0 ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={onClearHistory}
                aria-label="Limpar todo o histórico da sessão"
              >
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
            <p>
              {entries.length === 0
                ? 'As perguntas que você pesquisar nesta sessão aparecerão listadas aqui.'
                : 'Nenhuma pergunta corresponde ao filtro pesquisado.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" aria-label="Tabela de histórico de consultas">
              <thead>
                <tr>
                  <th scope="col">Horário</th>
                  <th scope="col">Pergunta</th>
                  <th scope="col">Estado da Resposta</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const isRefusal = entry.response.is_refusal;
                  const level = entry.response.confidence_level;
                  return (
                    <tr key={entry.id}>
                      <td className="history-time-col">{formatTime(entry.createdAt)}</td>
                      <td className="history-query-col">
                        <strong>{entry.response.query}</strong>
                      </td>
                      <td>
                        <span className="table-confidence-label">
                          <span
                            className={`dot-indicator ${
                              isRefusal
                                ? 'dot-danger'
                                : level === 'alta'
                                ? 'dot-success'
                                : 'dot-warning'
                            }`}
                          />
                          {isRefusal ? (
                            <span>Evidência insuficiente</span>
                          ) : (
                            <span>Evidência: {EVIDENCE_LEVEL_LABELS[level]}</span>
                          )}
                        </span>
                      </td>
                      <td className="history-actions-col">
                        <div className="history-actions-group">
                          <button
                            type="button"
                            className="btn-action-primary"
                            onClick={() => onSelectQuery(entry)}
                            aria-label={`Abrir resposta da pergunta: ${entry.response.query}`}
                          >
                            <span>Abrir</span>
                            <Icon name="arrow-up-right" size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => onRepeatQuery(entry.response.query)}
                            aria-label={`Repetir consulta: ${entry.response.query}`}
                          >
                            <Icon name="refresh" size={12} />
                            <span>Repetir</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
