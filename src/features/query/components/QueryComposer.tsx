import { useState } from 'react';
import { Icon } from '../../../shared/components/Icon';

interface QueryComposerProps {
  loading: boolean;
  onSubmit: (query: string) => void;
}

export function QueryComposer({ loading, onSubmit }: QueryComposerProps) {
  const [query, setQuery] = useState('');

  function submit() {
    const normalized = query.trim();
    if (!normalized || loading) return;
    onSubmit(normalized);
    setQuery('');
  }

  return (
    <div className="query-shell">
      <div className="query-glow" />
      <div className="query-card">
        <div className="query-row">
          <Icon name="search" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
            placeholder="Ex: Quais órgãos contrataram serviços de manutenção de computadores em 2025?"
            aria-label="Pergunta para o sistema RAG"
          />
          <button type="button" className="primary-action" disabled={loading || !query.trim()} onClick={submit}>
            <span>{loading ? 'Consultando...' : 'Pesquisar'}</span>
            <Icon name="send" size={16} />
          </button>
        </div>
        <div className="query-meta">
          <span>O roteador escolhe automaticamente as bases adequadas para cada pergunta.</span>
          <span>Dense + BM25 + RRF</span>
        </div>
      </div>
    </div>
  );
}
