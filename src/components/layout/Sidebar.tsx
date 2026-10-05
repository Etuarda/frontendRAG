import type { AppView } from '../../types';
import { Icon, type IconName } from '../ui/Icon';

interface SidebarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onNewQuery: () => void;
  historyCount?: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: IconName;
  badge?: number;
}

const MAIN_NAV: NavItem[] = [
  { id: 'consulta', label: 'Consulta', icon: 'search' },
  { id: 'historico', label: 'Histórico', icon: 'clock' },
];

const EXPLORAR_NAV: NavItem[] = [
  { id: 'contratacoes', label: 'Contratações', icon: 'layers' },
  { id: 'documentos', label: 'Documentos', icon: 'file-text' },
  { id: 'orgaos', label: 'Órgãos', icon: 'building' },
  { id: 'fontes', label: 'Fontes oficiais', icon: 'compass' },
];

const SOBRE_NAV: NavItem[] = [
  { id: 'como-funciona', label: 'Como funciona', icon: 'help-circle' },
  { id: 'transparencia', label: 'Transparência da IA', icon: 'shield' },
  { id: 'sobre', label: 'Sobre o projeto', icon: 'info' },
];

export function Sidebar({
  activeView,
  onSelectView,
  onNewQuery,
  historyCount = 0,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleNavClick = (view: AppView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const handleNewClick = () => {
    onNewQuery();
    onCloseMobile();
  };

  const content = (
    <aside className="nexo-sidebar" aria-label="Navegação da aplicação">
      <div className="sidebar-brand-wrapper">
        <button
          type="button"
          className="sidebar-brand-btn"
          onClick={() => handleNavClick('consulta')}
          aria-label="NEXO RJ - Página inicial"
        >
          <img
            src="./assets/nexo.png"
            alt="NEXO RJ"
            className="sidebar-logo-img"
            onError={(e) => {
              // Sem a logo, mostra o nome em texto para a marca nunca sumir.
              (e.currentTarget as HTMLElement).style.display = 'none';
              const textElem = document.getElementById('nexo-fallback-text');
              if (textElem) textElem.style.display = 'block';
            }}
          />
          <span id="nexo-fallback-text" className="sidebar-brand-text" style={{ display: 'none' }}>
            NEXO RJ
          </span>
        </button>
      </div>

      <div className="sidebar-action-wrapper">
        <button
          type="button"
          className="btn-new-query"
          onClick={handleNewClick}
          aria-label="Iniciar nova consulta inteligente"
        >
          <Icon name="plus" size={16} />
          <span>Nova consulta</span>
        </button>
      </div>

      <nav className="sidebar-nav-group" aria-label="Acesso principal">
        <div className="sidebar-nav-list">
          {MAIN_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${activeView === item.id ? 'is-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span className="nav-item-label">{item.label}</span>
              {item.id === 'historico' && historyCount > 0 ? (
                <span className="sidebar-badge">{historyCount}</span>
              ) : null}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-section">
        <span className="sidebar-section-header">EXPLORAR</span>
        <div className="sidebar-nav-list">
          {EXPLORAR_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${activeView === item.id ? 'is-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-section-header">SOBRE</span>
        <div className="sidebar-nav-list">
          {SOBRE_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${activeView === item.id ? 'is-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-status-tag">
          <span className="status-dot dot-success" />
          <span>Sistema online</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mesmo conteúdo em dois formatos: fixo no desktop, drawer no mobile. */}
      <div className="desktop-sidebar-container">{content}</div>

      {mobileOpen ? (
        <div
          className="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        >
          <div
            className="mobile-sidebar-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="mobile-drawer-header-row">
              <span className="mobile-drawer-title">Menu</span>
              <button
                type="button"
                className="btn-close-drawer"
                onClick={onCloseMobile}
                aria-label="Fechar menu"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}
