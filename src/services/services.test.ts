import { beforeEach, describe, expect, it } from 'vitest';
import { queryRag } from './query.service';
import { sendFeedback } from './feedback.service';
import { getHistory } from './history.service';
import { listContracts } from './contracts.service';
import { listDocuments } from './documents.service';
import { checkHealth } from './health.service';
import { failureOf, json, stubFetch, stubNetworkDown } from '../test/http';
import { getQueryTrace, getSessionTrace } from './trace.service';
import { sessionService } from './session.service';

const RESPONSE = {
  query_id: 'q_a1b2c3d4',
  session_id: 's_abcdefghijklmnopqrstuv',
  query: 'Quais contratos?',
  answer: 'Resposta.',
  bases_consultadas: ['estruturada'],
  sources_used: [],
  confidence_level: 'alta',
  is_refusal: false,
  refusal_reason: null,
  pergunta_reformulada: null,
  avisos: [],
};

describe('query.service', () => {
  beforeEach(() => sessionService.clearSession());
  it('primeira consulta não envia session_id e armazena o retornado', async () => {
    sessionService.clearSession();
    const { calls } = stubFetch(() => json(200, RESPONSE));
    await queryRag('Pergunta');
    expect(calls[0].body).not.toHaveProperty('session_id');
    expect(sessionService.getSessionId()).toBe(RESPONSE.session_id);
  });

  it('consulta seguinte reutiliza session_id', async () => {
    sessionService.setSessionId(RESPONSE.session_id);
    const { calls } = stubFetch(() => json(200, RESPONSE));
    await queryRag('Outra');
    expect(calls[0].body).toMatchObject({ session_id: RESPONSE.session_id });
  });

  it('faz um único retry sem sessão quando o 422 identifica session_id inválido', async () => {
    sessionService.setSessionId(RESPONSE.session_id);
    let count = 0;
    const { calls } = stubFetch(() => ++count === 1 ? json(422, { detail: [{ loc: ['body', 'session_id'], msg: 'inválido' }] }) : json(200, { ...RESPONSE, session_id: 's_novabcdefghijklmnopqrstu' }));
    await queryRag('Outra');
    expect(calls).toHaveLength(2);
    expect(calls[0].body).toHaveProperty('session_id');
    expect(calls[1].body).not.toHaveProperty('session_id');
  });

  it('não repete outros erros 422', async () => {
    sessionService.setSessionId(RESPONSE.session_id);
    const { calls } = stubFetch(() => json(422, { detail: [{ loc: ['body', 'query'], msg: 'inválida' }] }));
    await expect(queryRag('x')).rejects.toThrow();
    expect(calls).toHaveLength(1);
  });

  it('envia somente query e top_k, como no contrato', async () => {
    const { calls } = stubFetch(() => json(200, RESPONSE));
    const result = await queryRag('  Quais contratos?  ');

    expect(calls[0].url.pathname).toBe('/api/v1/query');
    expect(calls[0].body).toEqual({ query: 'Quais contratos?', top_k: 5 });
    expect(result.query_id).toBe('q_a1b2c3d4');
  });
});

describe('trace.service', () => {
  it('envia X-Session-Id no trace individual e da conversa', async () => {
    const { calls } = stubFetch(() => json(200, {}));
    await getQueryTrace('q_1', RESPONSE.session_id);
    await getSessionTrace(RESPONSE.session_id);
    expect(calls[0].url.pathname).toBe('/api/v1/trace/q_1');
    expect(calls[1].url.pathname).toContain('/api/v1/sessions/');
    expect(calls.every(call => call.headers.get('X-Session-Id') === RESPONSE.session_id)).toBe(true);
    expect(calls.every(call => !call.headers.has('X-API-Key'))).toBe(true);
  });

  it.each([401, 404])('preserva status %i para a interface tratar', async (status) => {
    stubFetch(() => json(status, {}));
    const error = await failureOf(getQueryTrace('q_1', RESPONSE.session_id));
    expect(error.status).toBe(status);
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
