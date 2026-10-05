import { useState } from 'react';
import type { AppView, RagResponse } from '../types';
import { useRagWorkspace } from '../hooks/useRagWorkspace';
import { useHistory } from '../hooks/useHistory';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Icon } from '../components/ui/Icon';

import { ConsultaPage } from '../pages/Consulta/ConsultaPage';
import { HistoricoPage } from '../pages/Historico/HistoricoPage';
import { ContratacoesPage } from '../pages/Contratacoes/ContratacoesPage';
import { DocumentosPage } from '../pages/Documentos/DocumentosPage';
import { OrgaosPage } from '../pages/Orgaos/OrgaosPage';
import { FontesPage } from '../pages/Fontes/FontesPage';
import { TransparenciaPage } from '../pages/Transparencia/TransparenciaPage';
import { SobrePage } from '../pages/Sobre/SobrePage';
import { ComoFuncionaPage } from '../pages/Sobre/ComoFuncionaPage';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('consulta');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const workspace = useRagWorkspace();
  const { items: historyItems, refresh: refreshHistory } = useHistory();

  const handleNewQuery = () => {
    workspace.resetResponse();
    setActiveView('consulta');
  };

  const handleSelectHistoryItem = (response: RagResponse) => {
    workspace.selectHistoryResponse(response);
    setActiveView('consulta');
  };

  const handleDirectSearch = (queryText: string) => {
    workspace.submitQuery(queryText);
    setActiveView('consulta');
  };

  const renderActivePage = () => {
    switch (activeView) {
      case 'consulta':
        return (
          <ConsultaPage
            currentResponse={workspace.currentResponse}
            loading={workspace.loading}
            error={workspace.error}
            fonteFilter={workspace.fonteFilter}
            onFonteChange={workspace.setFonteFilter}
            searchStrategy={workspace.searchStrategy}
            onStrategyChange={workspace.setSearchStrategy}
            onSubmitQuery={async (q) => {
              await workspace.submitQuery(q);
              refreshHistory();
            }}
            onResetResponse={workspace.resetResponse}
            onNavigate={setActiveView}
          />
        );

      case 'historico':
        return (
          <HistoricoPage
            onSelectHistoryItem={handleSelectHistoryItem}
            onNewQuery={handleNewQuery}
          />
        );

      case 'contratacoes':
        return <ContratacoesPage onSearchQuery={handleDirectSearch} />;

      case 'documentos':
        return <DocumentosPage onSearchQuery={handleDirectSearch} />;

      case 'orgaos':
        return <OrgaosPage onSearchQuery={handleDirectSearch} />;

      case 'fontes':
        return <FontesPage />;

      case 'como-funciona':
        return <ComoFuncionaPage onNavigate={setActiveView} />;

      case 'transparencia':
        return <TransparenciaPage />;

      case 'sobre':
        return <SobrePage />;

      default:
        return null;
    }
  };

  return (
    <div className="nexo-app-layout">
      {/* Só aparece no mobile; no desktop a sidebar fixa cumpre esse papel. */}
      <header className="nexo-mobile-topbar" aria-label="Cabeçalho mobile">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="mobile-brand-center" onClick={() => handleNewQuery()}>
          <img src="./assets/nexo.png" alt="NEXO RJ" className="mobile-topbar-logo" />
        </div>

        <button
          type="button"
          className="mobile-new-btn"
          onClick={handleNewQuery}
          aria-label="Nova consulta"
          title="Nova consulta"
        >
          <Icon name="plus" size={18} />
        </button>
      </header>

      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onNewQuery={handleNewQuery}
        historyCount={historyItems.length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="nexo-main-wrapper">
        <main className="nexo-main-canvas" role="main">
          <div className="nexo-container">{renderActivePage()}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
