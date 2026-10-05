export type AppView =
  | 'consulta'
  | 'historico'
  | 'contratacoes'
  | 'documentos'
  | 'orgaos'
  | 'fontes'
  | 'como-funciona'
  | 'transparencia'
  | 'sobre';

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
  trecho?: string;
  score?: number;
  orgao?: string;
  data?: string;
  modalidade?: string;
  url?: string;
}

export interface PipelineMetadata {
  run_id?: string;
  query_id?: string;
  latency_ms?: number;
  tokens?: number;
  model?: string;
  strategy?: string;
  reranker?: string;
  score_top1?: number;
  total_chunks_retrieved?: number;
}

export interface RagResponse {
  query: string;
  answer: string;
  bases_consultadas: EvidenceNature[];
  sources_used: SourceRef[];
  confidence_level: ConfidenceLevel;
  is_refusal: boolean;
  refusal_reason?: RefusalReason | null;
  pipeline_metadata?: PipelineMetadata;
}

export interface RagQueryRequest {
  query: string;
  top_k?: number;
  fonte_filter?: string;
  search_strategy?: 'automatica' | 'hibrida' | 'normativa';
  /** Identifica a conversa para o backend agrupar as perguntas. */
  conversation_id?: string;
  /** Turnos anteriores, para o backend entender perguntas de acompanhamento ("e em 2024?"). */
  history?: { query: string; answer: string }[];
}

/** Uma pergunta e sua resposta dentro de uma conversa. */
export interface ConversationTurn {
  id: string;
  query: string;
  response: RagResponse;
  created_at: string;
  /** Avaliação do usuário; guardada para não pedir de novo ao reabrir a conversa. */
  feedback?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  turns: ConversationTurn[];
}

export interface FeedbackPayload {
  query_id?: string;
  query: string;
  useful: boolean;
  comment?: string;
  created_at?: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  answer_summary: string;
  created_at: string;
  confidence_level: ConfidenceLevel;
  sources_count: number;
  sources_used: SourceRef[];
  full_response?: RagResponse;
}

export interface ContratacaoRecord {
  id: string;
  numero_contrato: string;
  orgao: string;
  fornecedor: string;
  objeto: string;
  valor_global: number;
  data_homologacao: string;
  modalidade: string;
  fonte_oficial: string;
  status: 'Vigente' | 'Encerrado' | 'Em execução';
}

export interface DocumentoRecord {
  id: string;
  titulo: string;
  tipo: 'Edital' | 'Contrato' | 'Ata de Registro' | 'PCA' | 'Normativo';
  orgao: string;
  ano: number;
  fonte: string;
  descricao: string;
  link?: string;
}

export interface OrgaoRecord {
  sigla: string;
  nome: string;
  esfera: string;
  total_contratacoes: number;
  valor_total_estimado: string;
  principais_categorias: string[];
  principais_fornecedores: string[];
}

export interface OfficialSource {
  id: string;
  nome: string;
  sigla: string;
  instituicao: string;
  tipoInformacao: string;
  url: string;
  natureza: EvidenceNature;
  frequenciaColeta?: string;
  descricao: string;
}

export type ApiHealthStatus = 'checking' | 'online' | 'offline';
