import type { TraceSummary as Summary } from '../../types/api';

export function TraceSummary({ summary, latencyMs }: { summary: Summary; latencyMs: number }) {
  const conversation = !summary.consultou_sql && !summary.consultou_vetorial;
  return <div className="trace-summary">
    {conversation ? <strong>Conversa — sem consulta ao acervo</strong> : null}
    {summary.consultou_sql ? <span className="trace-badge">SQL</span> : null}
    {summary.consultou_vetorial ? <span className="trace-badge">Vetorial</span> : null}
    {summary.evidencias_sql !== undefined ? <span>{summary.evidencias_sql} evidências SQL</span> : null}
    {summary.evidencias_vetorial ? <span>{Object.values(summary.evidencias_vetorial).reduce((total, value) => total + value, 0)} evidências vetoriais</span> : null}
    {summary.fontes_citadas ? <span>{summary.fontes_citadas.length} fontes citadas</span> : null}
    {summary.confidence_level ? <span>Confiança: {summary.confidence_level}</span> : null}
    {summary.is_refusal ? <span className="trace-badge is-warning">Recusada</span> : null}
    <span>Tempo total: {(latencyMs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s</span>
  </div>;
}
