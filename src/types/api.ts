// Tipos da API do backend NEXO, copiados do contrato oficial (FRONTEND_API_CONTRACT.md).
// Não acrescente campos aqui sem que o contrato mude primeiro.

export type EvidenceNature =
  | 'normativa'
  | 'estruturada'
  | 'conversacional'
  | 'agregada';

export type ConfidenceLevel = 'alta' | 'media' | 'baixa' | 'recusado';

export interface SourceRef {
  chunk_id: string;
  base_id: string;
  source_file: string;
}

export interface RagQueryRequest {
  query: string;
  top_k?: number;
}

export interface RagResponse {
  query_id: string;
  query: string;
  answer: string;
  bases_consultadas: EvidenceNature[];
  sources_used: SourceRef[];
  confidence_level: ConfidenceLevel;
  is_refusal: boolean;
  refusal_reason: string | null;
}

export interface FeedbackRequest {
  query_id: string;
  avaliacao: 'positivo' | 'negativo';
  comentario?: string | null;
}

export interface FeedbackEntry {
  avaliacao: 'positivo' | 'negativo';
  comentario: string | null;
  ts: string;
}

export interface HistoryItem {
  query_id: string;
  run_id: string;
  ts: string;
  query: string;
  resposta: Omit<RagResponse, 'query_id'>;
  feedback: FeedbackEntry[];
}

export interface ContratacaoRecord {
  id: string;
  numero_contrato: string;
  orgao: string | null;
  orgao_cnpj: string | null;
  fornecedor: string | null;
  objeto: string | null;
  valor_global: number | null;
  data_homologacao: string | null;
  modalidade: string | null;
  fonte_oficial: string;
  status: string | null;
  esfera: string | null;
  municipio: string | null;
}

export interface DocumentoRecord {
  id: string;
  titulo: string;
  tipo: string;
  orgao: string | null;
  ano: number | null;
  fonte: string | null;
  descricao: string | null;
  link: string | null;
  base_id: string;
  natureza: string;
  formato: string | null;
}

export interface OrgaoRecord {
  cnpj: string | null;
  sigla: string | null;
  nome: string;
  esfera: string | null;
  municipio: string | null;
  total_contratacoes: number;
  valor_total: number | null;
  principais_categorias: string[];
  principais_fornecedores: string[];
}

export interface OfficialSource {
  id: string;
  nome: string;
  sigla: string | null;
  instituicao: string | null;
  tipo_informacao: string | null;
  url: string | null;
  natureza: EvidenceNature;
  frequencia_coleta: string | null;
  descricao: string | null;
  escopo: string;
  formatos: string[];
}

export interface ProjectBaseSummary {
  base_id: string;
  natureza: string;
  escopo: string;
  status: string | null;
  documentos: number;
  formatos: Record<string, number>;
}

export interface ProjectSummary {
  projeto: string;
  scenario_id: string;
  descricao: string | null;
  versao_manifesto: string | null;
  versao_corpus: string;
  coletado_em: string | null;
  inventario_completo: boolean;
  total_documentos: number;
  total_itens: number;
  total_falhas: number;
  bases: ProjectBaseSummary[];
}

export interface HealthResponse {
  status: string;
}
