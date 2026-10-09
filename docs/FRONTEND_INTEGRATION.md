# Integração do frontend NEXO com o backend

Este documento descreve **como o frontend React implementa** o contrato oficial da API.
A fonte de verdade é o `FRONTEND_API_CONTRACT.md` do repositório do backend: se os dois
divergirem, vale o contrato, e este documento deve ser corrigido.

O frontend não conhece detalhes internos do RAG (FAISS, BM25, RRF, rerank, SQLite).
Ele só envia requisições HTTP e exibe o que o backend devolve.

## 1. Configuração: `VITE_API_BASE_URL`

Toda chamada usa a URL definida em `VITE_API_BASE_URL`. Nenhum componente ou service
contém endereço fixo.

| Ambiente | Onde a variável é definida | Valor típico |
| --- | --- | --- |
| Desenvolvimento (`npm run dev`) | `.env.development` (versionado) | `http://localhost:8080` |
| Override local | `.env.development.local` (não versionado) | qualquer URL |
| Build manual para o Pages (`npm run build:pages`) | `.env.production.local` (não versionado) | URL HTTPS do backend |
| Build pelo GitHub Actions | variável do repositório `VITE_API_BASE_URL` | URL HTTPS do backend |

Se a variável estiver vazia no build, a interface mostra
"O endereço do backend não foi configurado (VITE_API_BASE_URL)" em toda tela que depende
da API. Não há valor padrão escondido.

## 2. Estrutura dos services

```text
src/services/
├── api.ts                    # cliente HTTP único: URL base, timeout, erros por status
├── health.service.ts         # GET  /health
├── query.service.ts          # POST /api/v1/query
├── history.service.ts        # GET  /api/v1/history
├── feedback.service.ts       # POST /api/v1/feedback
├── contracts.service.ts      # GET  /api/v1/explore/contratacoes
├── documents.service.ts      # GET  /api/v1/explore/documentos
├── organizations.service.ts  # GET  /api/v1/explore/orgaos
├── sources.service.ts        # GET  /api/v1/explore/fontes
└── project.service.ts        # GET  /api/v1/project/summary
```

Os tipos de resposta estão em `src/types/api.ts`, copiados da seção 15 do contrato.
Tipos que existem só na interface (navegação, turnos da conversa) ficam em `src/types/app.ts`.

Fluxo obrigatório, sem exceções:

```text
Página/Componente → hook → service → api.ts → FastAPI
```

Componentes nunca chamam `fetch`. Os hooks principais são:

| Hook | Uso |
| --- | --- |
| `useApiResource` | um recurso (fontes, resumo do projeto, histórico) com `loading/success/empty/error` |
| `usePaginatedList` | listas do Explorar com `limit`/`offset` e botão "Carregar mais" |
| `useRagWorkspace` | conversa da sessão atual (consulta, avaliação, reabrir item do histórico) |
| `useHealth` | indicador "Backend online/offline" da sidebar, rechecado a cada 30 s |

### `api.ts`

- **Timeouts:** 20 s para catálogo e 240 s para `/api/v1/query`: o backend espera até 180 s pelo LLM, mais a busca.
- **Status preservado:** todo erro vira `ApiError` com `kind` (`config`, `network`, `timeout`, `http`)
  e `status`.
- **Mensagem de erro:** usa o `detail` do FastAPI quando existe, seja texto ou lista de validação.
  Sem `detail`, usa a mensagem padrão do status (seção 4 deste documento).
- **Parâmetros vazios:** não são enviados, para valer o padrão do backend.

## 3. Páginas e endpoints

