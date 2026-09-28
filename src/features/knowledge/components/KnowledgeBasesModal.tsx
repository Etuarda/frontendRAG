import { KNOWLEDGE_BASES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';

interface KnowledgeBasesModalProps {
  onClose: () => void;
}

export function KnowledgeBasesModal({ onClose }: KnowledgeBasesModalProps) {
  return (
    <Modal title="Bases de Conhecimento do Adaptive RAG" icon="database" onClose={onClose}>
      <p className="modal-intro">
        O roteador seleciona dinamicamente uma ou mais naturezas de evidência a cada consulta.
        As bases representam o acervo auditado de contratações do Estado do Rio de Janeiro:
      </p>
      <div className="knowledge-list">
        {KNOWLEDGE_BASES.map((base) => (
          <div className="knowledge-row" key={base.id}>
            <span className="knowledge-icon">
              <Icon name={base.icon} size={18} />
            </span>
            <div className="knowledge-info">
              <h3>{base.name}</h3>
              <p>{base.description}</p>
              <span className="knowledge-example-text">Exemplos: {base.examples}</span>
            </div>
            <span className="status-indicator-text">
              <span className="dot-indicator dot-success" /> Ativa no Roteador
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
