# Guia: rodar o NEXO RJ localmente (backend + frontend)

Passo a passo, na ordem de execução, para clonar o backend, preencher o `.env`, subir a API,
conectar o frontend e fazer perguntas. Os comandos são para **Windows (PowerShell)**; quando
muda algo no macOS/Linux, está indicado.

Ao final você terá:

| Serviço | Endereço | Repositório |
| --- | --- | --- |
| Backend (FastAPI + pipeline RAG) | `http://localhost:8080` | `Diogooliveira10/rag-grande-desafio-grupo04-cenario01` |
| Frontend (React + Vite) | `http://localhost:5173` | `Etuarda/frontendRAG` |

São necessários **dois terminais abertos ao mesmo tempo**: um para o backend e outro para o frontend.

---

## 0. Pré-requisitos

| Ferramenta | Versão | Como conferir |
| --- | --- | --- |
| Git | qualquer recente | `git --version` |
| Python | 3.11 ou mais novo (testado com 3.14) | `python --version` |
| Node.js | 18 ou mais novo | `node --version` |
| Internet | obrigatória | o LLM da turma roda em servidor remoto |

Espaço em disco: reserve cerca de **3 GB**. As dependências incluem o PyTorch, e o modelo de
rerank (~470 MB) é baixado na primeira pergunta.

---

## Parte A: backend

### Passo 1. Clonar o repositório do backend

```powershell
cd $HOME
git clone https://github.com/Diogooliveira10/rag-grande-desafio-grupo04-cenario01.git
cd rag-grande-desafio-grupo04-cenario01
```

O clone já traz tudo o que é preciso para responder perguntas: os índices FAISS das quatro bases
(`index/`), a base estruturada (`data/structured/base_estruturada.sqlite`) e o inventário do corpus.
**Não é preciso coletar o corpus nem montar índices** para rodar localmente.

### Passo 2. Criar e ativar o ambiente virtual

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

macOS/Linux: `python3 -m venv .venv` e depois `source .venv/bin/activate`.

Se o PowerShell recusar a ativação ("execução de scripts foi desabilitada"), libere scripts só para
o seu usuário e tente de novo:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.venv\Scripts\Activate.ps1
```

Com o ambiente ativo, o prompt começa com `(.venv)`. **Todos os comandos do backend a partir daqui
devem rodar com o `(.venv)` ativo.**

### Passo 3. Instalar as dependências

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Demora alguns minutos (PyTorch, FAISS, sentence-transformers). Ao terminar, confira os três
pacotes que o pipeline usa na hora da pergunta:

```powershell
python -c "import faiss, sentence_transformers, uvicorn; print('dependências ok')"
```

Se aparecer `ModuleNotFoundError`, rode o `pip install -r requirements.txt` de novo. Sem o `faiss`,
a API sobe, mas **toda pergunta falha** com "Nao foi possivel processar a consulta.".

### Passo 4. Criar e preencher o `.env`

```powershell
copy .env.example .env
```

macOS/Linux: `cp .env.example .env`.

O `.env.example` **já vem com os valores da turma**: para rodar localmente, não é preciso mudar nada.
O que cada grupo de variáveis faz:

| Variável | Valor padrão | Precisa mudar? |
| --- | --- | --- |
| `OLLAMA_URL` | `http://ecoa-llm.duckdns.org:11434/v1` | Não. É o endpoint de LLM e embeddings da turma. |
| `OLLAMA_API_KEY` | `ollama` | Não. |
| `GENERATION_MODEL` | `qcwind/qwen3-8b-instruct-Q4-K-M` | Não. |
| `EMBEDDING_MODEL` | `xagi/qwen3-embedding:0.6b-q4_k_m` | Não. Deve ser o mesmo modelo usado para montar os índices. |
| `GENERATION_TIMEOUT` | `180` | Não. Tempo máximo (s) de cada chamada ao LLM. |
| `RERANK_ENABLED` | `true` | Opcional. `false` pula o rerank: a primeira pergunta fica mais rápida e o modelo de 470 MB não é baixado. |
| `DATABASE_URL` | vazio | Não. Vazio = usa o SQLite versionado. Preencha só se tiver a connection string do Postgres (Neon) do projeto. |
| `CORS_ALLOW_ORIGINS` | `https://etuarda.github.io` | Não. `localhost:5173` e `127.0.0.1:5173` já são liberados por padrão. Acrescente outras origens separadas por vírgula, se precisar. |
| `OPENAI_*`, `CUSTOM_*` | vazios | Não. Só para usar outro provedor compatível com OpenAI. |
| `TESSERACT_CMD`, `OCR_*` | vazios/padrão | Não. OCR só é usado na coleta de PDFs escaneados. |

