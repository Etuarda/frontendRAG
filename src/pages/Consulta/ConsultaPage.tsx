import type { AppView, RagResponse } from '../../types';
import { SearchComposer } from '../../components/search/SearchComposer';
import { QueryResultView } from '../../components/results/QueryResultView';
import { Icon } from '../../components/ui/Icon';

interface ConsultaPageProps {
  currentResponse: RagResponse | null;
  loading: boolean;
  error: string | null;
  fonteFilter: string;
  onFonteChange: (fonte: string) => void;
  searchStrategy: 'automatica' | 'hibrida' | 'normativa';
  onStrategyChange: (strategy: 'automatica' | 'hibrida' | 'normativa') => void;
  onSubmitQuery: (query: string) => void;
  onResetResponse: () => void;
  onNavigate: (view: AppView) => void;
}

export function ConsultaPage({
  currentResponse,
  loading,
  error,
  fonteFilter,
  onFonteChange,
  searchStrategy,
  onStrategyChange,
  onSubmitQuery,
  onResetResponse,
  onNavigate,
}: ConsultaPageProps) {
  return (
    <div className="consulta-page-container">
      {/* Exibe o composer caso não haja resposta ativa */}
      {!currentResponse ? (
        <SearchComposer
          loading={loading}
          onSubmit={onSubmitQuery}
          onNavigate={onNavigate}
          fonteFilter={fonteFilter}
          onFonteChange={onFonteChange}
          searchStrategy={searchStrategy}
          onStrategyChange={onStrategyChange}
        />
      ) : null}

      {/* Estado de Carregamento Limpo e Humanizado */}
      {loading ? (
        <div className="processing-indicator-box" aria-live="polite">
          <div className="processing-spinner">
            <Icon name="refresh-cw" size={20} className="spin-animation" />
          </div>
          <div className="processing-text-group">
            <h2 className="processing-title">Consultando fontes oficiais...</h2>
            <p className="processing-sub">
              Buscando e cruzando evidências em editais, atas e contratos vigentes do Rio de Janeiro.
            </p>
          </div>
        </div>
      ) : null}

      {/* Banner de Erro Humanizado */}
      {error && !loading ? (
        <div className="error-notice-card" role="alert">
          <Icon name="info" size={18} />
          <div className="error-copy">
            <strong>Não foi possível concluir a consulta</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {/* Apresentação do Resultado */}
      {!loading && currentResponse ? (
        <QueryResultView response={currentResponse} onNewSearch={onResetResponse} />
      ) : null}
    </div>
  );
}
