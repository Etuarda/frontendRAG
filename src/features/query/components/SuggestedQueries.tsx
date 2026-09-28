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
        <Icon name="compass" size={16} />
        <span>Sugestões de Consulta</span>
      </h2>
      <p className="section-subtitle">
        Atalhos frequentes para pesquisas sobre contratações públicas, regras e fornecedores:
      </p>
      <div className="suggestion-grid">
        {SUGGESTED_QUERIES.map((item) => (
          <button
            key={item.query}
            type="button"
            className="suggestion-item"
            disabled={disabled}
            onClick={() => onSelect(item.query)}
            aria-label={`Pesquisar: ${item.query}`}
          >
            <div className="suggestion-item-content">
              <span className="suggestion-category">
                <span className="dot-indicator" />
                {item.category}
              </span>
              <span className="suggestion-text">{item.query}</span>
            </div>
            <Icon name="arrow-up-right" size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}
