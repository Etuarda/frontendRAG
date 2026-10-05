import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';

interface SectionState {
  fontes: boolean;
  busca: boolean;
  respostas: boolean;
  seguranca: boolean;
  qualidade: boolean;
}

export function TransparenciaPage() {
  const [expanded, setExpanded] = useState<SectionState>({
    fontes: false,
    busca: false,
    respostas: false,
    seguranca: false,
    qualidade: false,
  });

  const toggleSection = (key: keyof SectionState) => {
    setExpanded((curr) => ({ ...curr, [key]: !curr[key] }));
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">ARQUITETURA & ÉTICA EM IA</span>
        <h1 className="page-title">Transparência da IA</h1>
        <p className="page-description">
          Entenda como o NEXO RJ busca evidências, sintetiza respostas e aplica critérios de
          segurança para garantir que as informações de contratações públicas sejam confiáveis,
          verificáveis e fundamentadas.
        </p>
      </header>

      <div className="transparency-sections-list">
        <section className="transparency-card">
          <div className="transparency-header">
            <div className="transparency-title-row">
              <Icon name="compass" size={20} />
              <h2>Fontes utilizadas</h2>
            </div>
            <p className="transparency-summary">
              O sistema se alimenta exclusivamente de repositórios governamentais auditáveis e
              públicos: PNCP (Portal Nacional de Contratações Públicas), SIGA-RJ (Compras do Estado do
              Rio de Janeiro), Diário Oficial do Estado (DOERJ) e o Portal de Dados Abertos RJ.
            </p>
          </div>

          <button
            type="button"
            className="btn-toggle-tech"
            onClick={() => toggleSection('fontes')}
            aria-expanded={expanded.fontes}
          >
            <span>{expanded.fontes ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            <Icon name={expanded.fontes ? 'chevron-down' : 'chevron-right'} size={15} />
          </button>

          {expanded.fontes ? (
            <div className="tech-details-content">
              <div className="tech-topic">
                <h3>Divisão por Natureza da Evidência</h3>
                <p>
                  O corpus é particionado em quatro categorias primárias:
                  <br />• <strong>Normativa:</strong> Leis federais (ex.: 14.133/2021) e decretos fluminenses.
                  <br />• <strong>Estruturada:</strong> Contratos, editais e termos cadastrados com valores e datas.
                  <br />• <strong>Conversacional:</strong> Atas de sessões de pregão com ocorrências e impugnações.
                  <br />• <strong>Agregada:</strong> Indicadores consolidados e planos de compras (PCA).
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="transparency-card">
          <div className="transparency-header">
            <div className="transparency-title-row">
              <Icon name="search" size={20} />
              <h2>Como buscamos documentos</h2>
            </div>
            <p className="transparency-summary">
              O NEXO combina diferentes estratégias de busca para encontrar evidências relevantes no
              acervo, assegurando que tanto termos literais (como números de contratos ou nomes de
              empresas) quanto conceitos semânticos amplos sejam localizados com precisão.
            </p>
          </div>

          <button
            type="button"
            className="btn-toggle-tech"
            onClick={() => toggleSection('busca')}
            aria-expanded={expanded.busca}
          >
            <span>{expanded.busca ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            <Icon name={expanded.busca ? 'chevron-down' : 'chevron-right'} size={15} />
          </button>

          {expanded.busca ? (
            <div className="tech-details-content">
              <div className="tech-topic-grid">
                <div className="tech-box">
                  <h4>Busca Vetorial (Semântica)</h4>
                  <p>
                    Utiliza modelos de embedding para capturar o significado profundo da pergunta,
                    encontrando trechos relevantes mesmo quando não há palavras exatamente iguais.
                  </p>
                </div>
                <div className="tech-box">
                  <h4>Busca Lexical (BM25)</h4>
                  <p>
                    Recupera de maneira exata termos técnicos, números de leis, siglas de secretarias e
                    CNPJs de fornecedores por contagem e ponderação de frequência.
                  </p>
                </div>
                <div className="tech-box">
                  <h4>Fusão por Ranqueamento (RRF)</h4>
                  <p>
                    Reciprocal Rank Fusion unifica as listas da busca vetorial e da busca lexical,
                    garantindo que os trechos mais bem colocados em ambas subam ao topo.
                  </p>
                </div>
                <div className="tech-box">
                  <h4>Reordenação Semântica (Rerank)</h4>
                  <p>
                    Um modelo neural cross-encoder (BGE Reranker) reavalia os trechos finais e seleciona
                    apenas aqueles com a maior pontuação de evidência direta.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="transparency-card">
          <div className="transparency-header">
            <div className="transparency-title-row">
              <Icon name="cpu" size={20} />
              <h2>Como as respostas são geradas</h2>
            </div>
            <p className="transparency-summary">
              O modelo de linguagem recebe estritamente os trechos de documentos comprovadamente
              recuperados pelo pipeline. Ele é instruído a responder exclusivamente com base nas
              evidências apresentadas, citando as fontes de apoio e recusando alucinações.
            </p>
          </div>

          <button
            type="button"
            className="btn-toggle-tech"
            onClick={() => toggleSection('respostas')}
            aria-expanded={expanded.respostas}
          >
            <span>{expanded.respostas ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            <Icon name={expanded.respostas ? 'chevron-down' : 'chevron-right'} size={15} />
          </button>

          {expanded.respostas ? (
            <div className="tech-details-content">
              <div className="tech-topic">
                <h3>Síntese Fundamentada (Grounding)</h3>
                <p>
                  A geração segue a metodologia RAG (Retrieval-Augmented Generation). O modelo atua
                  como um sintetizador imparcial das evidências, estruturando a resposta com linguagem
                  clara e parágrafos objetivos, acompanhado do número de referência de cada fonte.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="transparency-card">
          <div className="transparency-header">
            <div className="transparency-title-row">
              <Icon name="shield" size={20} />
              <h2>Segurança e limites</h2>
            </div>
            <p className="transparency-summary">
              O sistema conta com proteções para não emitir juízos de valor subjetivos (como conclusões
              de fraude que dependem do Judiciário), proteger dados sensíveis de agentes públicos e
              recusar perguntas fora do escopo de contratações fluminenses.
            </p>
          </div>

          <button
            type="button"
            className="btn-toggle-tech"
            onClick={() => toggleSection('seguranca')}
            aria-expanded={expanded.seguranca}
          >
            <span>{expanded.seguranca ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            <Icon name={expanded.seguranca ? 'chevron-down' : 'chevron-right'} size={15} />
          </button>

          {expanded.seguranca ? (
            <div className="tech-details-content">
              <div className="tech-topic">
                <h3>Políticas de Mitigação de Risco</h3>
                <p>
                  • Anonimização e bloqueio de dados bancários pessoais e chaves de acesso.
                  <br />• Recusa explícita e humanizada em caso de evidências insuficientes.
                  <br />• Proibição de juízo definitivo de ilegalidade sem decisão administrativa prévia
                  anexada aos autos.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="transparency-card">
          <div className="transparency-header">
            <div className="transparency-title-row">
              <Icon name="check" size={20} />
              <h2>Qualidade das respostas</h2>
            </div>
            <p className="transparency-summary">
              O acervo e as respostas passam por validação contínua de fidelidade factual (Faithfulness),
              relevância da resposta (Answer Relevancy) e precisão de contexto (Context Precision), além
              do feedback fornecido pelos próprios usuários na interface.
            </p>
          </div>

          <button
            type="button"
            className="btn-toggle-tech"
            onClick={() => toggleSection('qualidade')}
            aria-expanded={expanded.qualidade}
          >
            <span>{expanded.qualidade ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}</span>
            <Icon name={expanded.qualidade ? 'chevron-down' : 'chevron-right'} size={15} />
          </button>

          {expanded.qualidade ? (
            <div className="tech-details-content">
              <div className="tech-topic">
                <h3>Métricas de Avaliação com Golden Set</h3>
                <p>
                  O pipeline é benchmarkado contra um conjunto de perguntas reais formuladas por
                  auditores, pregoeiros e jornalistas, atingindo índice de fidelidade factual superior a
                  92% no acervo oficial.
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
