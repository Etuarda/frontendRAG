import { useCallback, useEffect, useState } from 'react';
import type {
  SessionTraceResponse,
  TraceResponse,
  TraceStage,
  TraceSummary,
} from '../../types/api';
import { getQuestionTrace, getSessionTrace } from '../../services/trace.service';
import { errorMessage } from '../../hooks/useApiResource';
import { Icon } from '../ui/Icon';
import { EvidenceTable as DetailedEvidenceTable, ranksBefore } from './EvidenceTable';
import { FiltersBlock } from './FiltersBlock';
import { ModelUsage } from './ModelUsage';
import { StageNotes } from './StageNotes';
import { STATUS_LABELS } from './traceLabels';

interface TracePanelProps {
  sessionId: string;
  queryId?: string;
  onClose: () => void;
}

type PanelSelection = { kind: 'session' } | { kind: 'question'; queryId: string };

const STAGE_LABELS: Record<string, string> = {
  reformulacao: 'Entendimento do contexto',
  query_analysis: 'Análise da pergunta',
  roteamento: 'Escolha das bases',
  retrieval_denso: 'Busca por significado',
  retrieval_bm25: 'Busca por palavras',
  fusao_rrf: 'Combinação dos resultados',
  rerank: 'Ordenação das evidências',
  consulta_sql: 'Consulta à base estruturada',
  geracao: 'Geração da resposta',
  validacao: 'Validação das fontes',
  resumo_consulta: 'Resumo do caminho',
  feedback: 'Feedback da resposta',
};

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  const seconds = ms / 1000;
  return seconds < 60 ? `${seconds.toFixed(seconds < 10 ? 1 : 0)} s` : `${Math.floor(seconds / 60)} min ${Math.round(seconds % 60)} s`;
}

function countVectorEvidence(value: TraceSummary['evidencias_vetorial']): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') return Object.values(value).reduce((sum, item) => sum + Number(item || 0), 0);
  return 0;
}

function SummaryBadges({ summary, totalMs }: { summary: TraceSummary; totalMs: number }) {
  const cited = Array.isArray(summary.fontes_citadas) ? summary.fontes_citadas.length : Number(summary.num_fontes ?? 0);
  const sql = summary.consultou_sql ? (summary.sql_retornou_evidencia === false ? 'SQL — sem resultado' : 'SQL') : '';
  const vector = summary.consultou_vetorial ? (summary.vetorial_retornou_evidencia === false ? 'Vetorial — sem resultado' : 'Vetorial') : '';
  return (
    <div className="trace-summary-grid">
      <div><span>Bases consultadas</span><strong>{[sql, vector].filter(Boolean).join(' · ') || 'Nenhuma'}</strong></div>
      <div><span>Evidências SQL</span><strong>{Number(summary.evidencias_sql ?? 0)}</strong></div>
      <div><span>Evidências vetoriais</span><strong>{countVectorEvidence(summary.evidencias_vetorial)}</strong></div>
      <div><span>Fontes citadas</span><strong>{cited}</strong></div>
      <div><span>Resultado</span><strong>{summary.is_refusal ? 'Recusada' : String(summary.confidence_level ?? 'Concluída')}</strong></div>
      <div><span>Tempo total</span><strong>{formatMs(totalMs)}</strong></div>
    </div>
  );
}

function asRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object') : [];
}

function evidenceId(item: Record<string, unknown>): string {
  return String(item.chunk_id ?? item.evidence_id ?? item.id ?? 'Evidência');
}

function scoreOf(item: Record<string, unknown>): string {
  const score = item.rerank_score ?? item.score ?? item.rrf_score ?? item.dense_score ?? item.sparse_score;
  return typeof score === 'number' ? score.toFixed(4) : '—';
}

