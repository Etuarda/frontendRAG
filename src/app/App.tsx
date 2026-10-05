import { useState } from 'react';
import type { AppView, Conversation } from '../types';
import { useRagWorkspace } from '../hooks/useRagWorkspace';
import { useHistory } from '../hooks/useHistory';
import { useSidebar } from '../hooks/useSidebar';
import { Sidebar, SIDEBAR_ID } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Icon } from '../components/ui/Icon';
import nexoLogo from '../assets/nexo.png';

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
  const sidebar = useSidebar();

  const workspace = useRagWorkspace();
  const { conversations } = useHistory();

  const handleNewQuery = () => {
    workspace.startNewConversation();
    setActiveView('consulta');
  };

  const handleOpenConversation = (conversation: Conversation) => {
    workspace.openConversation(conversation);
    setActiveView('consulta');
  };

  // Busca vinda dos catálogos é um assunto novo, então abre uma conversa própria.
  const handleDirectSearch = (queryText: string) => {
    workspace.startNewConversation();
    workspace.submitQuery(queryText);
    setActiveView('consulta');
  };

  const renderActivePage = () => {
    switch (activeView) {
      case 'consulta':
        return (
          <ConsultaPage
            conversation={workspace.conversation}
            pendingQuery={workspace.pendingQuery}
            loading={workspace.loading}
            error={workspace.error}
            fonteFilter={workspace.fonteFilter}
            onFonteChange={workspace.setFonteFilter}
            searchStrategy={workspace.searchStrategy}
            onStrategyChange={workspace.setSearchStrategy}
            onSubmitQuery={workspace.submitQuery}
            onRateTurn={workspace.rateTurn}
            onNewConversation={handleNewQuery}
            onNavigate={setActiveView}
          />
        );

      case 'historico':
        return (
          <HistoricoPage
            onOpenConversation={handleOpenConversation}
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
          onClick={sidebar.openMobile}
          aria-label="Abrir menu"
          aria-expanded={sidebar.mobileOpen}
          aria-controls={SIDEBAR_ID}
        >
          <Icon name="menu" size={20} />
        </button>

        <button
          type="button"
          className="mobile-brand-center"
          onClick={handleNewQuery}
          aria-label="NEXO RJ - Página inicial"
        >
          <img src={nexoLogo} alt="" className="mobile-topbar-logo" />
        </button>

        <button
          type="button"
          className="mobile-new-btn"
          onClick={handleNewQuery}
          aria-label="Nova conversa"
          title="Nova conversa"
        >
          <Icon name="plus" size={18} />
        </button>
      </header>

      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onNewQuery={handleNewQuery}
        historyCount={conversations.length}
        mobileOpen={sidebar.mobileOpen}
        onCloseMobile={sidebar.closeMobile}
        collapsed={sidebar.collapsed}
        onToggleCollapsed={sidebar.toggleCollapsed}
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
