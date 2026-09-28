import { useState } from 'react';
import { MOCK_EVAL_METRICS, MOCK_GOLDEN_SET } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function EvaluationView() {
  const [runningEval, setRunningEval] = useState(false);
  const [evalFeedback, setEvalFeedback] = useState<string | null>(null);

  const handleRunEvaluation = () => {
    setRunningEval(true);
    setEvalFeedback('Avaliando 18 perguntas do Golden Set contra o pipeline RAG...');

    setTimeout(() => {
      setRunningEval(false);
      setEvalFeedback('Avaliação concluída! Fidelidade (Faithfulness): 94.2% · Relevância: 91.0% · Sem regressões.');
    }, 2500);
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <div className="hero-kicker">
          <Icon name="check" size={14} />
          <span>Qualidade & Benchmarking</span>
        </div>
        <h1>Avaliação do <em>Adaptive RAG</em></h1>
        <p>Validação sistemática por Golden Set e métricas de fidelidade, precisão e relevância.</p>
      </header>

      {/* Resumo de Métricas RAG */}
      <section className="dashboard-card" aria-labelledby="eval-metrics-heading">
        <div className="card-header-action">
          <h2 id="eval-metrics-heading" className="card-title">
            <Icon name="activity" size={18} />
            <span>Métricas de Desempenho RAG (Ragas / G-Eval)</span>
          </h2>
          <button
            type="button"
            className="btn-secondary"
            disabled={runningEval}
            onClick={handleRunEvaluation}
          >
            <Icon name="refresh" size={14} className={runningEval ? 'spin' : ''} />
            <span>{runningEval ? 'Executando...' : 'Rodar Avaliação'}</span>
          </button>
        </div>

        {evalFeedback ? (
          <div className="info-banner" role="status">
            <Icon name="check" size={16} />
            <span>{evalFeedback}</span>
          </div>
        ) : null}

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Faithfulness (Fidelidade)</span>
            <strong className="stat-value text-accent">{(MOCK_EVAL_METRICS.faithfulnessScore * 100).toFixed(1)}%</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Answer Relevancy</span>
            <strong className="stat-value">{(MOCK_EVAL_METRICS.answerRelevancyScore * 100).toFixed(1)}%</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Context Precision</span>
            <strong className="stat-value">{(MOCK_EVAL_METRICS.contextPrecisionScore * 100).toFixed(1)}%</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Hit Rate Top-3</span>
            <strong className="stat-value text-accent">{(MOCK_EVAL_METRICS.hitRateTop3 * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </section>

      {/* Casos do Golden Set */}
      <section className="dashboard-card" aria-labelledby="golden-set-heading">
        <h2 id="golden-set-heading" className="card-title">
          <Icon name="book-open" size={18} />
          <span>Casos de Referência (Golden Set do Cenário 1)</span>
        </h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pergunta de Referência</th>
                <th>Persona</th>
                <th>Rota Esperada</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GOLDEN_SET.map((item) => (
                <tr key={item.id}>
                  <td><code>{item.id}</code></td>
                  <td><strong>{item.pergunta}</strong></td>
                  <td><span className="persona-badge">{item.persona}</span></td>
                  <td>
                    <span className={`nature-badge nature-${item.rotaEsperada}`}>
                      {item.rotaEsperada}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill status-online">
                      <i /> {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

