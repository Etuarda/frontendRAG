import type {
  ConfidenceLevel,
  CorpusBaseInfo,
  CorpusDocumentInfo,
  CurationManifest,
  EvaluationMetrics,
  EvidenceNature,
  ExecutionTrace,
  GoldenSetQuestion,
  ObservabilitySummary,
  OfficialSource,
  PipelineConfig,
  RefusalReason,
  SensitivityRule,
} from './types';

export interface KnowledgeBaseDefinition {
  id: EvidenceNature;
  name: string;
  shortName: string;
  description: string;
  examples: string;
  icon: 'book-open' | 'database' | 'file-text' | 'layers';
}

export const KNOWLEDGE_BASES: KnowledgeBaseDefinition[] = [
  {
    id: 'normativa',
    name: 'Base Normativa',
    shortName: 'Normativa',
    description: 'Leis, normas, editais e documentos que sustentam requisitos e vigência.',
    examples: 'Legislação, editais e regras aplicáveis',
    icon: 'book-open',
  },
  {
    id: 'estruturada',
    name: 'Base Estruturada',
    shortName: 'Estruturada',
    description: 'Registros de contratações públicas organizados para filtros e comparações.',
    examples: 'Órgãos, fornecedores, modalidades e valores',
    icon: 'database',
  },
  {
    id: 'conversacional',
    name: 'Base Conversacional',
    shortName: 'Conversacional',
    description: 'Atas e registros textuais usados para recuperar ocorrências e contexto.',
    examples: 'Atas, ocorrências e registros descritivos',
    icon: 'file-text',
  },
  {
    id: 'agregada',
    name: 'Base Agregada',
    shortName: 'Agregada',
    description: 'Indicadores consolidados para análises comparativas e padrões de contratação.',
    examples: 'Médias, medianas, frequência e concentração',
    icon: 'layers',
  },
];

export interface SuggestedQueryItem {
  category: string;
  query: string;
}

export const SUGGESTED_QUERIES: SuggestedQueryItem[] = [
  {
    category: 'Maiores contratações',
    query: 'Quais foram as maiores contratações do RJ em 2025?',
  },
  {
    category: 'Contratações por órgão',
    query: 'Quais órgãos contrataram serviços de manutenção de computadores?',
  },
  {
    category: 'Regras de contratação',
    query: 'Qual regra estava vigente para pesquisa de preços em 2025?',
  },
  {
    category: 'Participação de empresas',
    query: 'Uma microempresa pode participar deste tipo de contratação?',
  },
  {
    category: 'Pesquisa por fornecedor',
    query: 'Quais contratos estão associados a determinado fornecedor?',
  },
];

export const REFUSAL_LABELS: Record<RefusalReason, string> = {
  dados_bancarios_fornecedor:
    'Esta consulta envolve dados bancários ou informações financeiras protegidas de terceiros.',
  credenciais_vazadas:
    'Esta consulta envolve credenciais de acesso ou informações sob sigilo restrito.',
  juizo_legalidade_contrato:
    'Não é possível emitir juízo definitivo de fraude ou ilegalidade sem decisão administrativa ou judicial prévia.',
  fora_de_escopo:
    'O assunto consultado não se encontra no âmbito das contratações públicas do Estado do Rio de Janeiro.',
  sem_evidencia:
    'As fontes disponíveis não fornecem evidências suficientes para responder esta pergunta com segurança.',
};

export const EVIDENCE_LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  alta: 'Alto',
  media: 'Moderado',
  baixa: 'Baixo',
  recusado: 'Não avaliado',
};

export const CONFIDENCE_LABELS = EVIDENCE_LEVEL_LABELS;

export const LOADING_STEPS = [
  'Analisando intenção e extraindo filtros da pergunta...',
  'Selecionando as naturezas de evidência pelo roteador adaptativo...',
  'Executando recuperação híbrida por embeddings e BM25...',
  'Fundindo os resultados com Reciprocal Rank Fusion (RRF)...',
  'Sintetizando a resposta e validando evidências disponíveis...',
] as const;