| Página | Endpoint(s) | Parâmetros usados |
| --- | --- | --- |
| Consulta | `POST /api/v1/query`, `POST /api/v1/feedback` | `query`, `top_k=5` |
| Histórico | `GET /api/v1/history` | `limit=100` (máximo do contrato) |
| Contratações | `GET /api/v1/explore/contratacoes` | `busca`, `orgao`, `limit=24`, `offset` |
| Documentos | `GET /api/v1/explore/documentos` | `busca`, `tipo`, `limit=24`, `offset` |
| Órgãos | `GET /api/v1/explore/orgaos` | `busca`, `limit=24`, `offset` |
| Fontes oficiais | `GET /api/v1/explore/fontes` | nenhum |
| Transparência da IA | `GET /api/v1/project/summary` | nenhum |
| Sobre o projeto | `GET /api/v1/project/summary` (versão resumida) | nenhum |
| Sidebar | `GET /health` | nenhum |

As buscas de texto esperam 400 ms sem digitação antes de chamar a API.
O filtro `tipo` de Documentos oferece só os rótulos do contrato:
`Normativo`, `Contrato`, `Ata de Registro` e `PCA`.

Campos `null` aparecem como "Não informado". Nada é inferido: status, modalidade, sigla,
categoria e URL só são exibidos quando a API os envia.

## 4. Estados de tela

Toda tela que consome a API tem quatro estados distintos:

| Estado | Quando | O que aparece |
| --- | --- | --- |
| `loading` | requisição em andamento | indicador "Carregando..." |
| `success` | 200 com dados | os dados |
| `empty` | 200 com `[]` | mensagem de lista vazia |
| `error` | qualquer falha | mensagem real + botão "Tentar novamente" |

Mensagens por status (quando o backend não envia `detail`):

| Código | Mensagem |
| --- | --- |
| rede | "Não foi possível conectar ao backend. Verifique se ele está em execução." |
| timeout | "O servidor demorou demais para responder. Tente novamente." |
| 404 | "Recurso não encontrado." (no feedback: "Esta consulta não foi encontrada no servidor.") |
| 422 | detalhes de validação do FastAPI, ou "Os dados enviados são inválidos." |
| 500 | "O servidor não conseguiu concluir a solicitação. Tente novamente." |
| 503 | "O acervo está temporariamente indisponível. Tente novamente em instantes." |

Erro nunca é trocado por mock, catálogo local ou sucesso falso.

## 5. Fluxo Consulta → `query_id` → Feedback

1. A pergunta (1 a 4.000 caracteres) é enviada como `{ "query": "...", "top_k": 5 }`.
2. A resposta, incluindo o `query_id`, é guardada no turno da conversa, em memória.
   O frontend não gera nem altera ids.
3. Abaixo de cada resposta aparece "Esta resposta foi útil?":
   - **Sim** envia `{ query_id, avaliacao: "positivo", comentario: null }`;
   - **Não** abre um campo de comentário opcional (até 2.000 caracteres) e envia
     `{ query_id, avaliacao: "negativo", comentario }`.
4. "Feedback registrado" só aparece depois do `200`. Em caso de 404, 422, 500 ou falha de rede,
   a mensagem real aparece com "Tentar novamente".

### Conversa contínua

Depois da primeira resposta, um campo fixo no rodapé permite fazer novas perguntas na mesma tela.
Cada pergunta é uma consulta independente para o backend. O contrato aceita só `query` e `top_k`,
então o contexto das perguntas anteriores **não** é enviado. A conversa existe apenas na sessão
aberta; "Nova conversa" limpa a tela.

## 6. Fluxo do Histórico

- A página Histórico chama `GET /api/v1/history?limit=100` toda vez que é aberta.
  Não existe cópia em `localStorage`, `sessionStorage` ou memória entre sessões.
- Cada item mostra pergunta, data (`ts`), nível de evidência, resumo da resposta, número de fontes
  e a última avaliação registrada (`feedback`).
- Abrir um item leva a resposta para a tela de Consulta, já marcada como avaliada se houver
  feedback, e permite continuar perguntando.
- O campo "Filtrar consultas carregadas" só filtra os itens já recebidos; não chama a API.
- Como o backend grava cada consulta isoladamente, o histórico lista consultas, não conversas.

## 7. Executando frontend e backend localmente

