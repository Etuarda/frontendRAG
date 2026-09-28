import { useState } from 'react';
import type { AppView, SessionEntry } from '../domain/rag/types';
import { CorpusView } from '../features/corpus/components/CorpusView';
import { CurationView } from '../features/curation/components/CurationView';
import { EvaluationView } from '../features/evaluation/components/EvaluationView';
import { GuardrailsModal } from '../features/guardrails/components/GuardrailsModal';
import { HistoryView } from '../features/history/components/HistoryView';
import { SessionSidebar } from '../features/history/components/SessionSidebar';
import { KnowledgeBasesModal } from '../features/knowledge/components/KnowledgeBasesModal';
import { ObservabilityView } from '../features/observability/components/ObservabilityView';
import { PipelineView } from '../features/pipeline/components/PipelineView';
import { ProcessingStatus } from '../features/query/components/ProcessingStatus';
import { QueryComposer } from '../features/query/components/QueryComposer';
import { SuggestedQueries } from '../features/query/components/SuggestedQueries';
import { useRagWorkspace } from '../features/query/hooks/useRagWorkspace';
import { AnswerPanel } from '../features/results/components/AnswerPanel';
import { SourcesView } from '../features/sources/components/SourcesView';
import { Header } from '../shared/components/Header';
import { Icon } from '../shared/components/Icon';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('consulta');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile-first: closed by default on small viewports
  const [activeModal, setActiveModal] = useState<'bases' | 'guardrails' | null>(null);
  const workspace = useRagWorkspace();

  const handleSelectHistoryEntry = (entry: SessionEntry) => {
    workspace.selectHistoryEntry(entry);
    setActiveView('consulta');
    setSidebarOpen(false); // Close drawer on selection
  };

  const handleSelectSidebarEntry = (entry: SessionEntry) => {
    workspace.selectHistoryEntry(entry);
    // On small screens, automatically close the off-canvas drawer
    if (typeof window !== 'undefined' && window.innerWidth < 980) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
        onOpenBases={() => setActiveModal('bases')}
        onOpenGuardrails={() => setActiveModal('guardrails')}
      />

      <div className="workspace-shell">
        {activeView === 'consulta' ? (
          <>
            {/* Backdrop para mobile quando o sidebar estiver aberto */}
            <div
              className={`sidebar-backdrop ${sidebarOpen ? 'is-visible' : ''}`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <SessionSidebar
              open={sidebarOpen}
              entries={workspace.history}
              currentQuery={workspace.currentResponse?.query}
              apiStatus={workspace.apiStatus}
              onSelect={handleSelectSidebarEntry}
              onClear={workspace.clearHistory}
            />
          </>
        ) : null}

        <main className={`main-content ${activeView !== 'consulta' ? 'is-full-view' : ''}`}>
          <div className="content-column">
            {activeView === 'consulta' && (
              <>
                {!workspace.currentResponse && !workspace.loading ? (
                  <section className="hero-copy">
                    <div className="hero-kicker">
                      <Icon name="sparkles" size={14} />
                      <span>Contratações públicas · Rio de Janeiro</span>
                    </div>
                    <h1>
                      Consulte o acervo público por <em>evidência.</em>
                    </h1>
                    <p>
                      Faça perguntas em linguagem natural. O Adaptive RAG analisa a intenção,
                      escolhe as bases necessárias e responde com as fontes recuperadas no corpus.
                    </p>
                  </section>
                ) : null}

                <QueryComposer loading={workspace.loading} onSubmit={workspace.submitQuery} />

                {workspace.error ? (
                  <div className="error-banner" role="alert">
                    <Icon name="info" size={18} />
                    <div>
                      <strong>Falha na consulta</strong>
                      <span>{workspace.error}</span>
                    </div>
                  </div>
                ) : null}

                {workspace.loading ? <ProcessingStatus step={workspace.loadingStep} /> : null}

                {!workspace.loading && workspace.currentResponse ? (
                  <AnswerPanel
                    response={workspace.currentResponse}
                    onReset={workspace.resetResponse}
                  />
                ) : null}

                {!workspace.loading && !workspace.currentResponse ? (
                  <SuggestedQueries disabled={workspace.loading} onSelect={workspace.submitQuery} />
                ) : null}
              </>
            )}

            {activeView === 'historico' && (
              <HistoryView
                entries={workspace.history}
                onSelectQuery={handleSelectHistoryEntry}
                onClearHistory={workspace.clearHistory}
              />
            )}

            {activeView === 'corpus' && <CorpusView />}

            {activeView === 'fontes' && <SourcesView />}

            {activeView === 'curadoria' && <CurationView />}

            {activeView === 'pipeline' && <PipelineView />}

            {activeView === 'avaliacao' && <EvaluationView />}

            {activeView === 'observabilidade' && <ObservabilityView />}
          </div>
        </main>
      </div>

      {activeModal === 'bases' ? (
        <KnowledgeBasesModal onClose={() => setActiveModal(null)} />
      ) : null}
      {activeModal === 'guardrails' ? (
        <GuardrailsModal onClose={() => setActiveModal(null)} />
      ) : null}
    </div>
  );
}
