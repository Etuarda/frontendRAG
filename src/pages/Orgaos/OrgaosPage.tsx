import { useState } from 'react';
import { ORGAOS_MOCK } from '../../utils/catalog';
import { Icon } from '../../components/ui/Icon';
import type { OrgaoRecord } from '../../types';

interface OrgaosPageProps {
  onSearchQuery: (query: string) => void;
}

export function OrgaosPage({ onSearchQuery }: OrgaosPageProps) {
  const [search, setSearch] = useState('');

  const filtered = ORGAOS_MOCK.filter(
    (o) =>
      o.nome.toLowerCase().includes(search.toLowerCase()) ||
      o.sigla.toLowerCase().includes(search.toLowerCase()) ||
      o.principais_categorias.some((cat) => cat.toLowerCase().includes(search.toLowerCase()))
  );

  const handleConsultarOrgao = (orgao: OrgaoRecord) => {
    onSearchQuery(
      `Quais são as principais contratações, editais e compras vigentes da ${orgao.sigla} (${orgao.nome}) em 2025?`
    );
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">ADMINISTRAÇÃO PÚBLICA RJ</span>
        <h1 className="page-title">Órgãos e Entidades Contratantes</h1>
        <p className="page-description">
          Explore os órgãos estaduais do Rio de Janeiro, secretarias de governo, fundações e
          autarquias com histórico de licitações e contratações indexadas no sistema.
        </p>
      </header>

      {/* Busca rápida de órgãos */}
      <div className="catalog-filter-bar">
        <div className="catalog-search-field full-width">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Buscar por sigla, nome da secretaria ou área de atuação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar órgão contratante"
          />
        </div>
      </div>

      {/* Grid de Órgãos */}
      <div className="catalog-items-grid">
        {filtered.map((item) => (
          <article key={item.sigla} className="catalog-card">
            <div className="catalog-card-header">
              <span className="orgao-sigla-badge">{item.sigla}</span>
              <span className="orgao-esfera-tag">{item.esfera}</span>
            </div>

            <h2 className="catalog-card-title">{item.nome}</h2>

            <div className="orgao-metrics-grid">
              <div className="orgao-metric-box">
                <span className="metric-num">{item.total_contratacoes}</span>
                <span className="metric-lbl">Contratações no acervo</span>
              </div>
              <div className="orgao-metric-box">
                <span className="metric-num-highlight">{item.valor_total_estimado}</span>
                <span className="metric-lbl">Volume estimado</span>
              </div>
            </div>

            <div className="orgao-tags-section">
              <span className="detail-label">Principais compras e serviços:</span>
              <div className="orgao-tags-list">
                {item.principais_categorias.map((cat, i) => (
                  <span key={i} className="orgao-tag-item">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="catalog-card-actions">
              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleConsultarOrgao(item)}
              >
                <span>Consultar contratações deste órgão</span>
                <Icon name="arrow-up-right" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
