import { KNOWLEDGE_BASES } from '../../../domain/rag/catalog';
import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';

interface KnowledgeBasesModalProps { onClose: () => void; }

export function KnowledgeBasesModal({ onClose }: KnowledgeBasesModalProps) {
  return (
    <Modal title="Bases de conhecimento do Adaptive RAG" icon="database" onClose={onClose}>
      <p className="modal-intro">O roteador escolhe uma ou mais naturezas de evidência de acordo com a pergunta. As bases não são filtros manuais: fazem parte da estratégia adaptativa do pipeline.</p>
      <div className="knowledge-list">
        {KNOWLEDGE_BASES.map((base) => (
          <div className="knowledge-row" key={base.id}>
            <span className="knowledge-icon"><Icon name={base.icon} size={19} /></span>
            <div><h3>{base.name}</h3><p>{base.description}</p><small>{base.examples}</small></div>
            <span className="available-badge">Disponível</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
