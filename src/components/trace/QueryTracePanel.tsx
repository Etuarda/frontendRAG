import { useCallback, useEffect, useState } from 'react';
import type { QueryTrace } from '../../types/api';
import { ApiError } from '../../services/api';
import { getQueryTrace } from '../../services/trace.service';
import { Icon } from '../ui/Icon';
import { TraceSummary } from './TraceSummary';
import { TraceStepCard } from './TraceStepCard';

const message = (error: unknown) => error instanceof ApiError && error.status === 401
  ? 'Este caminho pertence a outra conversa.'
  : error instanceof ApiError && error.status === 404
    ? 'Esta consulta é anterior à rastreabilidade.'
    : 'Não foi possível carregar o caminho desta consulta.';

export function QueryTracePanel({ queryId, sessionId, onClose }: { queryId: string; sessionId: string; onClose: () => void }) {
  const [trace, setTrace] = useState<QueryTrace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setTrace(await getQueryTrace(queryId, sessionId)); } catch (e) { setError(message(e)); } finally { setLoading(false); } }, [queryId, sessionId]);
  useEffect(() => { void load(); }, [load]);
  return <div className="trace-backdrop" role="presentation" onMouseDown={onClose}><aside className="trace-panel" role="dialog" aria-modal="true" aria-labelledby="trace-title" onMouseDown={(e) => e.stopPropagation()}>
    <header><h2 id="trace-title">Caminho da resposta</h2><button type="button" onClick={onClose} aria-label="Fechar"><Icon name="x" /></button></header>
    {loading ? <p role="status">Carregando caminho...</p> : error ? <div role="alert"><p>{error}</p><button type="button" onClick={load}>Tentar de novo</button></div> : trace ? <><TraceSummary summary={trace.resumo} latencyMs={trace.latencia_total_ms} /><div className="trace-timeline">{trace.etapas.map(step => <TraceStepCard key={`${step.ordem}-${step.stage}`} step={step} />)}</div></> : <p>Nenhuma etapa disponível.</p>}
  </aside></div>;
}
