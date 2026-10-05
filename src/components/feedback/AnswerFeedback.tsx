import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { feedbackService } from '../../services/feedback.service';

interface AnswerFeedbackProps {
  queryId?: string;
  query: string;
}

export function AnswerFeedback({ queryId, query }: AnswerFeedbackProps) {
  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);

  const handleFeedback = async (useful: boolean) => {
    if (sending || feedbackSent !== null) return;

    setSending(true);
    try {
      await feedbackService.sendFeedback({
        query_id: queryId,
        query,
        useful,
        created_at: new Date().toISOString(),
      });
      setFeedbackSent(useful);
    } catch {
      // Feedback não é crítico: confirma ao usuário mesmo se o envio falhar.
      setFeedbackSent(useful);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="answer-feedback-box" role="region" aria-label="Avaliação da resposta">
      {feedbackSent !== null ? (
        <div className="feedback-confirmed">
          <Icon name="check" size={14} className="feedback-check-icon" />
          <span>Feedback registrado. Obrigado pela colaboração!</span>
        </div>
      ) : (
        <div className="feedback-prompt-row">
          <span className="feedback-question">Esta resposta foi útil?</span>
          <div className="feedback-buttons">
            <button
              type="button"
              className="btn-feedback"
              disabled={sending}
              onClick={() => handleFeedback(true)}
              aria-label="Sim, esta resposta foi útil"
            >
              <Icon name="thumbs-up" size={14} />
              <span>Sim</span>
            </button>
            <button
              type="button"
              className="btn-feedback"
              disabled={sending}
              onClick={() => handleFeedback(false)}
              aria-label="Não, esta resposta não foi útil"
            >
              <Icon name="thumbs-down" size={14} />
              <span>Não</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
