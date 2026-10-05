import { useState } from 'react';
import type { HistoryItem, RagResponse } from '../../types';
import { useHistory } from '../../hooks/useHistory';
import { Icon } from '../../components/ui/Icon';
import { EVIDENCE_LEVEL_LABELS } from '../../utils/catalog';

interface HistoricoPageProps {
  onSelectHistoryItem: (response: RagResponse) => void;
  onNewQuery: () => void;
}

export function HistoricoPage({ onSelectHistoryItem, onNewQuery }: HistoricoPageProps) {
  const { items, loading, error, clearHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter((item) =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenItem = (item: HistoryItem) => {
    if (item.full_response) {
      onSelectHistoryItem(item.full_response);
    } else {
      // Reconstitui o objeto de resposta a partir do item do histórico
      const reconstructed: RagResponse = {
        query: item.query,
        answer: item.answer_summary,
        bases_consultadas: ['estruturada'],
        sources_used: item.sources_used || [],
        confidence_level: item.confidence_level || 'alta',
        is_refusal: false,
        refusal_reason: null,
      };
      onSelectHistoryItem(reconstructed);
    }
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">REGISTRO DE CONSULTAS</span>
        <h1 className="page-title">Histórico de Pesquisas</h1>
        <p className="page-description">
          Consultas realizadas e persistidas no sistema. Você pode reabrir qualquer pesquisa anterior
          com suas respectivas fontes e respostas.
        </p>
      </header>

      {/* Barra de Filtro e Ações */}
      <div className="history-toolbar">
        <div className="history-search-input">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Filtrar histórico por palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filtrar histórico por palavra-chave"
          />
        </div>

        {items.length > 0 ? (
          <button
            type="button"
            className="btn-clear-history"
            onClick={clearHistory}
            aria-label="Limpar histórico"
          >
            <Icon name="trash" size={14} />
            <span>Limpar histórico</span>
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="history-loading-state">
          <Icon name="refresh-cw" size={18} className="spin-animation" />
          <span>Carregando histórico...</span>
        </div>
      ) : null}

      {error && !loading ? (
        <div className="history-error-state">
          <Icon name="info" size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Lista ou Estado Vazio */}
      {!loading && filteredItems.length === 0 ? (
        <div className="empty-history-box">
          <div className="empty-history-icon">
            <Icon name="clock" size={28} />
          </div>
          <h2 className="empty-history-title">Nenhuma consulta realizada ainda.</h2>
          <p className="empty-history-desc">Suas consultas aparecerão aqui.</p>
          <button type="button" className="btn-empty-start" onClick={onNewQuery}>
            <Icon name="plus" size={15} />
            <span>Fazer primeira consulta</span>
          </button>
        </div>
      ) : null}

      {!loading && filteredItems.length > 0 ? (
        <div className="history-items-feed" role="feed" aria-label="Histórico de consultas">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="history-feed-card"
              onClick={() => handleOpenItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenItem(item)}
              aria-label={`Abrir consulta: ${item.query}`}
            >
              <div className="feed-card-header">
                <span className="feed-card-timestamp">
                  <Icon name="clock" size={13} />
                  <time dateTime={item.created_at}>
                    {new Date(item.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </span>

                <span className="feed-card-badge">
                  {EVIDENCE_LEVEL_LABELS[item.confidence_level] || 'Evidência'}
                </span>
              </div>

              <h2 className="feed-card-query">{item.query}</h2>

              <p className="feed-card-summary">{item.answer_summary}</p>

              <div className="feed-card-footer">
                <span className="feed-card-sources">
                  <Icon name="file-text" size={13} />
                  <span>
                    {item.sources_count || item.sources_used?.length || 0}{' '}
                    {item.sources_count === 1 ? 'fonte utilizada' : 'fontes utilizadas'}
                  </span>
                </span>

                <span className="feed-card-action">
                  <span>Abrir consulta</span>
                  <Icon name="arrow-up-right" size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
