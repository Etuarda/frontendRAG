import { Icon } from '../../../shared/components/Icon';
import { Modal } from '../../../shared/components/Modal';

interface GuardrailsModalProps { onClose: () => void; }

const RULES = [
  ['Limite de escopo', 'Perguntas sem cobertura no corpus podem ser recusadas em vez de respondidas com conhecimento externo.'],
  ['Evidência insuficiente', 'Quando a recuperação não sustenta uma resposta, o sistema sinaliza a insuficiência de evidências.'],
  ['Juízo de fraude ou ilegalidade', 'O sistema apresenta documentos e fatos recuperados, mas não conclui fraude ou ilegalidade de um contrato específico.'],
  ['Proteção de informação sensível', 'Consultas envolvendo credenciais e dados bancários de fornecedores entram nas regras de recusa previstas pelo pipeline.'],
] as const;

export function GuardrailsModal({ onClose }: GuardrailsModalProps) {
  return (
    <Modal title="Guardrails e limites da resposta" icon="shield" onClose={onClose}>
      <p className="modal-intro">Os guardrails reduzem respostas fora do objetivo do sistema e deixam explícito quando o corpus não oferece suporte suficiente.</p>
      <div className="guardrail-list">
        {RULES.map(([title, description]) => (
          <div className="guardrail-row" key={title}>
            <span><Icon name="check" size={15} /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
