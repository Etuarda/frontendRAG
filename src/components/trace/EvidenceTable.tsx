import type { TraceEvidence, TraceStage } from '../../types/api';
import { BASE_LABELS } from './traceLabels';

export const evidenceRecords = (value: unknown): TraceEvidence[] => Array.isArray(value) ? value.filter((v): v is TraceEvidence => !!v && typeof v === 'object') : [];
const idOf = (e: TraceEvidence) => String(e.chunk_id ?? e.evidence_id ?? e.id ?? 'Evidência');
const fmt = (n: number | null | undefined, digits: number) => typeof n === 'number' ? n.toFixed(digits) : '—';

export function ranksBefore(etapas: TraceStage[], current: number): Map<string, number> {
  const fusion = etapas.slice(0, current).filter(s => s.stage === 'fusao_rrf').at(-1);
  return new Map(evidenceRecords(fusion?.detalhes.evidencias).map((e, i) => [idOf(e), Number(e.rank ?? i + 1)]));
}

export function EvidenceTable({ stage, previousRanks }: { stage: TraceStage; previousRanks: Map<string, number> }) {
  const items = evidenceRecords(stage.detalhes.evidencias); if (!items.length) return null;
  const omitted = Number(stage.detalhes.evidencias_fora_do_log ?? 0);
  return <div className="trace-table-wrap"><table className="trace-evidence-table"><thead><tr><th>Posição</th><th>Trecho</th><th>Base</th><th>Densa</th><th>BM25</th><th>RRF</th><th>Rerank</th><th>Movimento</th></tr></thead><tbody>{items.map((e, i) => { const id=idOf(e), rank=Number(e.rank??i+1), before=previousRanks.get(id), move=before===undefined?null:before-rank; return <tr key={`${id}-${i}`}><td>{rank}</td><td title={id}>{e.source_file ?? id}{e.identificador_pncp_exato ? <small>nº PNCP exato</small>:null}</td><td>{BASE_LABELS[String(e.base_id)] ?? String(e.base_id ?? '—')}</td><td>{fmt(e.dense_score ?? (stage.stage==='retrieval_denso'?e.score:null),4)}</td><td>{fmt(e.sparse_score ?? (stage.stage==='retrieval_bm25'?e.score:null),2)}</td><td>{fmt(e.rrf_score ?? (stage.stage==='fusao_rrf'?e.score:null),4)}</td><td>{fmt(e.rerank_score ?? (stage.stage==='rerank'?e.score:null),4)}</td><td>{move===null?'—':`${before}º → ${rank}º ${move>0?`↑ ${move}`:move<0?`↓ ${Math.abs(move)}`:'—'}`}</td></tr>;})}</tbody></table>{omitted>0?<p>+{omitted} candidatos não registrados no log</p>:null}</div>;
}