O `.env` é ignorado pelo Git: nunca faça commit dele, principalmente se você preencher o `DATABASE_URL`.

### Passo 5. Testar a conexão com o LLM da turma

```powershell
python llm_ecoa.py
```

O script chama o endpoint de geração e de embeddings. Se ele falhar, as perguntas também vão
falhar. Verifique a internet e o `OLLAMA_URL` antes de seguir.

### Passo 6. (Opcional) Rodar os testes do backend

```powershell
pytest tests/ -m "not llm"
```

São os testes offline (unitários e de contrato). Não precisam de internet.

### Passo 7. Subir a API

No **terminal 1**, com o `(.venv)` ativo e dentro da pasta do backend:

```powershell
uvicorn app.api:app --reload --host 127.0.0.1 --port 8080
```

Deixe esse terminal aberto. Quando aparecer `Uvicorn running on http://127.0.0.1:8080`, confira
em **outro terminal**:

```powershell
Invoke-RestMethod http://localhost:8080/health
```

A resposta esperada é `status: ok`. Para ver os dados reais já disponíveis:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/project/summary
```

Deve mostrar o corpus `v6` com 1.400 documentos. A documentação interativa da API fica em
`http://localhost:8080/docs`.

---

## Parte B: frontend

### Passo 8. Clonar o frontend e instalar

No **terminal 2**:

```powershell
cd $HOME
git clone https://github.com/Etuarda/frontendRAG.git
cd frontendRAG
npm install
```

### Passo 9. Conferir o endereço do backend

O frontend lê o endereço da API em `VITE_API_BASE_URL`. O arquivo `.env.development`, já
versionado, aponta para `http://localhost:8080`. **Se o backend está na porta 8080, não faça nada.**

Se você subiu o backend em outra porta, crie `.env.development.local` (não versionado) com o
endereço certo, por exemplo:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Passo 10. Subir o frontend

Ainda no terminal 2:

```powershell
npm run dev
```

Abra **http://localhost:5173**. Pela porta, o CORS do backend libera essa origem por padrão.

### Passo 11. Conferir a conexão

1. No rodapé da barra lateral deve aparecer **"Backend online"** (ponto verde). "Backend offline"
   significa que o frontend não alcança a API; veja a seção de problemas abaixo.
2. Abra **Contratações**: devem aparecer contratos reais (por exemplo, da Autarquia Municipal de
   Água e Esgoto de Cachoeiras de Macacu).
3. Abra **Transparência da IA**: deve mostrar o corpus `v6` e as quatro bases
   (`contratos_estruturado`, `editais_normativo`, `atas_conversacional`, `pca_agregado`).

O frontend não tem dados de exemplo: se algo aparece na tela, veio do backend.

---

## Parte C: fazer perguntas

### Passo 12. Pela interface

Na tela **Consulta**, digite a pergunta e pressione Enter. Perguntas que já funcionaram com a base atual:

- Quais contratos de material de limpeza foram assinados em 2025?
- Quais órgãos contrataram serviços de informática em 2025?
- O que estabelece a Lei 14.133/2021?
- Sou MEI, posso participar de pregão eletrônico?
- Quais contratos de ambulâncias foram publicados?

O que esperar:

- **A primeira pergunta depois de subir o backend é a mais lenta:** pode passar de 2 minutos,
  porque o modelo de rerank é baixado e carregado. As seguintes levam por volta de 30 a 45 segundos.
  O frontend espera até 4 minutos antes de desistir.
