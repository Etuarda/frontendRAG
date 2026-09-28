import type { RagResponse } from '../domain/rag/types';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function mockQuery(query: string): Promise<RagResponse> {
  await wait(1200);
  const normalized = query.toLocaleLowerCase('pt-BR');

  if (normalized.includes('fraud') || normalized.includes('ilegal')) {
    return {
      query,
      answer:
        'Os documentos recuperados podem ser apresentados para análise humana, mas o sistema não conclui, por conta própria, que um fornecedor cometeu fraude ou agiu ilegalmente.',
      bases_consultadas: [],
      sources_used: [],
      confidence_level: 'recusado',
      is_refusal: true,
      refusal_reason: 'juizo_legalidade_contrato',
    };
  }

  return {
    query,
    answer:
      'Resposta simulada para validação da interface. Na integração real, o conteúdo é produzido pelo pipeline Adaptive RAG a partir das evidências recuperadas no corpus de contratações públicas do Rio de Janeiro.',
    bases_consultadas: normalized.includes('regra') || normalized.includes('microempresa')
      ? ['normativa', 'estruturada']
      : ['estruturada', 'agregada'],
    sources_used: [
      {
        chunk_id: 'mock_chunk_001',
        base_id: 'contratos_estruturado',
        source_file: 'pncp_contratacoes_2025.json',
      },
      {
        chunk_id: 'mock_chunk_002',
        base_id: 'normas_contratacoes',
        source_file: 'lei_14133_2021.pdf',
      },
    ],
    confidence_level: 'alta',
    is_refusal: false,
    refusal_reason: null,
  };
}
