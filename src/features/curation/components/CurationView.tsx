import { useState } from 'react';
import { MOCK_CURATION_MANIFEST, SENSITIVITY_RULES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function CurationView() {
  const [rules, setRules] = useState(SENSITIVITY_RULES);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleRunAudit = () => {
    setAuditMessage('Executando varredura no corpus... 7.260 chunks validados sem vazamento de PII.');
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
        <div className="hero-kicker">
          <Icon name="shield" size={14} />
          <span>Curadoria e Conformidade</span>
        </div>
        <h1>Curadoria do <em>Corpus</em></h1>
        <p>Políticas de sensibilidade, saneamento de dados e auditoria do acervo público.</p>
      </header>

      {/* Resumo do Manifesto */}
      <section className="dashboard-card" aria-labelledby="manifesto-heading">
        <div className="card-header-action">
          <h2 id="manifesto-heading" className="card-title">
            <Icon name="file-text" size={18} />
            <span>Manifesto de Curadoria ({MOCK_CURATION_MANIFEST.versao})</span>
          </h2>
          <button type="button" className="btn-secondary" onClick={handleRunAudit}>
            <Icon name="refresh" size={14} />
            <span>Verificar Integridade</span>
          </button>
        </div>

        {auditMessage ? (
          <div className="info-banner" role="status">
            <Icon name="check" size={16} />
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
            <span className="stat-label">Incidentes Bloqueados</span>
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
          <Icon name="shield" size={18} />
          <span>Regras de Sensibilidade e Proteção (sensitivity.py)</span>
        </h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Regra</th>
                <th>Categoria</th>
                <th>Ação Obrigatória</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td><code>{rule.id}</code></td>
                  <td><strong>{rule.nome}</strong></td>
                  <td><span className="category-pill">{rule.categoria}</span></td>
                  <td><code>{rule.acao}</code></td>
                  <td>
                    <span className={`status-pill ${rule.status === 'ativo' ? 'status-online' : 'status-offline'}`}>
                      <i /> {rule.status}
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