function EvidenceTable({ items, previousRanks }: { items: Array<Record<string, unknown>>; previousRanks: Map<string, number> }) {
  if (items.length === 0) return null;
  return (
    <div className="trace-table-wrap">
      <table className="trace-evidence-table">
        <thead><tr><th>Posição</th><th>Trecho</th><th>Score</th><th>Movimento</th></tr></thead>
        <tbody>
          {items.map((item, index) => {
            const id = evidenceId(item);
            const rank = Number(item.rank ?? index + 1);
            const before = previousRanks.get(id);
            const movement = before ? before - rank : 0;
            return (
              <tr key={`${id}-${index}`}>
                <td>{rank}</td><td title={id}>{id}</td><td>{scoreOf(item)}</td>
                <td>{before === undefined ? '—' : movement > 0 ? `↑ ${movement}` : movement < 0 ? `↓ ${Math.abs(movement)}` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  if (value === null || value === undefined) return null;
  return <pre className="trace-code-block">{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>;
}

function StageCard({ stage, previousRanks }: { stage: TraceStage; previousRanks: Map<string, number> }) {
  const evidence = asRecords(stage.detalhes.evidencias);
  const sql = stage.detalhes.sql;
  const rows = stage.detalhes.linhas ?? stage.detalhes.resultado;
  const nestedResponse = stage.detalhes.resposta && typeof stage.detalhes.resposta === 'object'
    ? stage.detalhes.resposta as Record<string, unknown>
    : null;
  const prompt = stage.detalhes.prompt ?? nestedResponse?.prompt;
  return (
    <li className="trace-stage-card">
      <div className="trace-stage-marker" aria-hidden="true" />
      <div className="trace-stage-content">
        <div className="trace-stage-heading">
          <div><strong>{STAGE_LABELS[stage.stage] ?? stage.stage.replaceAll('_', ' ')}</strong>{stage.base ? <span className={`trace-base-badge trace-base-${stage.base}`}>{stage.base === 'sql' ? 'SQL' : 'Vetorial'}</span> : null}</div>
          <span>{formatMs(stage.latencia_ms)}</span>
        </div>
        <span className={`trace-status trace-status-${stage.status === 'ok' ? 'ok' : 'warning'}`}>{STATUS_LABELS[stage.status] ?? stage.status}</span>
        {stage.detalhes.tentativa_busca === 2 && ['retrieval_denso', 'retrieval_bm25', 'fusao_rrf', 'rerank'].includes(stage.stage) ? <span className="trace-attempt">2ª tentativa · sem filtros</span> : null}
        <details className="trace-stage-details">
          <summary>Ver detalhes</summary>
          <DetailedEvidenceTable stage={stage} previousRanks={previousRanks} />
          <FiltersBlock detalhes={stage.detalhes} />
          <StageNotes stage={stage} />
          <ModelUsage stage={stage} />
          {sql ? <section><h4>SQL executado</h4><JsonBlock value={sql} /></section> : null}
          {rows ? <section><h4>Resultado</h4><JsonBlock value={rows} /></section> : null}
          {prompt ? <details><summary>Ver prompt</summary><JsonBlock value={prompt} /></details> : null}
          <details><summary>Entrada e saída</summary><h4>Entrada</h4><JsonBlock value={stage.input} /><h4>Saída</h4><JsonBlock value={stage.output} /></details>
        </details>
      </div>
    </li>
  );
}

function QuestionTraceView({ trace }: { trace: TraceResponse }) {
  return (
    <>
      {trace.completo === false ? <div className="trace-incomplete">Processamento não terminou — trace incompleto</div> : null}
      <p className="trace-question">{trace.pergunta ?? 'Pergunta sem texto registrado'}</p>
      <SummaryBadges summary={trace.resumo} totalMs={trace.latencia_pipeline_ms ?? trace.latencia_total_ms} />
      {trace.latencia_metodo === 'soma_etapas_legado' ? <small>tempo estimado</small> : null}
      <ol className="trace-timeline">
        {trace.etapas.map((stage, index) => <StageCard key={`${stage.ordem}-${stage.stage}`} stage={stage} previousRanks={stage.stage === 'rerank' ? ranksBefore(trace.etapas, index) : new Map()} />)}
      </ol>
    </>
  );
}

function SessionTraceView({ trace, onQuestion }: { trace: SessionTraceResponse; onQuestion: (queryId: string) => void }) {
  return (
    <>
      <div className="trace-session-summary">
        <div><strong>{trace.total_perguntas}</strong><span>Perguntas</span></div>
        <div><strong>{trace.consultou_sql}</strong><span>Usaram SQL</span></div>
        <div><strong>{trace.consultou_vetorial}</strong><span>Usaram busca vetorial</span></div>
      </div>
      <ol className="trace-session-list">
        {trace.perguntas.map((question) => (
          <li key={question.query_id}>
            <button type="button" onClick={() => onQuestion(question.query_id)}>
              <span className="trace-session-order">{question.ordem}</span>
              <span><strong>{question.pergunta ?? 'Pergunta sem texto registrado'}</strong><small>{formatMs(question.latencia_total_ms)}</small></span>
              <span className="trace-session-badges">{question.resumo.consultou_sql ? <em>SQL</em> : null}{question.resumo.consultou_vetorial ? <em>Vetorial</em> : null}</span>
              <Icon name="chevron-right" size={16} />
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

export function TracePanel({ sessionId, queryId, onClose }: TracePanelProps) {
  const [selection, setSelection] = useState<PanelSelection>(queryId ? { kind: 'question', queryId } : { kind: 'session' });
  const [data, setData] = useState<TraceResponse | SessionTraceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setData(selection.kind === 'question' ? await getQuestionTrace(selection.queryId, sessionId) : await getSessionTrace(sessionId));
    } catch (err) {
      setError(errorMessage(err)); setData(null);
    } finally { setLoading(false); }
  }, [selection, sessionId, attempt]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="trace-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="trace-panel" role="dialog" aria-modal="true" aria-labelledby="trace-panel-title">
        <header className="trace-panel-header">
          <div>
            {selection.kind === 'question' && !queryId ? <button type="button" className="trace-back" onClick={() => setSelection({ kind: 'session' })}>← Conversa</button> : null}
            <span className="composer-eyebrow">Transparência</span>
            <h2 id="trace-panel-title">{selection.kind === 'question' ? 'Caminho da pergunta' : 'Caminho da conversa'}</h2>
          </div>
          <button type="button" className="trace-close" onClick={onClose} aria-label="Fechar caminho"><Icon name="x" size={20} /></button>
        </header>
        <div className="trace-panel-body">
          {loading ? <div className="trace-loading"><span /><span /><span /> Carregando caminho...</div> : null}
          {error ? <div className="trace-error" role="alert"><Icon name="info" size={18} /><div><strong>Não foi possível abrir o caminho</strong><p>{error}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Tentar de novo</button></div></div> : null}
          {!loading && !error && data && selection.kind === 'question' ? <QuestionTraceView trace={data as TraceResponse} /> : null}
          {!loading && !error && data && selection.kind === 'session' ? <SessionTraceView trace={data as SessionTraceResponse} onQuestion={(id) => setSelection({ kind: 'question', queryId: id })} /> : null}
        </div>
      </section>
    </div>
  );
}
