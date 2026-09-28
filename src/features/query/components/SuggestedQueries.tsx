import { SUGGESTED_QUERIES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

interface SuggestedQueriesProps {
  disabled: boolean;
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ disabled, onSelect }: SuggestedQueriesProps) {
  return (
    <section className="suggestions-section" aria-labelledby="suggested-queries-title">
      <h2 id="suggested-queries-title" className="section-title-sm">
        <Icon name="file-text" size={16} />
        <span>Consultas de Referência por Persona</span>
      </h2>
      <p className="section-subtitle">
        Perguntas validadas para auditoria de editais, termos de referência e atas de pregão:
      </p>
      <div className="suggestion-grid">
        {SUGGESTED_QUERIES.map((query) => (
          <button
            key={query}
            type="button"
            className="suggestion-item"
            disabled={disabled}
            onClick={() => onSelect(query)}
          >
            <span>{query}</span>
            <Icon name="arrow-up-right" size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}
