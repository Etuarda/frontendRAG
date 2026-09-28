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
  { id: 'consulta', label: 'Consulta', icon: 'sparkles' },
  { id: 'historico', label: 'Histórico', icon: 'clock' },
  { id: 'corpus', label: 'Corpus', icon: 'database' },
  { id: 'fontes', label: 'Fontes', icon: 'compass' },
  { id: 'curadoria', label: 'Curadoria', icon: 'shield' },
  { id: 'pipeline', label: 'Pipeline', icon: 'sliders' },
  { id: 'avaliacao', label: 'Avaliação', icon: 'check' },
  { id: 'observabilidade', label: 'Observabilidade', icon: 'cpu' },
];

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenBases: () => void;
  onOpenGuardrails: () => void;
}

export function Header({
  activeView,
  onSelectView,
  sidebarOpen,
  onToggleSidebar,
  onOpenBases,
  onOpenGuardrails,
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
              aria-label={sidebarOpen ? 'Ocultar histórico' : 'Ver histórico'}
              title={sidebarOpen ? 'Ocultar histórico' : 'Ver histórico'}
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
          >
            <div className="brand-mark">
              <Icon name="compass" size={20} />
            </div>
            <div className="brand-copy">
              <div className="brand-title-row">
                <strong>{APP_CONFIG.name}</strong>
                <span className="brand-badge">Adaptive RAG</span>
              </div>
              <p className="brand-sub">{APP_CONFIG.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Abas de Navegação (Desktop & Scroll Mobile) */}
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

        {/* Ações Desktop */}
        <div className="header-actions" aria-label="Ferramentas da aplicação">
          <button type="button" onClick={onOpenBases} title="Ver bases do corpus">
            <Icon name="database" size={16} />
            <span className="action-btn-text">Bases</span>
          </button>
          <button type="button" onClick={onOpenGuardrails} title="Ver regras de guardrails">
            <Icon name="shield" size={16} />
            <span className="action-btn-text">Guardrails</span>
          </button>

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
      </header>

      {/* Drawer Móvel de Navegação Completa */}
      {mobileMenuOpen ? (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <nav
            className="mobile-drawer"
            aria-label="Menu móvel completo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div className="drawer-brand">
                <div className="brand-mark sm">
                  <Icon name="compass" size={17} />
                </div>
                <span>Nexo RJ · Menu</span>
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
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    {activeView === item.id ? <span className="active-dot" /> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-drawer-section">
              <span className="drawer-section-title">Ferramentas & Catálogo</span>
              <div className="drawer-actions-list">
                <button
                  type="button"
                  className="drawer-action-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBases();
                  }}
                >
                  <Icon name="database" size={17} />
                  <span>Bases do Corpus</span>
                </button>
                <button
                  type="button"
                  className="drawer-action-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGuardrails();
                  }}
                >
                  <Icon name="shield" size={17} />
                  <span>Guardrails & Conformidade</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
