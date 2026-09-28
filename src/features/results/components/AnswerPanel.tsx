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
        <span>Consulta</span>
        <strong>“{response.query}”</strong>
      </div>

      {response.is_refusal ? (
        <article className="refusal-panel">
          <div className="refusal-heading">
            <div className="refusal-icon"><Icon name="shield" size={22} /></div>
            <div><h2>Consulta limitada por guardrail</h2><p>O sistema interrompe respostas que extrapolam o escopo ou exigem conclusões não sustentadas.</p></div>
          </div>
          <div className="refusal-reason">
            {response.refusal_reason ? REFUSAL_LABELS[response.refusal_reason] : 'A consulta não pôde ser respondida com segurança.'}
          </div>
          <p className="refusal-answer">{response.answer}</p>
          <button type="button" className="text-action" onClick={onReset}>Fazer nova consulta</button>
        </article>
      ) : (
        <>
          <div className="result-metrics">
            <div className="metric-card"><span className="metric-icon success"><Icon name="check" size={18} /></span><div><small>Confiança</small><strong>{CONFIDENCE_LABELS[response.confidence_level]}</strong></div></div>
            <div className="metric-card"><span className="metric-icon"><Icon name="database" size={18} /></span><div><small>Bases consultadas</small><strong>{response.bases_consultadas.length} {response.bases_consultadas.length === 1 ? 'base' : 'bases'}</strong></div></div>
            <div className="metric-card"><span className="metric-icon"><Icon name="file-text" size={18} /></span><div><small>Fontes recuperadas</small><strong>{response.sources_used.length} {response.sources_used.length === 1 ? 'referência' : 'referências'}</strong></div></div>
          </div>

          <article className="answer-card">
            <header className="answer-card-header"><div><i /><span>Resposta fundamentada</span></div><span>Adaptive RAG</span></header>
            <div className="answer-body">{response.answer}</div>

            {response.bases_consultadas.length > 0 ? (
              <section className="answer-section">
                <h3>Bases de conhecimento utilizadas</h3>
                <div className="used-bases-grid">
                  {response.bases_consultadas.map((base) => (
                    <div className="used-base" key={base}><span>{findBaseName(base)}</span><small>Selecionada pelo roteador</small></div>
                  ))}
                </div>
              </section>
            ) : null}

            {response.sources_used.length > 0 ? (
              <section className="answer-section">
                <h3>Fontes recuperadas</h3>
                <div className="sources-list">
                  {response.sources_used.map((source) => (
                    <div className="source-card" key={`${source.base_id}-${source.chunk_id}`}>
                      <span className="source-icon"><Icon name="file-text" size={17} /></span>
                      <div><strong>{source.source_file}</strong><small>{source.base_id} · {source.chunk_id}</small></div>
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
