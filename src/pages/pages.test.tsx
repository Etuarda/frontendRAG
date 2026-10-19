import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContratacoesPage } from './Contratacoes/ContratacoesPage';
import { HistoricoPage } from './Historico/HistoricoPage';
import { App } from '../app/App';
import { json, stubFetch, stubNetworkDown } from '../test/http';

const CONTRATO = {
  id: '30381552000158-2-000016/2025',
  numero_contrato: '30381552000158-2-000016/2025',
  orgao: 'DUQUE DE CAXIAS CAMARA MUNICIPAL',
  orgao_cnpj: '30381552000158',
  fornecedor: 'MODERNIZACAO PUBLICA E INFORMATICA LTDA',
  objeto: 'Licenciamento de programas de informática.',
  valor_global: 38551.16,
  data_homologacao: null,
  modalidade: null,
  fonte_oficial: 'PNCP',
  status: null,
  esfera: 'municipal',
  municipio: 'Duque de Caxias',
};

describe('ContratacoesPage', () => {
  it('mostra os dados da API e campos nulos como "Não informado"', async () => {
    stubFetch(() => json(200, [CONTRATO]));
    render(<ContratacoesPage onSearchQuery={vi.fn()} />);

    const card = (await screen.findByText(CONTRATO.numero_contrato)).closest('article')!;
    expect(within(card).getByText('R$ 38.551,16')).toBeInTheDocument();
    // modalidade, status e data_homologacao são null no registro.
    expect(within(card).getAllByText('Não informado')).toHaveLength(3);
  });

  it('pede só 24 contratos e carrega a próxima página sob demanda', async () => {
    const firstPage = Array.from({ length: 24 }, (_, i) => ({
      ...CONTRATO, id: `pncp-${i}`, numero_contrato: `Contrato ${i}`,
    }));
    const { calls } = stubFetch(({ url }) => json(200,
      url.searchParams.get('offset') === '24'
        ? [{ ...CONTRATO, id: 'pncp-24', numero_contrato: 'Contrato 24' }]
        : firstPage
    ));
    render(<ContratacoesPage onSearchQuery={vi.fn()} />);
    await screen.findByText('Contrato 0');
    expect(screen.getAllByRole('article')).toHaveLength(24);
    expect(calls).toHaveLength(1);
    expect(calls[0].url.searchParams.get('limit')).toBe('24');
    expect(calls[0].url.searchParams.get('offset')).toBe('0');
    await userEvent.click(screen.getByRole('button', { name: 'Carregar mais' }));
    await screen.findByText('Contrato 24');
    expect(screen.getAllByRole('article')).toHaveLength(25);
    expect(calls[1].url.searchParams.get('offset')).toBe('24');
    expect(screen.queryByRole('button', { name: 'Carregar mais' })).not.toBeInTheDocument();
  });

  it('reinicia a paginação ao filtrar, sem carregar todo o acervo', async () => {
    const { calls } = stubFetch(({ url }) => json(200,
      url.searchParams.get('busca') === 'software'
        ? [{ ...CONTRATO, numero_contrato: 'Resultado filtrado' }]
        : [CONTRATO]
    ));
    render(<ContratacoesPage onSearchQuery={vi.fn()} />);
    await screen.findByText(CONTRATO.numero_contrato);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar contratações' }), 'software');
    await screen.findByText('Resultado filtrado');
    await waitFor(() => expect(calls.at(-1)?.url.searchParams.get('busca')).toBe('software'));
    expect(calls.at(-1)?.url.searchParams.get('offset')).toBe('0');
    expect(calls.every(({ url }) => url.searchParams.get('limit') === '24')).toBe(true);
  });

  it('erro da API mostra mensagem e "Tentar novamente"', async () => {
    let attempt = 0;
    stubFetch(() => (++attempt === 1 ? json(503, {}) : json(200, [CONTRATO])));
    render(<ContratacoesPage onSearchQuery={vi.fn()} />);

    expect(await screen.findByText(/temporariamente indisponível/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Tentar novamente/ }));
    expect(await screen.findByText(CONTRATO.numero_contrato)).toBeInTheDocument();
  });
});

describe('HistoricoPage', () => {
  it('lista vazia do backend mostra estado vazio, sem itens de exemplo', async () => {
    stubFetch(() => json(200, []));
    render(<HistoricoPage onOpenItem={vi.fn()} onNewQuery={vi.fn()} />);

    expect(await screen.findByText('Nenhuma consulta registrada ainda.')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});

describe('App com backend desligado', () => {
  it('a consulta mostra erro de conexão e nenhuma resposta', async () => {
    stubNetworkDown();
    render(<App />);

    await userEvent.type(screen.getByLabelText('Pergunta sobre contratações públicas'), 'Quais contratos?{Enter}');

    expect(await screen.findByText(/conectar ao backend/)).toBeInTheDocument();
    expect(screen.queryByText(/Fontes utilizadas/)).not.toBeInTheDocument();
    expect(await screen.findByText('Backend offline')).toBeInTheDocument();
  });
});