/* Catálogo de Corpus */
export const MOCK_CORPUS_BASES: CorpusBaseInfo[] = [
  {
    id: 'editais_normativo',
    natureza: 'normativa',
    totalArquivos: 42,
    totalChunks: 1250,
    status: 'sincronizado',
    ultimaColeta: '2026-09-26 18:30',
  },
  {
    id: 'contratos_estruturado',
    natureza: 'estruturada',
    totalArquivos: 180,
    totalChunks: 3420,
    status: 'sincronizado',
    ultimaColeta: '2026-09-27 10:15',
  },
  {
    id: 'atas_conversacional',
    natureza: 'conversacional',
    totalArquivos: 90,
    totalChunks: 2110,
    status: 'sincronizado',
    ultimaColeta: '2026-09-25 14:00',
  },
  {
    id: 'pca_agregado',
    natureza: 'agregada',
    totalArquivos: 16,
    totalChunks: 480,
    status: 'sincronizado',
    ultimaColeta: '2026-09-27 08:00',
  },
];

export const MOCK_CORPUS_DOCS: CorpusDocumentInfo[] = [
  {
    id: 'DOC-RJ-001',
    nome: 'Edital_Pregao_Eletronico_014_2025_SECTRAN.pdf',
    base: 'normativa',
    formato: 'PDF',
    tamanhoKb: 1420,
    dataIndexacao: '2026-09-26',
  },
  {
    id: 'DOC-RJ-002',
    nome: 'Contratos_TI_Software_Saude_2025.json',
    base: 'estruturada',
    formato: 'JSON',
    tamanhoKb: 890,
    dataIndexacao: '2026-09-27',
  },
  {
    id: 'DOC-RJ-003',
    nome: 'Ata_Registro_Precos_Ambulancias_040_2025.pdf',
    base: 'conversacional',
    formato: 'PDF',
    tamanhoKb: 2100,
    dataIndexacao: '2026-09-25',
  },
  {
    id: 'DOC-RJ-004',
    nome: 'Indicadores_PCA_2025_Consolidado.csv',
    base: 'agregada',
    formato: 'CSV',
    tamanhoKb: 450,
    dataIndexacao: '2026-09-27',
  },
];

/* Catálogo de Fontes Oficiais */
export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: 'pncp',
    nome: 'Portal Nacional de Contratações Públicas',
    sigla: 'PNCP',
    instituicao: 'Governo Federal / Ministério da Gestão e da Inovação',
    tipoInformacao: 'Editais, avisos de contratação direta e contratos administrativos',
    url: 'https://pncp.gov.br',
    natureza: 'estruturada',
    frequenciaColeta: 'Diária',
    descricao:
      'Repositório nacional oficial instituído pela Lei nº 14.133/2021 para divulgação centralizada dos atos de contratação pública de todos os entes federativos.',
  },
  {
    id: 'siga-rj',
    nome: 'Sistema Integrado de Gestão de Aquisições do RJ',
    sigla: 'SIGA-RJ',
    instituicao: 'Governo do Estado do Rio de Janeiro / SEPLAG-RJ',
    tipoInformacao: 'Pregões eletrônicos, atas de registro de preços e catálogo de itens',
    url: 'https://www.compras.rj.gov.br',
    natureza: 'estruturada',
    frequenciaColeta: 'Semanal',
    descricao:
      'Canal oficial estadual de compras públicas do Rio de Janeiro, contendo editais, atas de sessões públicas e cadastro de fornecedores.',
  },
  {
    id: 'doerj',
    nome: 'Diário Oficial do Estado do Rio de Janeiro',
    sigla: 'DOERJ',
    instituicao: 'Imprensa Oficial do Estado do Rio de Janeiro (IOERJ)',
    tipoInformacao: 'Atos normativos, decretos regulamentares e homologações de licitações',
    url: 'https://www.ioerj.com.br',
    natureza: 'normativa',
    frequenciaColeta: 'Diária',
    descricao:
      'Veículo oficial de publicação dos atos governamentais, decretos de regulamentação da Lei nº 14.133/2021 e extratos contratuais no âmbito do Estado do RJ.',
  },
  {
    id: 'dados-abertos-rj',
    nome: 'Portal de Dados Abertos do Estado do RJ',
    sigla: 'DADOS-RJ',
    instituicao: 'Controladoria Geral do Estado (CGE-RJ) e SEPLAG-RJ',
    tipoInformacao: 'Execução orçamentária, pagamentos a fornecedores e planos anuais de contratações',
    url: 'https://dados.rj.gov.br',
    natureza: 'agregada',
    frequenciaColeta: 'Mensal',
    descricao:
      'Conjuntos de dados abertos para transparência pública, permitindo conferência e cruzamento de empenhos, liquidações e contratos vigentes.',
  },
];

