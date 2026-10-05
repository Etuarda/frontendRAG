import { EmptyState, ErrorState, LoadingState } from '../ui/AsyncState';
import { DetailList } from '../catalog/DetailList';
import { getProjectSummary } from '../../services/project.service';
import { useApiResource } from '../../hooks/useApiResource';
import { naturezaLabel } from '../../constants/labels';
import { formatDateTime, formatNumber } from '../../utils/format';

interface ProjectSummaryPanelProps {
  /** Versão curta (página Sobre): sem a tabela de bases. */
  compact?: boolean;
}

/** Números e versões reais do acervo, vindos de GET /api/v1/project/summary. */
export function ProjectSummaryPanel({ compact = false }: ProjectSummaryPanelProps) {
  const { status, data, error, reload } = useApiResource(getProjectSummary, []);

  if (status === 'loading') return <LoadingState label="Carregando dados do acervo..." />;
  if (status === 'error' && error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState title="Resumo do acervo indisponível." />;

  return (
    <section className="project-summary" aria-labelledby="project-summary-title">
      <h2 id="project-summary-title" className="project-summary-title">
        {data.projeto}
      </h2>
      {data.descricao ? <p className="project-summary-desc">{data.descricao}</p> : null}

      <div className="project-metrics">
        <div className="orgao-metric-box">
          <span className="metric-num">{formatNumber(data.total_documentos)}</span>
          <span className="metric-lbl">Documentos</span>
        </div>
        <div className="orgao-metric-box">
          <span className="metric-num">{formatNumber(data.total_itens)}</span>
          <span className="metric-lbl">Itens indexados</span>
        </div>
        <div className="orgao-metric-box">
          <span className="metric-num">{formatNumber(data.total_falhas)}</span>
          <span className="metric-lbl">Falhas de coleta</span>
        </div>
      </div>

      <DetailList
        items={[
          { label: 'Cenário', value: data.scenario_id },
          { label: 'Versão do corpus', value: data.versao_corpus },
          { label: 'Versão do manifesto', value: data.versao_manifesto },
          { label: 'Coletado em', value: data.coletado_em ? formatDateTime(data.coletado_em) : null },
          { label: 'Inventário', value: data.inventario_completo ? 'Completo' : 'Incompleto' },
        ]}
      />

      {!compact && data.bases.length > 0 ? (
        <div className="project-bases">
          <h3 className="project-bases-title">Bases do acervo</h3>
          <div className="table-scroll">
            <table className="project-bases-table">
              <thead>
                <tr>
                  <th scope="col">Base</th>
                  <th scope="col">Natureza</th>
                  <th scope="col">Escopo</th>
                  <th scope="col">Situação</th>
                  <th scope="col" className="num">Documentos</th>
                </tr>
              </thead>
              <tbody>
                {data.bases.map((base) => (
                  <tr key={base.base_id}>
                    <td>
                      <code>{base.base_id}</code>
                    </td>
                    <td>{naturezaLabel(base.natureza)}</td>
                    <td>{base.escopo}</td>
                    <td>{base.status ?? 'Não informado'}</td>
                    <td className="num">{formatNumber(base.documentos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
