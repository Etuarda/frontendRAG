import { OFFICIAL_SOURCES } from '../../utils/catalog';
import { Icon } from '../../components/ui/Icon';

export function FontesPage() {
  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">TRANSPARÊNCIA E PROVENIÊNCIA</span>
        <h1 className="page-title">Fontes Oficiais de Informação</h1>
        <p className="page-description">
          Conheça as bases governamentais e repositórios públicos utilizados pelo NEXO RJ para
          fundamentar respostas com evidências autênticas, auditáveis e de acesso público.
        </p>
      </header>

      {/* Painel Explicativo */}
      <section className="overview-notice-card">
        <div className="overview-notice-header">
          <Icon name="compass" size={18} />
          <h2>De onde vêm as evidências</h2>
        </div>
        <p>
          O NEXO RJ não gera informações a partir de bases fictícias ou dados não autenticados.
          Toda resposta é construída exclusivamente a partir do cruzamento de editais oficiais,
          contratos administrativos homologados, atas de registro de preços e diários oficiais do
          Estado do Rio de Janeiro e da União.
        </p>
      </section>

      {/* Grid de Fontes Oficiais */}
      <div className="catalog-items-grid">
        {OFFICIAL_SOURCES.map((source) => (
          <article key={source.id} className="catalog-card">
            <div className="catalog-card-header">
              <span className="orgao-sigla-badge">{source.sigla}</span>
              <span className="source-freq-tag">{source.frequenciaColeta || 'Atualização contínua'}</span>
            </div>

            <h2 className="catalog-card-title">{source.nome}</h2>
            <p className="source-institution-text">{source.instituicao}</p>

            <p className="catalog-card-objeto">{source.descricao}</p>

            <div className="catalog-card-details">
              <div className="detail-row">
                <span className="detail-label">Dados fornecidos:</span>
                <span className="detail-value">{source.tipoInformacao}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Natureza:</span>
                <span className="detail-value">
                  {source.natureza === 'normativa'
                    ? 'Normas e Decretos'
                    : source.natureza === 'estruturada'
                    ? 'Editais e Contratos'
                    : 'Dados Consolidados'}
                </span>
              </div>
            </div>

            <div className="catalog-card-actions">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="btn-external-link"
                title={`Acessar portal oficial de ${source.nome}`}
              >
                <span>Acessar portal oficial</span>
                <Icon name="external-link" size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
