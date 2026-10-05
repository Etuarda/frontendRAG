import { useState } from 'react';
import { DOCUMENTOS_MOCK } from '../../utils/catalog';
import { Icon } from '../../components/ui/Icon';
import type { DocumentoRecord } from '../../types';

interface DocumentosPageProps {
  onSearchQuery: (query: string) => void;
}

export function DocumentosPage({ onSearchQuery }: DocumentosPageProps) {
  const [search, setSearch] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');

  const filtered = DOCUMENTOS_MOCK.filter((doc) => {
    const matchText =
      doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
      doc.descricao.toLowerCase().includes(search.toLowerCase()) ||
      doc.orgao.toLowerCase().includes(search.toLowerCase());

    const matchTipo = selectedTipo === 'todos' || doc.tipo === selectedTipo;

    return matchText && matchTipo;
  });

  const handleConsultarDocumento = (doc: DocumentoRecord) => {
    onSearchQuery(
      `Quais são as cláusulas, regras e especificações do documento "${doc.titulo}" do ${doc.orgao}?`
    );
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">DOCUMENTOS OFICIAIS</span>
        <h1 className="page-title">Acervo de Documentos</h1>
        <p className="page-description">
          Localize editais, minutas, termos de referência, contratos bilaterais, atas de registro de
          preços e planos anuais de contratações (PCA) indexados para busca inteligente.
        </p>
      </header>

      <div className="catalog-filter-bar">
        <div className="catalog-search-field">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Buscar por termo, número do edital ou palavra-chave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar documentos"
          />
        </div>

        <div className="catalog-select-field">
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            aria-label="Filtrar por tipo de documento"
          >
            <option value="todos">Todos os tipos</option>
            <option value="Edital">Editais</option>
            <option value="Contrato">Contratos</option>
            <option value="Ata de Registro">Atas de Registro de Preços</option>
            <option value="PCA">Planos de Contratação (PCA)</option>
            <option value="Normativo">Normativos e Decretos</option>
          </select>
          <Icon name="chevron-down" size={13} className="select-icon" />
        </div>
      </div>

      <div className="catalog-items-grid">
        {filtered.map((item) => (
          <article key={item.id} className="catalog-card">
            <div className="catalog-card-header">
              <span className="catalog-card-tag">{item.tipo}</span>
              <span className="catalog-year-pill">Ano {item.ano}</span>
            </div>

            <h2 className="catalog-card-title">{item.titulo}</h2>
            <p className="catalog-card-orgao">Órgão emissor: {item.orgao}</p>

            <p className="catalog-card-objeto">{item.descricao}</p>

            <div className="catalog-card-details">
              <div className="detail-row">
                <span className="detail-label">Repositório:</span>
                <span className="detail-value">{item.fonte}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Disponibilidade:</span>
                <span className="detail-value">Indexado e verificável</span>
              </div>
            </div>

            <div className="catalog-card-actions">
              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleConsultarDocumento(item)}
              >
                <span>Consultar documento no NEXO</span>
                <Icon name="arrow-up-right" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
