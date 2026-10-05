import { describe, expect, it } from 'vitest';
import { queryRag } from './query.service';
import { sendFeedback } from './feedback.service';
import { getHistory } from './history.service';
import { listContracts } from './contracts.service';
import { listDocuments } from './documents.service';
import { checkHealth } from './health.service';
import { failureOf, json, stubFetch, stubNetworkDown } from '../test/http';

const RESPONSE = {
  query_id: 'q_a1b2c3d4',
  query: 'Quais contratos?',
  answer: 'Resposta.',
  bases_consultadas: ['estruturada'],
  sources_used: [],
  confidence_level: 'alta',
  is_refusal: false,
  refusal_reason: null,
};

describe('query.service', () => {
  it('envia somente query e top_k, como no contrato', async () => {
    const { calls } = stubFetch(() => json(200, RESPONSE));
    const result = await queryRag('  Quais contratos?  ');

    expect(calls[0].url.pathname).toBe('/api/v1/query');
    expect(calls[0].body).toEqual({ query: 'Quais contratos?', top_k: 5 });
    expect(result.query_id).toBe('q_a1b2c3d4');
  });
});

describe('feedback.service', () => {
  it('envia o query_id recebido sem alteração', async () => {
    const { calls } = stubFetch(() => json(200, { status: 'recebido' }));
    await sendFeedback({ query_id: 'q_a1b2c3d4', avaliacao: 'negativo', comentario: 'faltou fonte' });

    expect(calls[0].url.pathname).toBe('/api/v1/feedback');
    expect(calls[0].body).toEqual({
      query_id: 'q_a1b2c3d4',
      avaliacao: 'negativo',
      comentario: 'faltou fonte',
    });
  });

  it('propaga o 404 como consulta não encontrada (nunca simula sucesso)', async () => {
    stubFetch(() => json(404, { detail: 'query_id desconhecido.' }));
    const error = await failureOf(sendFeedback({ query_id: 'q_x', avaliacao: 'positivo' }));

    expect(error.status).toBe(404);
    expect(error.message).toBe('Esta consulta não foi encontrada no servidor.');
  });

  it('propaga falha de rede', async () => {
    stubNetworkDown();
    await expect(sendFeedback({ query_id: 'q_x', avaliacao: 'positivo' })).rejects.toThrow(/conectar/);
  });
});

describe('history.service', () => {
  it('pede o máximo permitido pelo contrato', async () => {
    const { calls } = stubFetch(() => json(200, []));
    await getHistory();

    expect(calls[0].url.pathname).toBe('/api/v1/history');
    expect(calls[0].url.searchParams.get('limit')).toBe('100');
  });
});

describe('explore services', () => {
  it('contratações: envia busca, órgão e paginação', async () => {
    const { calls } = stubFetch(() => json(200, []));
    await listContracts({ busca: 'software', orgao: 'Caxias' }, { limit: 24, offset: 48 });

    expect(calls[0].url.pathname).toBe('/api/v1/explore/contratacoes');
    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({
      busca: 'software',
      orgao: 'Caxias',
      limit: '24',
      offset: '48',
    });
  });

  it('documentos: não envia tipo vazio', async () => {
    const { calls } = stubFetch(() => json(200, []));
    await listDocuments({ busca: '', tipo: '' }, { limit: 24, offset: 0 });

    expect(calls[0].url.searchParams.has('tipo')).toBe(false);
    expect(calls[0].url.searchParams.has('busca')).toBe(false);
  });
});

describe('health.service', () => {
  it('online quando o backend responde {"status":"ok"}', async () => {
    stubFetch(() => json(200, { status: 'ok' }));
    expect(await checkHealth()).toBe(true);
  });

  it('offline quando não há conexão', async () => {
    stubNetworkDown();
    expect(await checkHealth()).toBe(false);
  });
});
