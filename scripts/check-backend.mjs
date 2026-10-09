import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

export const SAMPLE_QUERY = 'O que estabelece a Lei 14.133/2021?';

// Usa os mesmos arquivos .env* e overrides de `npm run dev`.
export function backendUrl(envDir = process.cwd()) {
  return loadEnv('development', envDir, 'VITE_').VITE_API_BASE_URL ?? '';
}

export async function checkBackend({ baseUrl, query, fetchImpl = fetch, log = console.log }) {
  let base;
  try {
    base = new URL(baseUrl);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
      throw new Error();
    }
  } catch {
    log('ERRO: configure VITE_API_BASE_URL com a URL HTTP(S) do backend, sem credenciais, query ou fragmento.');
    return false;
  }
  const url = base.href.replace(/\/+$/, '');
  log(`Backend: ${url}`);

  async function request(endpoint, body) {
    const response = await fetchImpl(`${url}${endpoint}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(body === undefined ? 20_000 : 240_000),
    });
    if (!response.ok) throw new Error(`${endpoint}: HTTP ${response.status}. Confira o terminal do backend.`);
    return response.json();
  }

  try {
    const health = await request('/health');
    if (health?.status !== 'ok') throw new Error('/health não retornou status ok.');
    log('OK: API online.');

    const summary = await request('/api/v1/project/summary');
    if (!(summary?.total_documentos > 0) || !Array.isArray(summary.bases) || summary.bases.length === 0) {
      throw new Error('Corpus ausente. Confira a branch joao-reis do backend.');
    }
    log(`OK: corpus ${summary.versao_corpus}, ${summary.total_documentos} documentos, ${summary.bases.length} bases.`);

    const contracts = await request('/api/v1/explore/contratacoes?limit=1');
    if (!Array.isArray(contracts) || contracts.length === 0) {
      throw new Error('Catálogo de contratos vazio. Confira o SQLite incluído e DATABASE_URL no backend.');
    }
    log('OK: banco estruturado acessível.');

    if (query !== undefined) {
      log('Enviando pergunta real; pode levar até 4 minutos. Ela será registrada no histórico do backend.');
      const result = await request('/api/v1/query', { query, top_k: 5 });
      if (!result?.query_id || typeof result.answer !== 'string' || !result.answer.trim() || !Array.isArray(result.sources_used)) {
        throw new Error('Resposta fora do contrato esperado (query_id, answer, sources_used).');
      }
      if (result.is_refusal !== false || result.sources_used.length === 0) {
        throw new Error('A pergunta não recebeu resposta com fontes. Confira LLM, embeddings e índices no backend.');
      }
      log(`OK: resposta com ${result.sources_used.length} fonte(s); query_id=${result.query_id}.`);
      log(result.answer);
    } else {
      log('Para validar também LLM, embeddings e índices: npm run check:query');
    }
    log('Este diagnóstico HTTP não testa CORS no navegador; confira também a interface.');
    return true;
  } catch (error) {
    log(`ERRO: ${error instanceof Error ? error.message : String(error)}`);
    log('Inicie o backend, confira VITE_API_BASE_URL e consulte docs/GUIA_EXECUCAO_LOCAL.md.');
    return false;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.length > 0 && (args[0] !== '--query' || args.length > 2)) {
    console.error('Uso: npm run check:backend [-- --query "Sua pergunta"]');
    process.exitCode = 1;
  } else {
    const query = args[0] === '--query' ? (args[1] ?? SAMPLE_QUERY) : undefined;
    process.exitCode = (await checkBackend({ baseUrl: backendUrl(), query })) ? 0 : 1;
  }
}
