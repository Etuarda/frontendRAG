import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Icon } from '../ui/Icon';
import { ATALHOS_INICIAIS, type ShortcutItem } from '../../utils/catalog';
import type { AppView } from '../../types';

interface SearchComposerProps {
  loading: boolean;
  onSubmit: (query: string) => void;
  onNavigate: (view: AppView) => void;
  fonteFilter: string;
  onFonteChange: (fonte: string) => void;
  searchStrategy: 'automatica' | 'hibrida' | 'normativa';
  onStrategyChange: (strategy: 'automatica' | 'hibrida' | 'normativa') => void;
}

export function SearchComposer({
  loading,
  onSubmit,
  onNavigate,
  fonteFilter,
  onFonteChange,
  searchStrategy,
  onStrategyChange,
}: SearchComposerProps) {
  const [query, setQuery] = useState('');
  const [filterAno, setFilterAno] = useState('2025');

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean || loading) return;
    onSubmit(clean);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleShortcutClick = (item: ShortcutItem) => {
    if (item.actionView) {
      onNavigate(item.actionView);
    } else {
      setQuery(item.query);
      onSubmit(item.query);
    }
  };

  return (
    <div className="search-composer-wrapper">
      <div className="composer-header">
        <span className="composer-eyebrow">Consulta inteligente</span>
        <h1 className="composer-title">O que você quer consultar?</h1>
      </div>

      <form className="ai-composer-box" onSubmit={handleSubmit}>
        <div className="composer-input-area">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre contratos, editais, órgãos ou atas..."
            aria-label="Pergunta sobre contratações públicas"
            rows={2}
            disabled={loading}
          />
        </div>

        <div className="composer-controls-bar">
          <div className="composer-controls-left">
            <div className="control-pill-select" title="Filtrar por fonte de dados">
              <Icon name="compass" size={14} />
              <select
                value={fonteFilter}
                onChange={(e) => onFonteChange(e.target.value)}
                disabled={loading}
                aria-label="Selecionar fonte de dados"
              >
                <option value="todas">Todas as fontes</option>
                <option value="pncp">PNCP (Nacional)</option>
                <option value="siga-rj">SIGA-RJ (Estadual)</option>
                <option value="doerj">DOERJ (Diário Oficial)</option>
              </select>
              <Icon name="chevron-down" size={12} className="select-arrow" />
            </div>

            <div className="control-pill-select" title="Filtrar por ano">
              <Icon name="sliders" size={14} />
              <select
                value={filterAno}
                onChange={(e) => setFilterAno(e.target.value)}
                disabled={loading}
                aria-label="Filtrar por ano de contratação"
              >
                <option value="2025">Exercício 2025</option>
                <option value="2024">Exercício 2024</option>
                <option value="todos">Todos os anos</option>
              </select>
              <Icon name="chevron-down" size={12} className="select-arrow" />
            </div>

            <div className="control-pill-select" title="Estratégia de busca">
              <Icon name="sparkles" size={14} />
              <select
                value={searchStrategy}
                onChange={(e) =>
                  onStrategyChange(e.target.value as 'automatica' | 'hibrida' | 'normativa')
                }
                disabled={loading}
                aria-label="Selecionar estratégia de busca"
              >
                <option value="automatica">Busca Inteligente</option>
                <option value="hibrida">Acervo Completo</option>
                <option value="normativa">Foco em Legislação</option>
              </select>
              <Icon name="chevron-down" size={12} className="select-arrow" />
            </div>
          </div>

          <div className="composer-controls-right">
            <button
              type="submit"
              className="btn-composer-send"
              disabled={loading || !query.trim()}
              aria-label={loading ? 'Pesquisando...' : 'Enviar consulta'}
              title="Pressione Enter para enviar"
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      </form>

      <div className="composer-shortcuts-section">
        <span className="shortcuts-label">Atalhos sugeridos</span>
        <div className="composer-shortcuts-grid">
          {ATALHOS_INICIAIS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="shortcut-card"
              onClick={() => handleShortcutClick(item)}
              aria-label={`Atalho: ${item.title}`}
            >
              <div className="shortcut-icon-row">
                <span className="shortcut-category">{item.category}</span>
                <Icon name="arrow-up-right" size={14} className="shortcut-arrow" />
              </div>
              <h2 className="shortcut-title">{item.title}</h2>
              <p className="shortcut-desc">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
