import { useState } from 'react';
import { MOCK_EXECUTION_TRACES, MOCK_OBS_SUMMARY } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function ObservabilityView() {
  const [traces] = useState(MOCK_EXECUTION_TRACES);

  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">TELEMETRIA E AUDITORIA OPERACIONAL</span>
        <h1>Observabilidade do <em>Pipeline</em></h1>
        <p>Rastreamento estruturado de execuções, identificadores de busca, medição de latência por estágio e consumo de tokens.</p>
      </header>

      {/* Métricas Operacionais */}
      <section className="dashboard-card" aria-labelledby="obs-summary-heading">
        <h2 id="obs-summary-heading" className="card-title">
          <Icon name="activity" size={17} />
          <span>Resumo Operacional das Consultas (obs.py)</span>
        </h2>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Execuções Registradas</span>
            <strong className="stat-value">{MOCK_OBS_SUMMARY.totalExecucoes}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Latência Média</span>
            <strong className="stat-value">{MOCK_OBS_SUMMARY.latenciaMediaMs} ms</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Consumo de Tokens</span>
            <strong className="stat-value">{MOCK_OBS_SUMMARY.tokensConsumidosTotal.toLocaleString()}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Taxa de Resolução</span>
            <strong className="stat-value text-accent">{(MOCK_OBS_SUMMARY.taxaSucesso * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </section>

      {/* Traces de Execução */}
      <section className="dashboard-card" aria-labelledby="traces-heading">
        <h2 id="traces-heading" className="card-title">
          <Icon name="cpu" size={17} />
          <span>Registros Recentes de Rastreamento (Traces)</span>
        </h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Query ID</th>
                <th>Data / Hora</th>
                <th>Status</th>
                <th>Tempo</th>
                <th>Tokens</th>
                <th>Modelo</th>
                <th>Bases</th>
              </tr>
            </thead>
            <tbody>
              {traces.map((trace) => (
                <tr key={trace.runId}>
                  <td><code className="code-text">{trace.runId}</code></td>
                  <td><code className="code-text">{trace.queryId}</code></td>
                  <td>{trace.timestamp}</td>
                  <td>
                    <span className="table-status-tag">
                      <span
                        className={`dot-indicator ${
                          trace.status === 'sucesso'
                            ? 'dot-success'
                            : trace.status === 'recusa'
                            ? 'dot-warning'
                            : 'dot-danger'
                        }`}
                      />
                      {trace.status}
                    </span>
                  </td>
                  <td>{trace.tempoTotalMs} ms</td>
                  <td>{trace.tokensTotal}</td>
                  <td>{trace.modelo}</td>
                  <td>
                    <div className="badge-row">
                      {trace.basesConsultadas.map((b) => (
                        <span key={b} className="table-nature-tag">
                          {b}
                        </span>
                      ))}
                    </div>
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
