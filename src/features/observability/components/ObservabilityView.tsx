import { useState } from 'react';
import { MOCK_EXECUTION_TRACES, MOCK_OBS_SUMMARY } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function ObservabilityView() {
  const [traces] = useState(MOCK_EXECUTION_TRACES);

  return (
    <div className="view-container">
      <header className="view-header">
        <div className="hero-kicker">
          <Icon name="cpu" size={14} />
          <span>Monitoramento & Telemetria</span>
        </div>
        <h1>Observabilidade do <em>Pipeline</em></h1>
        <p>Acompanhe execuções, identificadores de rastreio, latência por etapa e consumo de tokens.</p>
      </header>

      {/* Métricas Operacionais */}
      <section className="dashboard-card" aria-labelledby="obs-summary-heading">
        <h2 id="obs-summary-heading" className="card-title">
          <Icon name="activity" size={18} />
          <span>Resumo de Execução (obs.py)</span>
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
            <span className="stat-label">Tokens Totais</span>
            <strong className="stat-value">{MOCK_OBS_SUMMARY.tokensConsumidosTotal.toLocaleString()}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Taxa de Sucesso</span>
            <strong className="stat-value text-accent">{(MOCK_OBS_SUMMARY.taxaSucesso * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </section>

      {/* Traces de Execução */}
      <section className="dashboard-card" aria-labelledby="traces-heading">
        <h2 id="traces-heading" className="card-title">
          <Icon name="terminal" size={18} />
          <span>Traces Recentes do Pipeline</span>
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
                  <td><code>{trace.runId}</code></td>
                  <td><code>{trace.queryId}</code></td>
                  <td>{trace.timestamp}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        trace.status === 'sucesso'
                          ? 'status-online'
                          : trace.status === 'recusa'
                          ? 'status-warning'
                          : 'status-offline'
                      }`}
                    >
                      <i /> {trace.status}
                    </span>
                  </td>
                  <td>{trace.tempoTotalMs} ms</td>
                  <td>{trace.tokensTotal}</td>
                  <td><span className="model-badge">{trace.modelo}</span></td>
                  <td>
                    <div className="badge-row">
                      {trace.basesConsultadas.map((b) => (
                        <span key={b} className={`nature-badge nature-${b} badge-compact`}>
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

