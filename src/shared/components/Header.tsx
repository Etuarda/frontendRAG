import { useState } from 'react';
import type { AppView } from '../../domain/rag/types';
import { Icon } from './Icon';

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  historyCount?: number;
}

export function Header({
  activeView,
  onSelectView,
  historyCount = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectNav = (view: AppView) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          {/* Lado esquerdo ultra limpo: apenas o nome Nexo */}
          <div
            className="brand-clickable"
            onClick={() => handleSelectNav('consulta')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectNav('consulta')}
            aria-label="Nexo - Ir para página inicial de consulta"
          >
            <span className="brand-logo-text">Nexo</span>
          </div>

          {/* Navegação Desktop (Consulta | Histórico) */}
          <nav className="header-desktop-nav" aria-label="Navegação principal">
            <button
              type="button"
              className={`nav-link-btn ${activeView === 'consulta' ? 'is-active' : ''}`}
              onClick={() => handleSelectNav('consulta')}
              aria-current={activeView === 'consulta' ? 'page' : undefined}
            >
              <Icon name="search" size={15} />
              <span>Consulta</span>
            </button>

            <button
              type="button"
              className={`nav-link-btn ${activeView === 'historico' ? 'is-active' : ''}`}
              onClick={() => handleSelectNav('historico')}
              aria-current={activeView === 'historico' ? 'page' : undefined}
            >
              <Icon name="clock" size={15} />
              <span>Histórico</span>
              {historyCount > 0 ? (
                <span className="nav-badge-count" aria-label={`${historyCount} consultas no histórico`}>
                  {historyCount}
                </span>
              ) : null}
            </button>
          </nav>

          {/* Botão Menu Mobile */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((curr) => !curr)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de opções'}
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
            <span className="mobile-menu-text">Menu</span>
          </button>
        </div>
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
            aria-label="Menu principal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-top">
              <span className="brand-logo-text">Nexo</span>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <button
                type="button"
                className={`drawer-link ${activeView === 'consulta' ? 'is-active' : ''}`}
                onClick={() => handleSelectNav('consulta')}
              >
                <div className="drawer-link-content">
                  <Icon name="search" size={18} />
                  <span>Consulta</span>
                </div>
                {activeView === 'consulta' ? <span className="drawer-active-indicator" /> : null}
              </button>

              <button
                type="button"
                className={`drawer-link ${activeView === 'historico' ? 'is-active' : ''}`}
                onClick={() => handleSelectNav('historico')}
              >
                <div className="drawer-link-content">
                  <Icon name="clock" size={18} />
                  <span>Histórico</span>
                </div>
                <div className="drawer-link-right">
                  {historyCount > 0 ? (
                    <span className="nav-badge-count">{historyCount}</span>
                  ) : null}
                  {activeView === 'historico' ? <span className="drawer-active-indicator" /> : null}
                </div>
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <div className="system-status-indicator">
                <span className="dot-indicator dot-success" />
                <span>Sistema disponível</span>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
