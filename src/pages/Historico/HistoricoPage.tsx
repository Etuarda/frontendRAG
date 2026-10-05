import { useState } from 'react';
import type { Conversation } from '../../types';
import { useHistory } from '../../hooks/useHistory';
import { Icon } from '../../components/ui/Icon';
import { EVIDENCE_LEVEL_LABELS } from '../../utils/catalog';

interface HistoricoPageProps {
  onOpenConversation: (conversation: Conversation) => void;
  onNewQuery: () => void;
}

// Exclusão é irreversível: pede um segundo clique antes de apagar.
const CLEAR_ALL = 'all';

const SUMMARY_LENGTH = 160;

function summarize(text: string): string {
  const flat = text.replace(/\n+/g, ' ');
  return flat.length > SUMMARY_LENGTH ? `${flat.slice(0, SUMMARY_LENGTH)}...` : flat;
}

export function HistoricoPage({ onOpenConversation, onNewQuery }: HistoricoPageProps) {
  const { conversations, loading, error, deleteConversation, clearHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const term = searchTerm.trim().toLowerCase();
  // Busca em todas as perguntas, não só no título, para achar a conversa por qualquer assunto tratado.
  const filtered = conversations.filter((c) =>
    c.turns.some((turn) => turn.query.toLowerCase().includes(term))
  );

  const handleDelete = (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    setConfirmingId(null);
    if (id === CLEAR_ALL) clearHistory();
    else deleteConversation(id);
  };

  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">REGISTRO DE CONVERSAS</span>
        <h1 className="page-title">Histórico</h1>
        <p className="page-description">
          Cada conversa fica salva separadamente, com todas as perguntas, respostas e fontes. Reabra
          uma conversa para continuar de onde parou.
        </p>
      </header>

      <div className="history-toolbar">
        <div className="history-search-input">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Buscar nas conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar nas conversas"
          />
        </div>

        {conversations.length > 0 ? (
          <button
            type="button"
            className={`btn-clear-history ${confirmingId === CLEAR_ALL ? 'is-confirming' : ''}`}
            onClick={() => handleDelete(CLEAR_ALL)}
            onBlur={() => setConfirmingId(null)}
          >
            <Icon name="trash" size={14} />
            <span>{confirmingId === CLEAR_ALL ? 'Confirmar limpeza' : 'Limpar histórico'}</span>
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="history-loading-state">
          <Icon name="refresh-cw" size={18} className="spin-animation" />
          <span>Carregando histórico...</span>
        </div>
      ) : null}

      {error && !loading ? (
        <div className="history-error-state">
          <Icon name="info" size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <div className="empty-history-box">
          <div className="empty-history-icon">
            <Icon name="clock" size={28} />
          </div>
          <h2 className="empty-history-title">
            {term ? 'Nenhuma conversa encontrada.' : 'Nenhuma conversa ainda.'}
          </h2>
          <p className="empty-history-desc">
            {term ? 'Tente outra palavra-chave.' : 'Suas conversas aparecerão aqui.'}
          </p>
          {!term ? (
            <button type="button" className="btn-empty-start" onClick={onNewQuery}>
              <Icon name="plus" size={15} />
              <span>Começar uma conversa</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {!loading && filtered.length > 0 ? (
        <ul className="history-items-feed" aria-label="Conversas salvas">
          {filtered.map((conversation) => {
            const lastTurn = conversation.turns[conversation.turns.length - 1];
            const questions = conversation.turns.length;
            const isConfirming = confirmingId === conversation.id;

            return (
              <li key={conversation.id} className="history-feed-card">
                <button
                  type="button"
                  className="feed-card-open"
                  onClick={() => onOpenConversation(conversation)}
                  aria-label={`Abrir conversa: ${conversation.title}`}
                >
                  <div className="feed-card-header">
                    <span className="feed-card-timestamp">
                      <Icon name="clock" size={13} />
                      <time dateTime={conversation.updated_at}>
                        {new Date(conversation.updated_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </span>
                    <span className="feed-card-badge">
                      {questions} {questions === 1 ? 'pergunta' : 'perguntas'}
                    </span>
                  </div>

                  <h2 className="feed-card-query">{conversation.title}</h2>

                  {lastTurn ? (
                    <p className="feed-card-summary">
                      {questions > 1 ? <strong>Última: {lastTurn.query} · </strong> : null}
                      {summarize(lastTurn.response.answer)}
                    </p>
                  ) : null}
                </button>

                <div className="feed-card-footer">
                  <span className="feed-card-sources">
                    <Icon name="shield" size={13} />
                    <span>
                      {lastTurn ? EVIDENCE_LEVEL_LABELS[lastTurn.response.confidence_level] : ''}
                    </span>
                  </span>

                  <button
                    type="button"
                    className={`btn-delete-conversation ${isConfirming ? 'is-confirming' : ''}`}
                    onClick={() => handleDelete(conversation.id)}
                    onBlur={() => setConfirmingId(null)}
                    aria-label={
                      isConfirming
                        ? `Confirmar exclusão da conversa: ${conversation.title}`
                        : `Excluir conversa: ${conversation.title}`
                    }
                  >
                    <Icon name="trash" size={13} />
                    <span>{isConfirming ? 'Confirmar' : 'Excluir'}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
