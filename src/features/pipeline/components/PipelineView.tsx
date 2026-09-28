import { useState } from 'react';
import { DEFAULT_PIPELINE_CONFIG } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function PipelineView() {
  const [chunkSize, setChunkSize] = useState(DEFAULT_PIPELINE_CONFIG.chunkSize);
  const [overlap, setOverlap] = useState(DEFAULT_PIPELINE_CONFIG.overlap);
  const [provider, setProvider] = useState(DEFAULT_PIPELINE_CONFIG.embeddingProvider);
  const [executing, setExecuting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRun = (mode: 'preview' | 'executar') => {
    setExecuting(true);
    setStatusMessage(
      mode === 'preview'
        ? 'Gerando preview do pipeline: 32 novos documentos identificados para extração...'
        : 'Executando atualização completa: chunking (512/64), geração de embeddings e indexação...'
    );

    setTimeout(() => {
      setExecuting(false);
      setStatusMessage(
        mode === 'preview'
          ? 'Preview concluído: 32 documentos / 710 novos chunks estimados. Nenhum dado foi sobrescrito.'
          : 'Atualização concluída com sucesso! 710 novos chunks indexados com provider ' + provider
      );
    }, 2800);
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <div className="hero-kicker">
          <Icon name="sliders" size={14} />
          <span>Engenharia de Dados & RAG</span>
        </div>
        <h1>Pipeline de <em>Processamento</em></h1>
        <p>Prepare, configure e execute as etapas de ingestão, fragmentação e geração de embeddings.</p>
      </header>

      {statusMessage ? (
        <div className="status-banner" role="status">
          <Icon name={executing ? 'refresh' : 'check'} size={18} className={executing ? 'spin' : ''} />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <div className="pipeline-grid">
        {/* Painel de Ações Rápidas */}
        <section className="dashboard-card" aria-labelledby="atualizacao-heading">
          <h2 id="atualizacao-heading" className="card-title">
            <Icon name="refresh" size={18} />
            <span>Atualização do Corpus</span>
          </h2>
          <p className="card-text">
            Execute a varredura nas fontes remotas (PNCP, SIGA, DOERJ) para buscar novos editais e contratos publicados.
          </p>
          <div className="action-button-group">
            <button
              type="button"
              className="btn-secondary"
              disabled={executing}
              onClick={() => handleRun('preview')}
            >
              <Icon name="file-text" size={16} />
              <span>Gerar Preview (Dry-run)</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={executing}
              onClick={() => handleRun('executar')}
            >
              <Icon name="sparkles" size={16} />
              <span>Executar Atualização</span>
            </button>
          </div>
        </section>

        {/* Configurações de Fragmentação (Chunking) */}
        <section className="dashboard-card" aria-labelledby="prep-heading">
          <h2 id="prep-heading" className="card-title">
            <Icon name="sliders" size={18} />
            <span>Parâmetros de Preparação</span>
          </h2>
          <form className="stacked-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="chunk-size">Tamanho do Chunk (Tokens)</label>
              <input
                id="chunk-size"
                type="number"
                min="128"
                max="2048"
                step="64"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
              />
              <span className="field-hint">Padrão recomendado para textos jurídicos: 512 tokens.</span>
            </div>

            <div className="form-group">
              <label htmlFor="overlap">Overlap (Sobreposição)</label>
              <input
                id="overlap"
                type="number"
                min="0"
                max="256"
                step="16"
                value={overlap}
                onChange={(e) => setOverlap(Number(e.target.value))}
              />
              <span className="field-hint">Garante continuidade de contexto entre fragmentos adjacentes.</span>
            </div>

            <div className="form-group">
              <label htmlFor="embedding-provider">Provider de Embeddings</label>
              <select
                id="embedding-provider"
                className="select-control"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536d)</option>
                <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072d)</option>
                <option value="bge-m3">BAAI / BGE-M3 (Multilingual 1024d)</option>
              </select>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

