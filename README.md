# Nexo RJ — Frontend Adaptive RAG (Contratações Públicas RJ)

Interface web completa e moderna do cenário de contratações públicas com Adaptive RAG para o Estado do Rio de Janeiro.

O projeto foi estruturado seguindo os princípios de **Clean Code**, **Separação de Preocupações (SoC)** e **Arquitetura Orientada a Features (FSD)**:

- **Aplicação React 19 + TypeScript + Vite**: Single Page Application (SPA) reativa com 8 módulos integrados, mock configurável e navegação fluida.

---

## 🏛️ Identidade Visual (Design System)

- **Paleta Editorial:** Fundo quente em tom de papel pergaminho (`#f7f5f0`), tipografia grafite (`#2c2a29`) e verde sálvia institucional (`#4a6748`).
- **Tipografia:** Títulos em fontes serifadas clássicas (Georgia / Times New Roman) combinadas a sans-serif moderno de alta legibilidade para UI.
- **Micro-interações:** Brilhos de iluminação ambiente dinâmicos (`ambient-glow`), cartões em vidro fosco (*backdrop-filter: blur*), crachás de natureza de evidência e pílulas de confiança.

---

## 📁 Arquitetura de Pastas e Arquivos

```text
frontend-rag/
├── src/                               # Aplicação React 19 + TypeScript
│   ├── app/                          # Composição da aplicação e orquestração de visões
│   │   └── App.tsx
│   ├── domain/rag/                   # Contratos de domínio, tipagens e catálogo de dados
│   │   ├── types.ts                  # Interfaces fortes (RagResponse, EvidenceNature, etc.)
│   │   └── catalog.ts                # Definições das bases, perguntas e dados do Cenário 1
│   ├── features/                     # Módulos verticais por funcionalidade
│   │   ├── query/                    # Consulta, composer, loading e serviço HTTP
│   │   ├── results/                  # Apresentação da resposta, badges e fontes
│   │   ├── history/                  # Histórico em tela cheia e sidebar retrátil
│   │   ├── corpus/                   # Inventário, contagem de chunks e documentos
│   │   ├── sources/                  # Catálogo de fontes oficiais e links externos
│   │   ├── curation/                 # Manifesto de curadoria e regras de sensibilidade
│   │   ├── pipeline/                 # Gatilho de atualização, chunk size e embeddings
│   │   ├── evaluation/               # Métricas (Faithfulness, Relevancy) e Golden Set
│   │   ├── observability/            # Traces de execução (run_id/query_id), latência e tokens
│   │   ├── knowledge/                # Modal descritivo das 4 bases de conhecimento
│   │   └── guardrails/               # Modal de limites legais e motivos de recusa
│   ├── shared/                       # Componentes e utilitários reutilizáveis
│   │   ├── components/               # Header, Icon (SVG inline), Modal
│   │   ├── config/                   # Configurações gerais da aplicação
│   │   └── utils/                    # Formatadores de data e texto
│   ├── mocks/                        # Respostas simuladas realistas
│   │   └── rag.mock.ts
│   ├── styles/                       # CSS global e design tokens da SPA
│   │   └── global.css
│   └── main.tsx                      # Ponto de montagem React
│
├── .env                              # Variáveis de ambiente locais
├── .env.example
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🚀 Como Executar

### 1. Aplicação React (SPA Interativa)

Certifique-se de ter o Node.js instalado (v18+).

```bash
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

#### Variáveis de Ambiente (`.env`)

```env
# URL da API FastAPI do backend RAG
VITE_API_BASE_URL=http://localhost:8000

# True para navegar e testar a interface de forma autônoma com dados reais simulados
VITE_USE_MOCKS=true
```

---

## 🎯 Princípios de Clean Code Aplicados

1. **Responsabilidade Única (SRP):** Cada componente React ou arquivo CSS cuida de uma única responsabilidade visual ou de negócio.
2. **Desacoplamento de Domínio:** As entidades e contratos em `src/domain/rag/types.ts` não dependem de bibliotecas visuais.
3. **Isolamento de Efeitos Colaterais:** A comunicação com o backend FastAPI fica estritamente encapsulada em `rag.service.ts`.
4. **Resiliência e Mocks Integrados:** O sistema funciona perfeitamente sem o backend ativo quando `VITE_USE_MOCKS=true`, facilitando testes de interface e validação de layout.
