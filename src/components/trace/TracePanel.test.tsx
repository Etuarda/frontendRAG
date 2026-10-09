import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { json, stubFetch } from '../../test/http';
import { TracePanel } from './TracePanel';

const TRACE = {
  query_id: 'q_1', session_id: 's_1234567890123456', run_ids: ['run_1'],
  pergunta: 'Quais contratos?', inicio: '2026-10-08T10:00:00-03:00', fim: '2026-10-08T10:00:02-03:00',
  latencia_total_ms: 2000,
  resumo: { consultou_sql: true, consultou_vetorial: true, evidencias_sql: 2, evidencias_vetorial: { contratos: 5 }, fontes_citadas: ['a'], confidence_level: 'alta', is_refusal: false },
  etapas: [{ ordem: 1, stage: 'consulta_sql', base: 'sql', status: 'ok', ts: '2026-10-08T10:00:00-03:00', latencia_ms: 120, input: 'pergunta', output: '2 linhas', tokens: null, modelo: null, detalhes: { sql: 'SELECT * FROM contratacoes', linhas: [{ id: 1 }] } }],
};

describe('TracePanel', () => {
  it('mostra o resumo e os detalhes do caminho da pergunta', async () => {
    const { calls } = stubFetch(() => json(200, TRACE));
    render(<TracePanel sessionId="s_1234567890123456" queryId="q_1" onClose={vi.fn()} />);

    expect(await screen.findByText('Quais contratos?')).toBeInTheDocument();
    expect(screen.getByText('Evidências SQL')).toBeInTheDocument();
    expect(screen.getByText('Consulta à base estruturada')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Ver detalhes'));
    expect(screen.getByText('SELECT * FROM contratacoes')).toBeInTheDocument();
    expect(calls[0].headers.get('X-Session-Id')).toBe('s_1234567890123456');
  });

  it('oferece nova tentativa quando a rede falha', async () => {
    let attempt = 0;
    stubFetch(() => ++attempt === 1 ? Promise.reject(new TypeError('offline')) : json(200, TRACE));
    render(<TracePanel sessionId="s_1234567890123456" queryId="q_1" onClose={vi.fn()} />);
    expect(await screen.findByText(/conectar ao backend/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByText('Quais contratos?')).toBeInTheDocument();
  });
});
