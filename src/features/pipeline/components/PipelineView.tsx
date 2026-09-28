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
        ? 'Processando simulação dry-run: 32 novos documentos identificados para extração...'
        : 'Executando atualização: fragmentação, vetorização e indexação de dados...'
    );

    setTimeout(() => {
      setExecuting(false);
      setStatusMessage(
        mode === 'preview'
          ? 'Simulação concluída com sucesso: 32 documentos / 710 novos fragmentos calculados. Nenhuma alteração aplicada.'
          : 'Atualização concluída: 710 novos fragmentos integrados às bases de vetores com o provider ' + provider
      );
    }, 2800);
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">ENGENHARIA DE DADOS E VETORIZAÇÃO</span>
        <h1>Pipeline de <em>Processamento RAG</em></h1>
        <p>Configuração, extração de texto, fragmentação e geração de embeddings para o acervo de contratações.</p>
      </header>

      {statusMessage ? (
        <div className="status-banner" role="status">
          <Icon name={executing ? 'refresh' : 'check'} size={16} className={executing ? 'spin' : ''} />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <div className="pipeline-grid">
        {/* Painel de Ações */}
        <section className="dashboard-card" aria-labelledby="atualizacao-heading">
          <h2 id="atualizacao-heading" className="card-title">
            <Icon name="refresh" size={17} />
            <span>Atualização do Acervo</span>
          </h2>
          <p className="card-text">
            Executa a sincronização com as fontes governamentais do Estado do Rio de Janeiro (PNCP, SIGA e DOERJ) para indexar novas publicações oficiais.
          </p>
          <div className="action-button-group">
            <button
              type="button"
              className="btn-secondary"
              disabled={executing}
              onClick={() => handleRun('preview')}
            >
              <Icon name="file-text" size={15} />
              <span>Simulação (Dry-run)</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={executing}
              onClick={() => handleRun('executar')}
            >
              <Icon name="check" size={15} />
              <span>Executar Ingestão</span>
            </button>
          </div>
        </section>

        {/* Configurações de Fragmentação */}
        <section className="dashboard-card" aria-labelledby="prep-heading">
          <h2 id="prep-heading" className="card-title">
            <Icon name="sliders" size={17} />
            <span>Parâmetros de Fragmentação</span>
          </h2>
          <form className="stacked-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="chunk-size">Tamanho do Fragmento (Tokens)</label>
              <input
                id="chunk-size"
                type="number"
                min="128"
                max="2048"
                step="64"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
              />
              <span className="field-hint">Padrão estabelecido para atos normativos e termos de referência: 512 tokens.</span>
            </div>

            <div className="form-group">
              <label htmlFor="overlap">Sobreposição / Overlap (Tokens)</label>
              <input
                id="overlap"
                type="number"
                min="0"
                max="256"
                step="16"
                value={overlap}
                onChange={(e) => setOverlap(Number(e.target.value))}
              />
              <span className="field-hint">Garante preservação de contexto jurídico e cláusulas contínuas.</span>
            </div>

            <div className="form-group">
              <label htmlFor="embedding-provider">Modelo de Incorporação (Embeddings)</label>
              <select
                id="embedding-provider"
                className="select-control"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536 dimensões)</option>
                <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072 dimensões)</option>
                <option value="bge-m3">BAAI / BGE-M3 Multilingual (1024 dimensões)</option>
              </select>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
