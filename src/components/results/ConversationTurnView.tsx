import { useState } from 'react';
import type { ConversationTurn, SourceRef } from '../../types';
import { Icon } from '../ui/Icon';
import { AnswerFeedback } from '../feedback/AnswerFeedback';
import { EVIDENCE_LEVEL_LABELS, REFUSAL_LABELS } from '../../utils/catalog';

interface ConversationTurnViewProps {
  turn: ConversationTurn;
  onRate: (turnId: string, useful: boolean) => void;
}

/** Uma pergunta da conversa com sua resposta, fontes e avaliação. */
export function ConversationTurnView({ turn, onRate }: ConversationTurnViewProps) {
  const { response } = turn;
  const [detailsOpen, setDetailsOpen] = useState(false);

  // A API separa parágrafos por linha em branco; um <p> por bloco facilita a leitura.
  const paragraphs = response.answer
    ? response.answer.split('\n\n').filter((p) => p.trim().length > 0)
    : [];

  return (
    <article className="conversation-turn" aria-label={`Pergunta: ${turn.query}`}>
      <div className="turn-question">
        <p>{turn.query}</p>
      </div>

      {/* Sem evidência suficiente, explicamos a recusa em vez de arriscar uma resposta. */}
      {response.is_refusal ? (
        <div className="refusal-box">
          <div className="refusal-icon-title">
            <Icon name="info" size={18} />
            <h2>Não foi possível responder com as fontes disponíveis</h2>
          </div>
          <p className="refusal-explanation">
            As fontes oficiais não apresentam dados ou evidências suficientes para emitir uma
            resposta com segurança jurídica e factual.
          </p>
          {response.refusal_reason ? (
            <div className="refusal-tag-row">
              <span className="refusal-tag-label">Contexto:</span>
              <span>{REFUSAL_LABELS[response.refusal_reason]}</span>
            </div>
          ) : null}
          {paragraphs.length > 0 ? (
            <div className="refusal-paragraphs">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <section className="result-answer-section" aria-labelledby={`answer-${turn.id}`}>
            <h2 id={`answer-${turn.id}`} className="visually-hidden">
              Resposta fundamentada
            </h2>
            <div className="result-answer-prose">
              {paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </section>

          {response.sources_used.length > 0 ? (
            <section className="result-sources-section" aria-labelledby={`sources-${turn.id}`}>
              <h2 id={`sources-${turn.id}`} className="sources-section-title">
                Fontes utilizadas ({response.sources_used.length})
              </h2>

              <div className="result-sources-list">
                {response.sources_used.map((source: SourceRef, idx: number) => (
                  <article key={`${source.source_file}-${idx}`} className="source-item-card">
                    <div className="source-card-top">
                      <Icon name="file-text" size={15} />
                      <h3 className="source-card-title">{source.source_file}</h3>
                    </div>
                    {source.trecho ? (
                      <p className="source-card-trecho">“{source.trecho}”</p>
                    ) : null}
                    <div className="source-card-meta">
                      <span className="source-meta-tag">Base: {source.base_id}</span>
                      {source.score ? (
                        <span className="source-meta-tag">
                          Relevância: {(source.score * 100).toFixed(0)}%
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <AnswerFeedback
            queryId={response.pipeline_metadata?.query_id}
            query={turn.query}
            value={turn.feedback}
            onRated={(useful) => onRate(turn.id, useful)}
          />

          {/* Detalhes técnicos ficam recolhidos para não poluir a leitura principal. */}
          <section className="recovery-details-section">
            <button
              type="button"
              className="btn-toggle-recovery"
              onClick={() => setDetailsOpen((curr) => !curr)}
              aria-expanded={detailsOpen}
            >
              <span>Ver detalhes da recuperação</span>
              <Icon
                name={detailsOpen ? 'chevron-down' : 'chevron-right'}
                size={16}
              />
            </button>

            {detailsOpen ? (
              <div className="recovery-details-panel">
                <div className="recovery-details-grid">
                  <div className="recovery-field">
                    <span className="recovery-label">Nível de evidência</span>
                    <span className="recovery-value">
                      {EVIDENCE_LEVEL_LABELS[response.confidence_level]}
                    </span>
                  </div>

                  <div className="recovery-field">
                    <span className="recovery-label">Estratégia utilizada</span>
                    <span className="recovery-value">
                      {response.pipeline_metadata?.strategy || 'RAG Híbrido (Vetorial + BM25 + RRF)'}
                    </span>
                  </div>

                  <div className="recovery-field">
                    <span className="recovery-label">Documentos / Chunks recuperados</span>
                    <span className="recovery-value">
                      {response.pipeline_metadata?.total_chunks_retrieved || response.sources_used.length} chunks analisados
                    </span>
                  </div>

                  <div className="recovery-field">
                    <span className="recovery-label">Reranking</span>
                    <span className="recovery-value">
                      {response.pipeline_metadata?.reranker || 'BGE Reranker Large (Reordenação por relevância)'}
                    </span>
                  </div>

                  {response.pipeline_metadata?.latency_ms ? (
                    <div className="recovery-field">
                      <span className="recovery-label">Tempo de resposta</span>
                      <span className="recovery-value">
                        {response.pipeline_metadata.latency_ms} ms
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="recovery-chunks-box">
                  <h4 className="recovery-subheading">Chunks e evidências recuperadas</h4>
                  <div className="recovery-chunks-list">
                    {response.sources_used.map((source, i) => (
                      <div key={i} className="recovery-chunk-entry">
                        <code>ID: {source.chunk_id}</code>
                        <span className="recovery-chunk-file">{source.source_file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </>
      )}
    </article>
  );
}
