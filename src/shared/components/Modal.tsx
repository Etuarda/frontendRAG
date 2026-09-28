import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  title: string;
  icon: 'database' | 'shield';
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, icon, children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title"><Icon name={icon} size={19} /><h2>{title}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar"><Icon name="x" size={19} /></button>
        </header>
        <div className="modal-content">{children}</div>
        <footer className="modal-footer"><button className="primary-action compact" type="button" onClick={onClose}>Fechar painel</button></footer>
      </section>
    </div>
  );
}
