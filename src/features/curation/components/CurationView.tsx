import { useState } from 'react';
import { MOCK_CURATION_MANIFEST, SENSITIVITY_RULES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function CurationView() {
  const [rules, setRules] = useState(SENSITIVITY_RULES);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleRunAudit = () => {
    setAuditMessage('Varredura concluída: 7.260 chunks validados sem vazamento de dados sensíveis ou PII.');
    setTimeout(() => {
      setAuditMessage(null);
    }, 4500);
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'ativo' ? 'inativo' : 'ativo' } : r
      )
    );
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">CONFORMIDADE E INTEGRIDADE DE DADOS</span>
        <h1>Curadoria do <em>Corpus</em></h1>
        <p>Diretrizes de proteção de dados, regras de saneamento e auditoria legal das bases públicas.</p>
      </header>

      {/* Resumo do Manifesto */}
      <section className="dashboard-card" aria-labelledby="manifesto-heading">
        <div className="card-header-action">
          <h2 id="manifesto-heading" className="card-title">
            <Icon name="file-text" size={17} />
            <span>Manifesto de Curadoria ({MOCK_CURATION_MANIFEST.versao})</span>
          </h2>
          <button type="button" className="btn-secondary" onClick={handleRunAudit}>
            <Icon name="refresh" size={14} />
            <span>Auditar Integridade</span>
          </button>
        </div>

        {auditMessage ? (
          <div className="info-banner" role="status">
            <Icon name="check" size={15} />
            <span>{auditMessage}</span>
          </div>
        ) : null}

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Documentos Saneados</span>
            <strong className="stat-value">{MOCK_CURATION_MANIFEST.totalDocumentos}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Chunks Validados</span>
            <strong className="stat-value">{MOCK_CURATION_MANIFEST.totalChunksValidos.toLocaleString()}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Bloqueios de Sensibilidade</span>
            <strong className="stat-value text-accent">{MOCK_CURATION_MANIFEST.piiBloqueados}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Última Auditoria</span>
            <strong className="stat-value">{MOCK_CURATION_MANIFEST.ultimaAuditoria}</strong>
          </div>
        </div>
      </section>

      {/* Regras de Sensibilidade */}
      <section className="dashboard-card" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="card-title">
          <Icon name="shield" size={17} />
          <span>Regras de Sensibilidade Ativas (sensitivity.py)</span>
        </h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Regra de Segurança</th>
                <th>Categoria</th>
                <th>Ação Obrigatória</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td><code className="code-text">{rule.id}</code></td>
                  <td><strong>{rule.nome}</strong></td>
                  <td>{rule.categoria}</td>
                  <td><code className="code-text">{rule.acao}</code></td>
                  <td>
                    <span className="table-status-tag">
                      <span className={`dot-indicator ${rule.status === 'ativo' ? 'dot-success' : 'dot-danger'}`} />
                      {rule.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => toggleRule(rule.id)}
                    >
                      {rule.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
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