- Abaixo de cada resposta aparecem o nível de evidência, as fontes e "Esta resposta foi útil?".
  A avaliação é gravada no backend.
- Use o campo no rodapé para continuar perguntando na mesma tela. Cada pergunta é independente para
  o backend: ele não usa o contexto das anteriores.
- A página **Histórico** lista as consultas gravadas pelo backend, mesmo depois de recarregar a página.

### Passo 13. (Alternativa) Sem o frontend

Pelo terminal do backend, com o `(.venv)` ativo:

```powershell
python app/cli.py perguntar "Quais contratos de ambulâncias foram publicados?"
python app/cli.py rota "Sou MEI, posso participar de pregão eletrônico?"
```

`perguntar` roda o pipeline completo e imprime a resposta em JSON. `rota` mostra só quais bases o
roteador escolheria.

Ou direto na API (o `UTF8.GetBytes` evita problemas com acentos no PowerShell):

```powershell
$body = '{"query": "Quais contratos de material de limpeza foram assinados em 2025?", "top_k": 5}'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/v1/query `
  -ContentType 'application/json; charset=utf-8' `
  -Body ([Text.Encoding]::UTF8.GetBytes($body))
```

---

## Resumo da ordem de execução

```text
Terminal 1 (backend)                          Terminal 2 (frontend)
---------------------------------------       ---------------------------------------
1. git clone ...rag-grande-desafio...
2. python -m venv .venv + ativar
3. pip install -r requirements.txt
4. copy .env.example .env
5. python llm_ecoa.py
7. uvicorn app.api:app --reload `
     --host 127.0.0.1 --port 8080   ──────►   8. git clone ...frontendRAG + npm install
   (deixar rodando)                           10. npm run dev   (deixar rodando)
                                              11. abrir http://localhost:5173
                                              12. perguntar
```

Nas próximas vezes, basta: ativar o `.venv` e rodar o `uvicorn` no terminal 1, e `npm run dev` no terminal 2.

---

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Sidebar mostra "Backend offline" | API não está rodando, ou está em outra porta | Confira o terminal 1 e rode `Invoke-RestMethod http://localhost:8080/health`. Se a porta for outra, ajuste o `.env.development.local` (passo 9) e reinicie o `npm run dev`. |
| Toda pergunta mostra "Nao foi possivel processar a consulta." | Dependência faltando no Python que roda o `uvicorn` (geralmente `faiss`) | Com o `(.venv)` ativo: `pip install -r requirements.txt`, depois reinicie o `uvicorn`. Confira se o `uvicorn` foi iniciado de dentro do `.venv`. |
| "O servidor demorou demais para responder" | Primeira pergunta (download do rerank) ou LLM da turma lento | Aguarde e pergunte de novo. Para pular o rerank, use `RERANK_ENABLED=false` no `.env` e reinicie o `uvicorn`. |
| `python llm_ecoa.py` falha | Sem internet ou endpoint da turma fora do ar | Teste a conexão. Sem o endpoint, a API sobe e as páginas de Explorar funcionam, mas as perguntas não. |
| Erro de CORS no console do navegador | Frontend aberto em origem não liberada (ex.: IP da rede em vez de `localhost`) | Acesse por `http://localhost:5173` ou inclua a origem em `CORS_ALLOW_ORIGINS` no `.env` do backend. |
| `npm run dev`: "Port 5173 is already in use" | Já existe um frontend rodando | Use o que já está aberto ou encerre o outro terminal. |
| Ativação do `.venv` bloqueada no PowerShell | Política de execução de scripts | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (passo 2). |
| `FileNotFoundError: [WinError 3]` ao coletar o corpus | Caminho maior que 260 caracteres no Windows | Só afeta a coleta, não o uso local. Veja o README do backend para ativar caminhos longos. |

---

## Referências

- Contrato da API (fonte de verdade): `docs/FRONTEND_API_CONTRACT.md`, no repositório do backend.
- Como o frontend implementa o contrato: [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md).
- Coleta do corpus, curadoria e avaliação: `README.md` e `docs/CLI.md` do backend.
