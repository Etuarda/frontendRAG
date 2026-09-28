import { OFFICIAL_SOURCES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function SourcesView() {
  return (
    <div className="view-container">
      <header className="view-header">
        <span className="section-eyebrow">TRANSPARÊNCIA E PROVENIÊNCIA</span>
        <h1>Fontes <em>Oficiais</em> de Dados</h1>
        <p>Catálogo de repositórios governamentais e portais oficiais de contratações públicas integrados ao pipeline.</p>
      </header>

      <div className="sources-grid">
        {OFFICIAL_SOURCES.map((source) => (
          <article key={source.id} className="source-card">
            <header className="source-card-header">
              <div className="source-meta">
                <strong className="source-sigla">{source.sigla}</strong>
                <span className="source-nature-label">
                  <span className="dot-indicator" />
                  {source.natureza}
                </span>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="external-link"
                title={`Acessar portal ${source.nome}`}
              >
                <span>Acessar portal</span>
                <Icon name="arrow-up-right" size={13} />
              </a>
            </header>

            <h2 className="source-title">{source.nome}</h2>
            <p className="source-desc">{source.descricao}</p>

            <footer className="source-card-footer">
              <div className="footer-meta-item">
                <Icon name="clock" size={13} />
                <span>Coleta: <strong>{source.frequenciaColeta}</strong></span>
              </div>
              <div className="footer-meta-item">
                <Icon name="shield" size={13} />
                <span>Auditoria: <strong>Conforme</strong></span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
