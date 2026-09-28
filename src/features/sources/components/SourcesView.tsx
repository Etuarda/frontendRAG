import { OFFICIAL_SOURCES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

export function SourcesView() {
  return (
    <div className="view-container">
      <header className="view-header">
        <div className="hero-kicker">
          <Icon name="compass" size={14} />
          <span>Proveniência e Transparência</span>
        </div>
        <h1>Fontes <em>Oficiais</em></h1>
        <p>Catálogo de origens de dados de contratações públicas do Estado do Rio de Janeiro.</p>
      </header>

      <div className="sources-grid">
        {OFFICIAL_SOURCES.map((source) => (
          <article key={source.id} className="source-card">
            <header className="source-card-header">
              <div className="source-meta">
                <span className="source-sigla">{source.sigla}</span>
                <span className={`nature-badge nature-${source.natureza}`}>
                  {source.natureza}
                </span>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="external-link"
                title={`Acessar ${source.nome}`}
              >
                <span>Visitar</span>
                <Icon name="arrow-up-right" size={14} />
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
                <span>Auditoria: <strong>Válida</strong></span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

