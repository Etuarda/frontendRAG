import { useState } from 'react';
import { MOCK_CORPUS_BASES, MOCK_CORPUS_DOCS } from '../../../domain/rag/catalog';
import type { EvidenceNature } from '../../../domain/rag/types';
import { Icon } from '../../../shared/components/Icon';

export function CorpusView() {
  const [filterBase, setFilterBase] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = MOCK_CORPUS_DOCS.filter((doc) => {
    const matchesBase = filterBase === 'todas' || doc.base === filterBase;
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBase && matchesSearch;
  });

  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">INVENTÁRIO E ACERVO DE DADOS</span>
        <h1>Corpus de <em>Contratações Públicas</em></h1>
        <p>Inventário, versionamento e catálogo de documentos processados pelo pipeline do Adaptive RAG.</p>
      </header>

      {/* Resumo do Corpus */}
      <section className="dashboard-card" aria-labelledby="resumo-corpus-heading">
        <h2 id="resumo-corpus-heading" className="card-title">
          <Icon name="layers" size={17} />
          <span>Resumo do Acervo Indexado</span>
        </h2>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Versão Atual</span>
            <strong className="stat-value">v1.4.2</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total de Documentos</span>
            <strong className="stat-value">328</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total de Chunks</span>
            <strong className="stat-value">7.260</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Status da Sincronização</span>
            <strong className="stat-value text-accent">100% Atualizado</strong>
          </div>
        </div>
      </section>

      {/* Bases de Conhecimento */}
      <section className="dashboard-card" aria-labelledby="bases-corpus-heading">
        <h2 id="bases-corpus-heading" className="card-title">
          <Icon name="database" size={17} />
          <span>Bases de Conhecimento por Natureza de Evidência</span>
        </h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Base</th>
                <th>Natureza</th>
                <th>Arquivos</th>
                <th>Chunks</th>
                <th>Última Coleta</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CORPUS_BASES.map((b) => (
                <tr key={b.id}>
                  <td><code className="code-text">{b.id}</code></td>
                  <td>
                    <span className="table-nature-tag">
                      <span className="dot-indicator" />
                      {b.natureza}
                    </span>
                  </td>
                  <td>{b.totalArquivos}</td>
                  <td>{b.totalChunks.toLocaleString()}</td>
                  <td>{b.ultimaColeta}</td>
                  <td>
                    <span className="table-status-tag">
                      <span className="dot-indicator dot-success" />
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lista de Documentos & Filtros */}
      <section className="dashboard-card" aria-labelledby="docs-corpus-heading">
        <div className="section-toolbar">
          <h2 id="docs-corpus-heading" className="card-title">
            <Icon name="file-text" size={17} />
            <span>Documentos Indexados</span>
          </h2>
          <div className="toolbar-controls">
            <div className="search-input-wrapper">
              <Icon name="search" size={15} />
              <input
                type="search"
                placeholder="Filtrar por nome de arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="select-control"
              value={filterBase}
              onChange={(e) => setFilterBase(e.target.value as EvidenceNature | 'todas')}
              aria-label="Filtrar por base"
            >
              <option value="todas">Todas as bases</option>
              <option value="normativa">Normativa</option>
              <option value="estruturada">Estruturada</option>
              <option value="conversacional">Conversacional</option>
              <option value="agregada">Agregada</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Arquivo</th>
                <th>Base</th>
                <th>Formato</th>
                <th>Tamanho</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td><code className="code-text">{doc.id}</code></td>
                  <td><strong>{doc.nome}</strong></td>
                  <td>
                    <span className="table-nature-tag">
                      <span className="dot-indicator" />
                      {doc.base}
                    </span>
                  </td>
                  <td>{doc.formato}</td>
                  <td>{doc.tamanhoKb} KB</td>
                  <td>{doc.dataIndexacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
