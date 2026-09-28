import { useState } from 'react';
import type { AppView } from '../../domain/rag/types';
import { APP_CONFIG } from '../config/app.config';
import { Icon, type IconName } from './Icon';

interface NavItem {
  id: AppView;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'consulta', label: 'Consulta', icon: 'search' },
  { id: 'historico', label: 'Histórico', icon: 'clock' },
  { id: 'fontes', label: 'Fontes', icon: 'compass' },
];

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  activeView,
  onSelectView,
  sidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectNav = (view: AppView) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-brand-group">
          {activeView === 'consulta' ? (
            <button
              type="button"
              className="icon-button sidebar-toggle-btn"
              onClick={onToggleSidebar}
              aria-label={sidebarOpen ? 'Ocultar histórico' : 'Ver histórico da sessão'}
              title={sidebarOpen ? 'Ocultar histórico' : 'Ver histórico da sessão'}
            >
              <Icon name="clock" size={18} />
            </button>
          ) : null}

          <div
            className="brand-clickable"
            onClick={() => handleSelectNav('consulta')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectNav('consulta')}
            aria-label="Ir para a página inicial de Consulta"
          >
            <div className="brand-mark">
              <Icon name="compass" size={20} />
            </div>
            <div className="brand-copy">
              <strong className="brand-title">{APP_CONFIG.name.toUpperCase()}</strong>
              <p className="brand-sub">{APP_CONFIG.subtitle}</p>
            </div>
          </div>

          {/* Botão Menu Hambúrguer (Mobile) */}
          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((curr) => !curr)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>

        {/* Abas de Navegação Principais (Consulta | Histórico | Fontes) */}
        <nav className="header-nav-tabs" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-tab-btn ${activeView === item.id ? 'is-active' : ''}`}
              onClick={() => handleSelectNav(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Drawer Móvel de Navegação (Mobile First) */}
      {mobileMenuOpen ? (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <nav
            className="mobile-drawer"
            aria-label="Menu móvel de navegação"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div className="drawer-brand">
                <div className="brand-mark sm">
                  <Icon name="compass" size={16} />
                </div>
                <span>Nexo RJ</span>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <Icon name="x" size={19} />
              </button>
            </div>

            <div className="mobile-drawer-section">
              <span className="drawer-section-title">Navegação</span>
              <div className="drawer-nav-list">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`drawer-nav-item ${activeView === item.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectNav(item.id)}
                  >
                    <Icon name={item.icon} size={17} />
                    <span>{item.label}</span>
                    {activeView === item.id ? <span className="active-dot" /> : null}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