/* Curadoria e Sensibilidade */
export const MOCK_CURATION_MANIFEST: CurationManifest = {
  versao: 'v1.4.2',
  totalDocumentos: 328,
  totalChunksValidos: 7260,
  regrasAplicadas: 18,
  piiBloqueados: 94,
  ultimaAuditoria: '2026-09-27 19:40',
};

export const SENSITIVITY_RULES: SensitivityRule[] = [
  {
    id: 'RULE-01',
    nome: 'Bloqueio de Dados Bancários de Fornecedores',
    categoria: 'Dados Bancários',
    acao: 'bloquear_consulta',
    status: 'ativo',
  },
  {
    id: 'RULE-02',
    nome: 'Detecção e Anonimização de CPF/RG de Agentes Públicos',
    categoria: 'PII',
    acao: 'anonimizar',
    status: 'ativo',
  },
  {
    id: 'RULE-03',
    nome: 'Proteção contra Vazamento de Senhas e Chaves de API',
    categoria: 'Segredos',
    acao: 'descartar_chunk',
    status: 'ativo',
  },
  {
    id: 'RULE-04',
    nome: 'Prevenção de Juízo de Legalidade ou Conclusão de Fraude',
    categoria: 'Limites Legais',
    acao: 'bloquear_consulta',
    status: 'ativo',
  },
];

/* Configuração do Pipeline */
export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  chunkSize: 512,
  overlap: 64,
  embeddingProvider: 'text-embedding-3-small',
  rerankerModel: 'bge-reranker-large',
  topK: 5,
};

/* Avaliação / Golden Set */
export const MOCK_EVAL_METRICS: EvaluationMetrics = {
  totalPerguntas: 18,
  faithfulnessScore: 0.94,
  answerRelevancyScore: 0.91,
  contextPrecisionScore: 0.88,
  hitRateTop3: 0.96,
  dataAvaliacao: '2026-09-27',
};

export const MOCK_GOLDEN_SET: GoldenSetQuestion[] = [
  {
    id: 'GS-01',
    pergunta: 'Quais contratações de tecnologia acima de R$ 500 mil foram realizadas em 2025?',
    persona: 'Auditor de Controle Externo',
    rotaEsperada: 'estruturada',
    status: 'aprovado',
    confianca: 'alta',
  },
  {
    id: 'GS-02',
    pergunta: 'Qual o teto regulamentar para dispensa de licitação de obras no RJ?',
    persona: 'Pregoeiro da SEPLAG',
    rotaEsperada: 'normativa',
    status: 'aprovado',
    confianca: 'alta',
  },
  {
    id: 'GS-03',
    pergunta: 'Qual a mediana de preço unitário por km rodado nas atas de locação de ambulâncias?',
    persona: 'Jornalista de Dados',
    rotaEsperada: 'agregada',
    status: 'aprovado',
    confianca: 'alta',
  },
  {
    id: 'GS-04',
    pergunta: 'Quais incidentes e impugnações foram registrados na ata da licitação de segurança?',
    persona: 'Cidadão / Pesquisador',
    rotaEsperada: 'conversacional',
    status: 'aprovado',
    confianca: 'media',
  },
];

/* Observabilidade */
export const MOCK_OBS_SUMMARY: ObservabilitySummary = {
  totalExecucoes: 142,
  latenciaMediaMs: 840,
  tokensConsumidosTotal: 184500,
  taxaSucesso: 0.978,
};

export const MOCK_EXECUTION_TRACES: ExecutionTrace[] = [
  {
    runId: 'run-8b2f90a1',
    queryId: 'qry-19402',
    timestamp: '27/09/2026 22:45:10',
    status: 'sucesso',
    tempoTotalMs: 780,
    tokensTotal: 1240,
    modelo: 'gemini-1.5-flash',
    basesConsultadas: ['estruturada', 'normativa'],
  },
  {
    runId: 'run-7a1e48bc',
    queryId: 'qry-19401',
    timestamp: '27/09/2026 22:38:22',
    status: 'sucesso',
    tempoTotalMs: 910,
    tokensTotal: 1480,
    modelo: 'gemini-1.5-flash',
    basesConsultadas: ['conversacional'],
  },
  {
    runId: 'run-6c0b32df',
    queryId: 'qry-19400',
    timestamp: '27/09/2026 22:20:05',
    status: 'recusa',
    tempoTotalMs: 310,
    tokensTotal: 410,
    modelo: 'gemini-1.5-flash',
    basesConsultadas: ['normativa'],
  },
];
