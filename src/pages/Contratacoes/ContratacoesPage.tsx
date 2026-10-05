import { useState } from 'react';
import { CONTRATACOES_MOCK } from '../../utils/catalog';
import { Icon } from '../../components/ui/Icon';
import type { ContratacaoRecord } from '../../types';

interface ContratacoesPageProps {
  onSearchQuery: (query: string) => void;
}

export function ContratacoesPage({ onSearchQuery }: ContratacoesPageProps) {
  const [search, setSearch] = useState('');
  const [selectedOrgao, setSelectedOrgao] = useState('todos');

  const filtered = CONTRATACOES_MOCK.filter((c) => {
    const matchText =
      c.objeto.toLowerCase().includes(search.toLowerCase()) ||
      c.fornecedor.toLowerCase().includes(search.toLowerCase()) ||
      c.numero_contrato.toLowerCase().includes(search.toLowerCase()) ||
      c.orgao.toLowerCase().includes(search.toLowerCase());

    const matchOrgao =
      selectedOrgao === 'todos' || c.orgao.toLowerCase().includes(selectedOrgao.toLowerCase());

    return matchText && matchOrgao;
  });

  const handleConsultarContrato = (contrato: ContratacaoRecord) => {
    onSearchQuery(
      `Quais são os detalhes, valores e termos do ${contrato.numero_contrato} celebrado pelo ${contrato.orgao}?`
    );
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">EXPLORAR ACERVO</span>
        <h1 className="page-title">Contratações Públicas</h1>
        <p className="page-description">
          Registros oficiais de instrumentos contratuais vigentes, atas de registro de preços e
          homologações do Estado do Rio de Janeiro indexados no PNCP e SIGA-RJ.
        </p>
      </header>

      {/* Barra de Filtros */}
      <div className="catalog-filter-bar">
        <div className="catalog-search-field">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Buscar por objeto, fornecedor ou contrato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar contratações"
          />
        </div>

        <div className="catalog-select-field">
          <select
            value={selectedOrgao}
            onChange={(e) => setSelectedOrgao(e.target.value)}
            aria-label="Filtrar por órgão contratante"
          >
            <option value="todos">Todos os órgãos</option>
            <option value="Saúde">Saúde (SES-RJ / Fundação Saúde)</option>
            <option value="Transporte">Transporte (SECTRAN)</option>
            <option value="Educação">Educação (SEEDUC)</option>
            <option value="Fazenda">Fazenda (SEFAZ-RJ)</option>
            <option value="UERJ">UERJ</option>
          </select>
          <Icon name="chevron-down" size={13} className="select-icon" />
        </div>
      </div>

      {/* Grid de Contratos */}
      <div className="catalog-items-grid">
        {filtered.map((item) => (
          <article key={item.id} className="catalog-card">
            <div className="catalog-card-header">
              <span className="catalog-card-tag">{item.modalidade}</span>
              <span className="catalog-status-pill">{item.status}</span>
            </div>

            <h2 className="catalog-card-title">{item.numero_contrato}</h2>
            <p className="catalog-card-orgao">{item.orgao}</p>

            <p className="catalog-card-objeto">{item.objeto}</p>

            <div className="catalog-card-details">
              <div className="detail-row">
                <span className="detail-label">Fornecedor:</span>
                <span className="detail-value">{item.fornecedor}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Valor Homologado:</span>
                <span className="detail-value-price">
                  {item.valor_global.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Homologação:</span>
                <span className="detail-value">{item.data_homologacao}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fonte Oficial:</span>
                <span className="detail-value">{item.fonte_oficial}</span>
              </div>
            </div>

            <div className="catalog-card-actions">
              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleConsultarContrato(item)}
              >
                <span>Consultar no NEXO</span>
                <Icon name="arrow-up-right" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
