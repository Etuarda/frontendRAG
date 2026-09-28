import { SUGGESTED_QUERIES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

interface SuggestedQueriesProps {
  disabled: boolean;
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ disabled, onSelect }: SuggestedQueriesProps) {
  return (
    <section className="suggestions-section">
      <div className="section-kicker"><Icon name="sparkles" size={14} /><span>Perguntas de referência das personas</span></div>
      <div className="suggestion-grid">
        {SUGGESTED_QUERIES.map((query) => (
          <button key={query} type="button" disabled={disabled} onClick={() => onSelect(query)}>
            <span>{query}</span>
            <Icon name="arrow-up-right" size={16} />
          </button>
        ))}
      </div>
    </section>
  );
}
