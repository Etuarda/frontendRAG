export type EvidenceNature = 'normativa' | 'estruturada' | 'conversacional' | 'agregada';

export type ConfidenceLevel = 'alta' | 'media' | 'baixa' | 'recusado';

export type RefusalReason =
  | 'dados_bancarios_fornecedor'
  | 'credenciais_vazadas'
  | 'juizo_legalidade_contrato'
  | 'fora_de_escopo'
  | 'sem_evidencia';

export interface SourceRef {
  chunk_id: string;
  base_id: string;
  source_file: string;
}

export interface RagResponse {
  query: string;
  answer: string;
  bases_consultadas: EvidenceNature[];
  sources_used: SourceRef[];
  confidence_level: ConfidenceLevel;
  is_refusal: boolean;
  refusal_reason: RefusalReason | null;
}

export interface RagQueryRequest {
  query: string;
  top_k?: number;
}

export interface SessionEntry {
  id: string;
  createdAt: Date;
  response: RagResponse;
}

export type ApiHealthStatus = 'checking' | 'online' | 'offline';

export type AppView =
  | 'consulta'
  | 'historico'
  | 'corpus'
  | 'fontes'
  | 'curadoria'
  | 'pipeline'
  | 'avaliacao'
  | 'observabilidade';

/* Modelos do Corpus */
export interface CorpusBaseInfo {
  id: string;
  natureza: EvidenceNature;
  totalArquivos: number;
  totalChunks: number;
  status: 'sincronizado' | 'atualizando' | 'pendente';
  ultimaColeta: string;
}

export interface CorpusDocumentInfo {
  id: string;
  nome: string;
  base: EvidenceNature;
  formato: 'PDF' | 'JSON' | 'CSV' | 'HTML';
  tamanhoKb: number;
  dataIndexacao: string;
}

/* Modelos de Fontes Oficiais */
export interface OfficialSource {
  id: string;
  nome: string;
  sigla: string;
  url: string;
  natureza: EvidenceNature;
  frequenciaColeta: string;
  descricao: string;
}

/* Modelos de Curadoria e Sensibilidade */
export interface CurationManifest {
  versao: string;
  totalDocumentos: number;
  totalChunksValidos: number;
  regrasAplicadas: number;
  piiBloqueados: number;
  ultimaAuditoria: string;
}

export interface SensitivityRule {
  id: string;
  nome: string;
  categoria: 'PII' | 'Dados Bancários' | 'Segredos' | 'Limites Legais';
  acao: 'anonimizar' | 'bloquear_consulta' | 'descartar_chunk';
  status: 'ativo' | 'inativo';
}

/* Modelos de Pipeline */
export interface PipelineConfig {
  chunkSize: number;
  overlap: number;
  embeddingProvider: string;
  rerankerModel: string;
  topK: number;
}

export interface PipelineExecutionResult {
  jobId: string;
  status: 'sucesso' | 'em_progresso' | 'erro';
  etapaAtual: string;
  documentosProcessados: number;
  duracaoSegundos: number;
  mensagens: string[];
}

/* Modelos de Avaliação */
export interface EvaluationMetrics {
  totalPerguntas: number;
  faithfulnessScore: number;
  answerRelevancyScore: number;
  contextPrecisionScore: number;
  hitRateTop3: number;
  dataAvaliacao: string;
}

export interface GoldenSetQuestion {
  id: string;
  pergunta: string;
  persona: string;
  rotaEsperada: EvidenceNature;
  status: 'aprovado' | 'atencao' | 'falha';
  confianca: ConfidenceLevel;
}

/* Modelos de Observabilidade */
export interface ObservabilitySummary {
  totalExecucoes: number;
  latenciaMediaMs: number;
  tokensConsumidosTotal: number;
  taxaSucesso: number;
}

export interface ExecutionTrace {
  runId: string;
  queryId: string;
  timestamp: string;
  status: 'sucesso' | 'recusa' | 'erro';
  tempoTotalMs: number;
  tokensTotal: number;
  modelo: string;
  basesConsultadas: EvidenceNature[];
}
