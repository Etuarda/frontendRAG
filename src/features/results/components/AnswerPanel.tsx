import { CONFIDENCE_LABELS, KNOWLEDGE_BASES, REFUSAL_LABELS } from '../../../domain/rag/catalog';
import type { RagResponse } from '../../../domain/rag/types';
import { Icon } from '../../../shared/components/Icon';

interface AnswerPanelProps {
  response: RagResponse;
  onReset: () => void;
}

function findBaseName(id: string) {
  return KNOWLEDGE_BASES.find((base) => base.id === id)?.name ?? id;
}

export function AnswerPanel({ response, onReset }: AnswerPanelProps) {
  return (
    <section className="result-stack">
      <div className="query-recap">
        <span className="recap-label">Pergunta:</span>
        <strong className="recap-query">“{response.query}”</strong>
        <button type="button" className="btn-secondary btn-sm" onClick={onReset}>
          <Icon name="refresh" size={14} />
          <span>Nova Consulta</span>
        </button>
      </div>

      {response.is_refusal ? (
        <article className="refusal-panel" role="alert">
          <div className="refusal-heading">
            <div className="refusal-icon">
              <Icon name="shield" size={20} />
            </div>
            <div>
              <h2>Resposta Recusada por Guardrail de Conformidade</h2>
              <p>O sistema interrompeu a resposta para proteger a integridade dos dados e respeitar os limites de evidência.</p>
            </div>
          </div>
          <div className="refusal-reason">
            <strong>Motivo do bloqueio:</strong>{' '}
            <span>
              {response.refusal_reason
                ? REFUSAL_LABELS[response.refusal_reason]
                : 'A consulta não pôde ser respondida com segurança.'}
            </span>
          </div>
          <div className="refusal-answer">{response.answer}</div>
        </article>
      ) : (
        <>
          <div className="result-metrics">
            <div className="metric-box">
              <span className="metric-box-label">Grau de Certeza</span>
              <strong className="metric-box-value">
                {CONFIDENCE_LABELS[response.confidence_level]}
              </strong>
            </div>
            <div className="metric-box">
              <span className="metric-box-label">Bases Consultadas</span>
              <strong className="metric-box-value">
                {response.bases_consultadas.length}{' '}
                {response.bases_consultadas.length === 1 ? 'Base' : 'Bases'}
              </strong>
            </div>
            <div className="metric-box">
              <span className="metric-box-label">Evidências Recuperadas</span>
              <strong className="metric-box-value">
                {response.sources_used.length}{' '}
                {response.sources_used.length === 1 ? 'Documento' : 'Documentos'}
              </strong>
            </div>
          </div>

          <article className="answer-card">
            <header className="answer-card-header">
              <div className="answer-status-tag">
                <span className="dot-indicator dot-success" />
                <strong>Síntese Fundamentada por Evidências</strong>
              </div>
              <span className="answer-meta-source">Pipeline Adaptive RAG · PNCP / SIGA / DOERJ</span>
            </header>

            <div className="answer-body">{response.answer}</div>

            {response.bases_consultadas.length > 0 ? (
              <section className="answer-section">
                <h3>Bases de Conhecimento Utilizadas</h3>
                <div className="used-bases-list">
                  {response.bases_consultadas.map((base) => (
                    <div className="used-base-item" key={base}>
                      <span className="dot-indicator" />
                      <strong>{findBaseName(base)}</strong>
                      <span className="used-base-tag">Roteador Adaptativo</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {response.sources_used.length > 0 ? (
              <section className="answer-section">
                <h3>Fontes e Trechos Utilizados</h3>
                <div className="sources-list">
                  {response.sources_used.map((source) => (
                    <div className="source-item" key={`${source.base_id}-${source.chunk_id}`}>
                      <Icon name="file-text" size={16} />
                      <div className="source-item-details">
                        <strong className="source-item-filename">{source.source_file}</strong>
                        <span className="source-item-meta">
                          Base: {source.base_id} | Chunk: {source.chunk_id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </>
      )}
    </section>
  );
}
