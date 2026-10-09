import { useState } from 'react';
import type { TraceStep } from '../../types/api';
import { Icon } from '../ui/Icon';

const LABELS: Record<string, string> = {
  query_analysis: 'Análise da pergunta', reformulacao: 'Reformulação', roteamento: 'Roteamento',
  retrieval_denso: 'Busca vetorial', retrieval_bm25: 'Busca lexical', fusao_rrf: 'Fusão de resultados',
  rerank: 'Reordenação das evidências', consulta_sql: 'Consulta SQL', geracao: 'Geração da resposta',
  validacao: 'Validação', resumo_consulta: 'Resumo da consulta', interacao: 'Interação',
};

function Detail({ value, name }: { value: unknown; name: string }) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') return <p><strong>{name}:</strong> {String(value)}</p>;
  if (Array.isArray(value)) return <div><strong>{name}</strong><ol>{value.map((item, i) => <li key={i}><Detail value={item} name={`Item ${i + 1}`} /></li>)}</ol></div>;
  return <div><strong>{name}</strong><dl>{Object.entries(value as Record<string, unknown>).map(([key, item]) =>
    key.toLowerCase().includes('sql') && typeof item === 'string'
      ? <div key={key}><dt>{key}</dt><dd><pre>{item}</pre></dd></div>
      : <div key={key}><dt>{key}</dt><dd><Detail value={item} name={key} /></dd></div>
  )}</dl></div>;
}

export function TraceStepCard({ step }: { step: TraceStep }) {
  const [open, setOpen] = useState(false);
  return <article className="trace-step">
    <button type="button" className="trace-step-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
      <Icon name={open ? 'chevron-down' : 'chevron-right'} size={16} />
      <strong>{LABELS[step.stage] ?? step.stage}</strong>
      {step.base ? <span className="trace-badge">{step.base === 'sql' ? 'SQL' : 'Vetorial'}</span> : null}
      <span>{step.status}</span><span>{step.latencia_ms} ms</span>
    </button>
    {open ? <div className="trace-step-details"><Detail value={step.input} name="Entrada" /><Detail value={step.output} name="Saída" /><Detail value={step.detalhes} name="Detalhes" />{step.modelo ? <p>Modelo: {step.modelo}</p> : null}</div> : null}
  </article>;
}