```bash
# Terminal 1: backend (na raiz do repositório do backend)
uvicorn app.api:app --reload --host 127.0.0.1 --port 8080

# Terminal 2: frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. O backend libera CORS para `http://localhost:5173` e
`http://127.0.0.1:5173`. Com o backend desligado, a sidebar mostra "Backend offline" e cada
página mostra erro de conexão.

## 8. Backend HTTPS para o GitHub Pages

O site publicado (`https://etuarda.github.io/frontendRAG/`) é servido por HTTPS. Para funcionar,
ele precisa de:

1. **Backend acessível por HTTPS**: servidor próprio ou túnel (ex.: `cloudflared tunnel --url http://localhost:8080`
   ou `ngrok http 8080`).
2. **CORS liberado no backend para a origem `https://etuarda.github.io`.** Hoje o contrato libera
   apenas as origens locais; sem essa mudança no backend, o navegador bloqueia as chamadas.
3. **URL no build**, por um destes caminhos:
   - **Build manual:** crie `.env.production.local` com
     `VITE_API_BASE_URL=https://URL-DO-BACKEND`, rode `npm run build:pages` e faça commit de
     `index.html`, `assets/` e `docs/`;
   - **GitHub Actions:** crie a variável `VITE_API_BASE_URL` em
     *Settings → Secrets and variables → Actions → Variables*. O workflow `deploy.yml` a usa no build.

A URL do backend fica embutida no JavaScript publicado. Trocar de ambiente exige só um novo build,
sem mudar código.

## 9. Testes automatizados

`npm test` roda 30 testes com Vitest e Testing Library. Nos testes, o `fetch` é substituído
por `src/test/http.ts`: nenhuma requisição sai da máquina e nada disso entra no build.

| Arquivo | O que garante |
| --- | --- |
| `services/api.test.ts` | URL base, parâmetros vazios omitidos, JSON no POST, falha de rede, timeout, 404/422/500/503 e URL não configurada |
| `services/services.test.ts` | corpo exato do `/query` (`query` + `top_k`), `query_id` intacto no feedback, 404 do feedback, `limit` do histórico, filtros do Explorar, `/health` |
| `hooks/usePaginatedList.test.ts` | paginação por `offset`, estados `empty` e `error`, recarga ao mudar filtros |
| `components/feedback/AnswerFeedback.test.tsx` | confirmação só após o 200, comentário no negativo, erro real com nova tentativa |
| `pages/pages.test.tsx` | `null` como "Não informado", erro com "Tentar novamente", histórico vazio sem exemplos, app com backend desligado |

O workflow `deploy.yml` roda os testes antes do build: se algum falhar, o deploy não acontece.

## 10. O que foi removido

| Removido | Motivo |
| --- | --- |
| `src/mocks/rag.mock.ts` e `VITE_USE_MOCKS` | respostas simuladas |
| `catch` que devolvia mock quando a API falhava | escondia o erro real |
| Feedback que confirmava sucesso mesmo com falha | sucesso falso |
| `src/utils/catalog.ts` (`CONTRATACOES_MOCK`, `DOCUMENTOS_MOCK`, `ORGAOS_MOCK`, `OFFICIAL_SOURCES`) | catálogos hardcoded |
| Histórico em `localStorage`/`sessionStorage` (e migração do formato antigo) | fonte paralela ao backend |
| Envio de `fonte_filter`, `search_strategy`, `conversation_id` e `history` | campos fora do contrato |
| Seletores de fonte, ano e estratégia na busca | filtros que o backend não oferece |
| Painel "Ver detalhes da recuperação" | valores inventados (ex.: reranker) e detalhes internos do RAG |
| Textos sobre BM25/RRF/rerank e "fidelidade superior a 92%" | detalhes internos e estatística sem fonte |
| Indicador fixo "Sistema online" | substituído por `GET /health` real |
| Pastas sem uso `src/features`, `src/shared`, `src/domain` | código morto com dados fixos |

Única persistência no navegador que permanece: a preferência de sidebar recolhida no desktop
(`localStorage`). É uma conveniência de interface e não guarda dados da API.
