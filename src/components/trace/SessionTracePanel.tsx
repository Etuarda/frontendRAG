import { useCallback, useEffect, useState } from 'react';
import type { SessionTrace } from '../../types/api';
import { ApiError } from '../../services/api';
import { getSessionTrace } from '../../services/trace.service';
import { Icon } from '../ui/Icon';

export function SessionTracePanel({ sessionId, onClose, onOpenQuery }: { sessionId: string; onClose: () => void; onOpenQuery: (id: string) => void }) {
  const [data, setData] = useState<SessionTrace | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData(await getSessionTrace(sessionId)); } catch (e) { setError(e instanceof ApiError && e.status === 401 ? 'Este caminho pertence a outra conversa.' : e instanceof ApiError && e.status === 404 ? 'Esta conversa é anterior à rastreabilidade.' : 'Não foi possível carregar o caminho da conversa.'); } finally { setLoading(false); } }, [sessionId]);
  useEffect(() => { void load(); }, [load]);
  return <div className="trace-backdrop" onMouseDown={onClose}><aside className="trace-panel" role="dialog" aria-modal="true" aria-labelledby="session-trace-title" onMouseDown={e => e.stopPropagation()}><header><h2 id="session-trace-title">Caminho da conversa</h2><button type="button" onClick={onClose} aria-label="Fechar"><Icon name="x" /></button></header>
    {loading ? <p role="status">Carregando caminho...</p> : error ? <div role="alert"><p>{error}</p><button type="button" onClick={load}>Tentar de novo</button></div> : data ? <><div className="trace-summary"><span>{data.total_perguntas} perguntas</span><span>{data.consultou_sql} com SQL</span><span>{data.consultou_vetorial} com busca vetorial</span></div><div className="session-trace-list">{data.perguntas.map(item => <button type="button" key={item.query_id} onClick={() => onOpenQuery(item.query_id)}><strong>{item.pergunta ?? 'Pergunta sem texto'}</strong>{item.resumo.consultou_sql ? <span className="trace-badge">SQL</span> : null}{item.resumo.consultou_vetorial ? <span className="trace-badge">Vetorial</span> : null}</button>)}</div></> : <p>Nenhuma pergunta registrada.</p>}
  </aside></div>;
}
