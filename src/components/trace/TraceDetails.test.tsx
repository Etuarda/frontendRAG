import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TraceStage } from '../../types/api';
import { EvidenceTable, ranksBefore } from './EvidenceTable';
import { FiltersBlock } from './FiltersBlock';
import { ModelUsage } from './ModelUsage';
import { StageNotes } from './StageNotes';

const stage = (overrides: Partial<TraceStage> = {}): TraceStage => ({ ordem: 1, stage: 'retrieval_bm25', base: 'vetorial', status: 'ok', ts: '', latencia_ms: 10, input: null, output: null, tokens: null, modelo: null, detalhes: {}, ...overrides });

describe('detalhes do trace', () => {
  it('BM25 usa score quando sparse_score é null e aceita trace sem campos novos', () => {
    render(<EvidenceTable stage={stage({ detalhes: { evidencias: [{ chunk_id: 'c1', sparse_score: null, score: 12.345 }] } })} previousRanks={new Map()} />);
    expect(screen.getByText('12.35')).toBeInTheDocument();
  });
  it('mostra filtros ignorados e não renderiza bloco sem filtros', () => {
    const { rerender } = render(<FiltersBlock detalhes={{ filtros_ignorados: { orgao: 'nenhum_chunk_passou' } }} />);
    expect(screen.getByText(/nenhum trecho atendia/)).toBeInTheDocument();
    rerender(<FiltersBlock detalhes={{}} />); expect(screen.queryByText('Filtros aplicados')).not.toBeInTheDocument();
  });
  it('rerank compara com a última fusão anterior', () => {
    const etapas = [stage({ ordem:1, stage:'fusao_rrf', detalhes:{ evidencias:[{chunk_id:'a',rank:4}] } }), stage({ordem:2,stage:'rerank'}), stage({ordem:3,stage:'fusao_rrf',detalhes:{evidencias:[{chunk_id:'a',rank:2}]}}), stage({ordem:4,stage:'rerank'})];
    expect(ranksBefore(etapas, 1).get('a')).toBe(4); expect(ranksBefore(etapas, 3).get('a')).toBe(2);
  });
  it('mostra fallback, limite de tokens e uso do modelo', () => {
    render(<ModelUsage stage={stage({ modelo:'modelo-x', tokens:{input:10,output:2}, detalhes:{provider:'openrouter',fallback_used:true,finish_reason:'length'} })} />);
    expect(screen.getByText('fallback OpenRouter')).toBeInTheDocument(); expect(screen.getByText(/limite de tokens/)).toBeInTheDocument();
  });
  it('explica status pulado e citações descartadas', () => {
    const { rerender }=render(<StageNotes stage={stage({status:'pulado',detalhes:{motivo:'calculo_sql_suficiente'}})} />);
    expect(screen.getByText(/SQL respondeu sozinho/)).toBeInTheDocument();
    rerender(<StageNotes stage={stage({stage:'validacao',detalhes:{citacoes_descartadas:2}})} />); expect(screen.getByText(/citacoes descartadas/)).toBeInTheDocument();
  });
});
