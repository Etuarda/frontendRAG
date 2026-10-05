import type {
  ConfidenceLevel,
  ContratacaoRecord,
  DocumentoRecord,
  OfficialSource,
  OrgaoRecord,
  RefusalReason,
} from '../types';

export interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  category: string;
  query: string;
  actionView?: 'contratacoes' | 'documentos' | 'orgaos' | 'fontes';
}

export const ATALHOS_INICIAIS: ShortcutItem[] = [
  {
    id: 'sc-contratacoes',
    title: 'Explorar contratações',
    description: 'Valores, empresas contratadas e maiores instrumentos vigentes',
    category: 'Contratações',
    query: 'Quais foram as maiores contratações do Estado do Rio de Janeiro em 2025?',
    actionView: 'contratacoes',
  },
  {
    id: 'sc-documentos',
    title: 'Pesquisar documentos',
    description: 'Editais homologados, termos de referência, atas e PCA',
    category: 'Documentos',
    query: 'Quais editais e termos de referência de TI foram publicados recentemente?',
    actionView: 'documentos',
  },
  {
    id: 'sc-orgaos',
    title: 'Consultar um órgão',
    description: 'Histórico de compras e gastos por secretaria e autarquia',
    category: 'Órgãos',
    query: 'Quais órgãos estaduais contrataram serviços de manutenção de computadores?',
    actionView: 'orgaos',
  },
  {
    id: 'sc-fontes',
    title: 'Explorar fontes oficiais',
    description: 'PNCP, SIGA-RJ, Diário Oficial e Portais Governamentais',
    category: 'Fontes Oficiais',
    query: 'Quais são as fontes oficiais utilizadas pelo NEXO para conferência?',
    actionView: 'fontes',
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
  alta: 'Evidência Alta',
  media: 'Evidência Moderada',
  baixa: 'Evidência Baixa',
  recusado: 'Evidência Insuficiente',
};

/* --------------------------------------------------------------------------
   Catálogo de Contratações no Acervo Oficial RJ (Exercício 2025)
   -------------------------------------------------------------------------- */
export const CONTRATACOES_MOCK: ContratacaoRecord[] = [
  {
    id: 'CT-SES-2025-084',
    numero_contrato: 'Contrato nº 084/2025',
    orgao: 'Secretaria de Estado de Saúde (SES-RJ)',
    fornecedor: 'Instituto de Gestão e Saúde Integrada do Brasil',
    objeto: 'Gestão integrada de unidades de pronto atendimento hospitalar e suporte de urgência na Baixada Fluminense.',
    valor_global: 142800000.0,
    data_homologacao: '14/01/2025',
    modalidade: 'Pregão Eletrônico',
    fonte_oficial: 'PNCP / SIGA-RJ',
    status: 'Vigente',
  },
  {
    id: 'CT-SECTRAN-2025-019',
    numero_contrato: 'Contrato nº 019/2025',
    orgao: 'Secretaria de Estado de Transporte e Mobilidade Urbana (SECTRAN)',
    fornecedor: 'Consórcio Fluminense de Infraestrutura Viária',
    objeto: 'Manutenção corretiva e preventiva de malha viária estadual e recuperação de pavimento com pavimentação asfáltica.',
    valor_global: 98450000.0,
    data_homologacao: '03/02/2025',
    modalidade: 'Concorrência Eletrônica',
    fonte_oficial: 'PNCP',
    status: 'Vigente',
  },
  {
    id: 'CT-SEEDUC-2025-102',
    numero_contrato: 'Contrato nº 102/2025',
    orgao: 'Secretaria de Estado de Educação (SEEDUC)',
    fornecedor: 'Distribuidora Rio Alimentos e Logística Ltda.',
    objeto: 'Fornecimento continuado de gêneros alimentícios e insumos para merenda escolar regional em 320 colégios da rede estadual.',
    valor_global: 67200000.0,
    data_homologacao: '22/01/2025',
    modalidade: 'Pregão Eletrônico',
    fonte_oficial: 'SIGA-RJ',
    status: 'Vigente',
  },
  {
    id: 'CT-FS-2025-031',
    numero_contrato: 'Ata de Registro de Preços nº 031/2025',
    orgao: 'Fundação Saúde do Estado do Rio de Janeiro',
    fornecedor: 'MedSupply Insumos Hospitalares S/A',
    objeto: 'Aquisição programada de órteses, próteses e materiais especiais (OPME) cirúrgicos de alta complexidade.',
    valor_global: 54120000.0,
    data_homologacao: '19/02/2025',
    modalidade: 'Registro de Preços',
    fonte_oficial: 'PNCP / SIGA-RJ',
    status: 'Vigente',
  },
  {
    id: 'CT-SEFAZ-2025-008',
    numero_contrato: 'Contrato nº 008/2025',
    orgao: 'Secretaria de Estado de Fazenda (SEFAZ-RJ)',
    fornecedor: 'TechServ Tecnologia e Sustentação de Sistemas Ltda.',
    objeto: 'Prestação de serviços contínuos de suporte, manutenção preventiva e corretiva com reposição de peças para microcomputadores e servidores.',
    valor_global: 2450000.0,
    data_homologacao: '11/03/2025',
    modalidade: 'Pregão Eletrônico',
    fonte_oficial: 'SIGA-RJ',
    status: 'Vigente',
  },
  {
    id: 'CT-UERJ-2025-045',
    numero_contrato: 'Contrato nº 045/2025',
    orgao: 'Universidade do Estado do Rio de Janeiro (UERJ)',
    fornecedor: 'InfoRedes Serviços e Conectividade Eireli',
    objeto: 'Suporte técnico a parques de microcomputadores, laboratórios acadêmicos e conectividade dos campi regionais.',
    valor_global: 1180000.0,
    data_homologacao: '05/03/2025',
    modalidade: 'Pregão Eletrônico',
    fonte_oficial: 'PNCP',
    status: 'Em execução',
  },
];

/* --------------------------------------------------------------------------
   Catálogo de Documentos Oficiais no Acervo
   -------------------------------------------------------------------------- */
export const DOCUMENTOS_MOCK: DocumentoRecord[] = [
  {
    id: 'DOC-01',
    titulo: 'Edital do Pregão Eletrônico nº 008/2025 — Suporte de TI',
    tipo: 'Edital',
    orgao: 'SEFAZ-RJ',
    ano: 2025,
    fonte: 'SIGA-RJ',
    descricao: 'Especificações técnicas, termo de referência e exigências de habilitação para contratação de suporte a microcomputadores.',
  },
  {
    id: 'DOC-02',
    titulo: 'Contrato nº 084/2025 — Gestão Integrada de Saúde Hospitalar',
    tipo: 'Contrato',
    orgao: 'SES-RJ',
    ano: 2025,
    fonte: 'PNCP',
    descricao: 'Instrumento contratual bilateral com metas de atendimento, cronograma de repasses e matriz de risco em UPAs.',
  },
  {
    id: 'DOC-03',
    titulo: 'Ata de Registro de Preços nº 031/2025 — Materiais Cirúrgicos OPME',
    tipo: 'Ata de Registro',
    orgao: 'Fundação Saúde RJ',
    ano: 2025,
    fonte: 'PNCP / SIGA-RJ',
    descricao: 'Ata de homologação de preços com cotação unitária e compromisso de fornecimento sob demanda para hospitais estaduais.',
  },
  {
    id: 'DOC-04',
    titulo: 'Plano de Contratações Anual (PCA) Consolidado — Exercício 2025',
    tipo: 'PCA',
    orgao: 'SEPLAG-RJ (Governo do Estado)',
    ano: 2025,
    fonte: 'Portal de Dados Abertos RJ',
    descricao: 'Planejamento orçamentário anual de compras de bens e serviços de todos os órgãos da administração pública estadual.',
  },
  {
    id: 'DOC-05',
    titulo: 'Decreto Estadual de Regulamentação da Pesquisa de Preços (Lei 14.133/21)',
    tipo: 'Normativo',
    orgao: 'Governo do Estado do Rio de Janeiro',
    ano: 2024,
    fonte: 'DOERJ',
    descricao: 'Parâmetros normativos para apuração de preço médio estimado, consulta ao PNCP e notas fiscais governamentais.',
  },
  {
    id: 'DOC-06',
    titulo: 'Edital Padrão de Pregão Eletrônico com Cláusula ME/EPP',
    tipo: 'Edital',
    orgao: 'CGE-RJ / SEPLAG-RJ',
    ano: 2025,
    fonte: 'SIGA-RJ',
    descricao: 'Modelo de minuta de edital com cotas reservadas e critérios de desempate ficto previstos pela LC nº 123/2006.',
  },
];

/* --------------------------------------------------------------------------
   Catálogo de Órgãos Públicos Estaduais
   -------------------------------------------------------------------------- */
export const ORGAOS_MOCK: OrgaoRecord[] = [
  {
    sigla: 'SES-RJ',
    nome: 'Secretaria de Estado de Saúde',
    esfera: 'Estadual / Administração Direta',
    total_contratacoes: 148,
    valor_total_estimado: 'R$ 840,5 milhões',
    principais_categorias: ['Gestão Hospitalar', 'Medicamentos', 'Insumos Cirúrgicos', 'Locação de Ambulâncias'],
    principais_fornecedores: ['Instituto de Gestão e Saúde', 'MedSupply S/A', 'Distribuidora Farmacêutica Rio'],
  },
  {
    sigla: 'SECTRAN',
    nome: 'Secretaria de Estado de Transporte e Mobilidade Urbana',
    esfera: 'Estadual / Administração Direta',
    total_contratacoes: 42,
    valor_total_estimado: 'R$ 490,2 milhões',
    principais_categorias: ['Infraestrutura Viária', 'Manutenção Ferroviária', 'Sinalização', 'Estudos de Tráfego'],
    principais_fornecedores: ['Consórcio Fluminense de Infraestrutura', 'Engenharia e Pavimentação Guanabara'],
  },
  {
    sigla: 'SEEDUC',
    nome: 'Secretaria de Estado de Educação',
    esfera: 'Estadual / Administração Direta',
    total_contratacoes: 96,
    valor_total_estimado: 'R$ 310,0 milhões',
    principais_categorias: ['Merenda Escolar', 'Transporte Escolar', 'Material Didático', 'Reforma de Escolas'],
    principais_fornecedores: ['Distribuidora Rio Alimentos', 'Expresso Escolar RJ', 'Gráfica e Editora Oficial'],
  },
  {
    sigla: 'SEFAZ-RJ',
    nome: 'Secretaria de Estado de Fazenda',
    esfera: 'Estadual / Administração Direta',
    total_contratacoes: 35,
    valor_total_estimado: 'R$ 78,4 milhões',
    principais_categorias: ['Sustentação de Sistemas Fiscais', 'Hardware e Servidores', 'Segurança da Informação'],
    principais_fornecedores: ['TechServ Sistemas', 'DataCenter Brasil', 'InfraCloud Serviços'],
  },
  {
    sigla: 'UERJ',
    nome: 'Universidade do Estado do Rio de Janeiro',
    esfera: 'Estadual / Autarquia',
    total_contratacoes: 64,
    valor_total_estimado: 'R$ 95,8 milhões',
    principais_categorias: ['Suporte e Redes', 'Equipamentos Laboratoriais', 'Segurança Patrimonial', 'Limpeza'],
    principais_fornecedores: ['InfoRedes Conectividade', 'ServClean Conservação', 'LabInstruments Ltda.'],
  },
  {
    sigla: 'CGE-RJ',
    nome: 'Controladoria Geral do Estado',
    esfera: 'Estadual / Órgão de Controle',
    total_contratacoes: 18,
    valor_total_estimado: 'R$ 16,2 milhões',
    principais_categorias: ['Auditoria de Dados', 'Consultoria de Integridade', 'Capacitação em Controle'],
    principais_fornecedores: ['Analytics Governança', 'Instituto de Compliance Público'],
  },
];

/* --------------------------------------------------------------------------
   Catálogo de Fontes Oficiais de Informação
   -------------------------------------------------------------------------- */
export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: 'pncp',
    nome: 'Portal Nacional de Contratações Públicas',
    sigla: 'PNCP',
    instituicao: 'Governo Federal / Ministério da Gestão e da Inovação',
    tipoInformacao: 'Editais, avisos de contratação direta, contratos administrativos e atas de registro de preços',
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
    tipoInformacao: 'Pregões eletrônicos, atas de registro de preços, catálogo de itens e fornecedores estaduais',
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
    tipoInformacao: 'Atos normativos, decretos regulamentares, extratos contratuais e homologações de licitações',
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
    tipoInformacao: 'Execução orçamentária, pagamentos a fornecedores e planos anuais de contratações (PCA)',
    url: 'https://dados.rj.gov.br',
    natureza: 'agregada',
    frequenciaColeta: 'Mensal',
    descricao:
      'Conjuntos de dados abertos para transparência pública, permitindo conferência e cruzamento de empenhos, liquidações e contratos vigentes.',
  },
];
