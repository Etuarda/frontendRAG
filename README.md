# NEXO RJ — Frontend

Interface React do NEXO RJ, consulta inteligente sobre contratações públicas do Estado do Rio de Janeiro. Projeto da Residência em IA & RAG (Instituto ECOA · PUC-Rio).

O frontend consome **exclusivamente** o backend FastAPI do Grande Desafio, seguindo o contrato oficial `FRONTEND_API_CONTRACT.md` (mantido no repositório do backend). Não há mocks, dados de exemplo nem histórico guardado no navegador: com o backend desligado, a interface mostra erro de conexão.

Detalhes da integração (services, endpoints por página, estados de tela, deploy): [docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md).

## Stack

React 19 · TypeScript · Vite 6 · CSS próprio, mobile-first.

## Como executar

Pré-requisitos: Node.js 18+ e o backend rodando em `http://localhost:8000`.

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run dev` usa `VITE_API_BASE_URL` de `.env.development` (`http://localhost:8000`). Para outro endereço, crie `.env.development.local` com o valor desejado.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes automatizados (Vitest + Testing Library) |
| `npm run build` | Checagem de tipos e build de produção em `dist/` |
| `npm run build:pages` | Build + cópia para `assets/` e `docs/` (GitHub Pages) |
| `npm run preview` | Serve o build de `dist/` localmente |

## Estrutura

```text
src/
├── app/            # App.tsx: composição das páginas e navegação
├── pages/          # Uma pasta por página (Consulta, Histórico, Explorar, Sobre...)
├── components/     # Componentes visuais reutilizáveis (sem fetch)
├── hooks/          # Estado de tela e chamadas via services
├── services/       # api.ts (cliente HTTP único) + um service por recurso
├── types/          # api.ts (tipos do contrato) e app.ts (tipos só de UI)
├── constants/      # Rótulos de interface para valores da API
├── utils/          # Formatadores
└── styles/         # global.css
```

Fluxo obrigatório: `Página/Componente → hook → service → api.ts → FastAPI`.
