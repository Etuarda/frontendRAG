import { EVIDENCE_LEVEL_LABELS, REFUSAL_LABELS } from '../../../domain/rag/catalog';
import type { ConfidenceLevel, EvidenceNature, RagResponse, SourceRef } from '../../../domain/rag/types';
import { Icon } from '../../../shared/components/Icon';

interface AnswerPanelProps {
  response: RagResponse;
  onReset: () => void;
}

function getFriendlyBaseName(baseId: string): string {
  switch (baseId) {
    case 'normativa':
    case 'editais_normativo':
    case 'normas_contratacoes':
      return 'Normas e Legislação Oficial';
    case 'estruturada':
    case 'contratos_estruturado':
      return 'Editais e Contratos (PNCP / SIGA-RJ)';
    case 'conversacional':
    case 'atas_conversacional':
      return 'Atas de Sessão e Registros';
    case 'agregada':
    case 'pca_agregado':
      return 'Dados Abertos e Indicadores';
    default:
      return 'Fontes Oficiais';
  }
}

function formatFriendlySource(source: SourceRef): { title: string; context: string } {
  const file = source.source_file;
  if (
    file.includes('—') ||
    file.includes('Lei') ||
    file.includes('PNCP') ||
    file.includes('SIGA') ||
    file.includes('DOERJ') ||
    file.includes('Portal')
  ) {
    return {
      title: file,
      context: getFriendlyBaseName(source.base_id),
    };
  }

  const cleanName = file.replace(/\.(pdf|json|csv|html)$/i, '').replace(/_/g, ' ');
  return {
    title: cleanName,
    context: getFriendlyBaseName(source.base_id),
  };
}

function getEvidenceDotClass(level: ConfidenceLevel): string {
  switch (level) {
    case 'alta':
      return 'dot-success';
    case 'media':
      return 'dot-warning';
    case 'baixa':
    case 'recusado':
      return 'dot-danger';
  }
}

export function AnswerPanel({ response, onReset }: AnswerPanelProps) {
  return (
    <section className="result-stack">
      {/* 1. Pergunta realizada */}
      <div className="query-recap">
        <div className="recap-content">
          <span className="recap-label">Pergunta realizada:</span>
          <strong className="recap-query">“{response.query}”</strong>
        </div>
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={onReset}
          aria-label="Fazer nova consulta"
        >
          <Icon name="refresh" size={14} />
          <span>Nova Pesquisa</span>
        </button>
      </div>

      {response.is_refusal ? (
        /* Estado de Consulta Não Respondida (Orientado ao Usuário) */
        <article className="refusal-panel" role="alert">
          <div className="refusal-heading">
            <div className="refusal-icon">
              <Icon name="info" size={20} />
            </div>
            <div>
              <h2>Não foi possível responder esta consulta</h2>
              <p>
                As fontes disponíveis não fornecem evidências suficientes para responder esta
                pergunta com segurança.
              </p>
            </div>
          </div>

          {response.refusal_reason ? (
            <div className="refusal-reason">
              <strong>Motivo:</strong>{' '}
              <span>{REFUSAL_LABELS[response.refusal_reason]}</span>
            </div>
          ) : null}

          {response.answer ? (
            <div className="refusal-answer">{response.answer}</div>
          ) : null}
        </article>
      ) : (
        <>
          {/* 2. Resposta Principal (Centro de Prioridade Visual) */}
          <article className="answer-card" aria-labelledby="answer-heading">
            <header className="answer-card-header">
              <div className="answer-status-tag">
                <span className="dot-indicator dot-success" />
                <h2 id="answer-heading" className="answer-title-text">
                  Resposta Fundamentada
                </h2>
              </div>
              <span className="answer-meta-source">
                {response.sources_used.length}{' '}
                {response.sources_used.length === 1 ? 'fonte oficial verificada' : 'fontes oficiais verificadas'}
              </span>
            </header>

            <div className="answer-body">{response.answer}</div>

            {/* 3. Fontes Utilizadas */}
            {response.sources_used.length > 0 ? (
              <section className="answer-section" aria-labelledby="sources-heading">
                <div className="answer-section-header">
                  <h3 id="sources-heading">
                    Fontes utilizadas ({response.sources_used.length}{' '}
                    {response.sources_used.length === 1 ? 'referência' : 'referências'})
                  </h3>
                </div>
                <div className="sources-list">
                  {response.sources_used.map((source, index) => {
                    const friendly = formatFriendlySource(source);
                    return (
                      <div className="source-item" key={`${source.source_file}-${index}`}>
                        <div className="source-item-icon">
                          <Icon name="file-text" size={16} />
                        </div>
                        <div className="source-item-details">
                          <strong className="source-item-filename">{friendly.title}</strong>
                          <span className="source-item-meta">{friendly.context}</span>
                          {source.trecho ? (
                            <p className="source-item-excerpt">“{source.trecho}”</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* 4. Informações Complementares */}
            <footer className="answer-card-footer" aria-label="Informações complementares">
              <div className="footer-meta-block">
                <span className="footer-meta-label">Nível de evidência</span>
                <span className="footer-meta-value">
                  <span
                    className={`dot-indicator ${getEvidenceDotClass(response.confidence_level)}`}
                  />
                  <strong>{EVIDENCE_LEVEL_LABELS[response.confidence_level]}</strong>
                </span>
              </div>

              {response.bases_consultadas.length > 0 ? (
                <div className="footer-meta-block">
                  <span className="footer-meta-label">Fontes de dados consultadas</span>
                  <div className="used-bases-chips">
                    {response.bases_consultadas.map((base: EvidenceNature) => (
                      <span key={base} className="base-chip">
                        {getFriendlyBaseName(base)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </footer>
          </article>
        </>
      )}
    </section>
  );
}
