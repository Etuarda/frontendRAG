import { apiClient } from './api';
import type { FeedbackPayload } from '../types';

class FeedbackService {
  /**
   * Envia a avaliação da resposta (POST /api/v1/feedback).
   */
  async sendFeedback(payload: FeedbackPayload): Promise<{ success: boolean; message: string }> {
    try {
      const data = await apiClient<{ success?: boolean; message?: string }>('/api/v1/feedback', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          created_at: payload.created_at || new Date().toISOString(),
        }),
      });

      return {
        success: data.success !== false,
        message: data.message || 'Feedback registrado.',
      };
    } catch {
      // Feedback é opcional: falha de rede não deve virar erro para o usuário.
      return {
        success: true,
        message: 'Feedback registrado.',
      };
    }
  }
}

export const feedbackService = new FeedbackService();
