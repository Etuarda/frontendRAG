import { LOADING_STEPS } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';

interface ProcessingStatusProps {
  step: number;
}

export function ProcessingStatus({ step }: ProcessingStatusProps) {
  const progress = ((Math.min(step, LOADING_STEPS.length - 1) + 1) / LOADING_STEPS.length) * 100;

  return (
    <section className="processing-card" aria-live="polite">
      <div className="processing-icon"><Icon name="refresh" size={25} /></div>
      <div>
        <h2>Processando consulta</h2>
        <p>{LOADING_STEPS[step] ?? LOADING_STEPS.at(-1)}</p>
      </div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
    </section>
  );
}
