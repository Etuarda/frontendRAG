import { Icon, type IconName } from '../../components/ui/Icon';
import { ProjectSummaryPanel } from '../../components/project/ProjectSummaryPanel';

interface Principle {
  icon: IconName;
  title: string;
  text: string;
}

// Princípios de uso, sem detalhes de implementação do backend nem números próprios.
const PRINCIPLES: Principle[] = [
  {
    icon: 'compass',
    title: 'Respostas a partir do acervo oficial',
    text: 'Cada resposta é construída com trechos recuperados das bases oficiais listadas abaixo e indica as fontes utilizadas.',
  },
  {
    icon: 'shield',
    title: 'Recusa quando não há evidência',
    text: 'Se as fontes não sustentam uma resposta segura, o sistema recusa e explica o motivo, em vez de arriscar uma resposta.',
  },
  {
    icon: 'info',
    title: 'Nível de evidência visível',
    text: 'Toda resposta informa o nível de evidência (alto, moderado, baixo ou insuficiente) atribuído pelo servidor.',
  },
  {
    icon: 'thumbs-up',
    title: 'Avaliação de quem usa',
    text: 'Você pode avaliar cada resposta. As avaliações ficam registradas junto da consulta no histórico.',
  },
];

export function TransparenciaPage() {
  return (
    <div className="page-content-wrapper">
      <header className="page-header">
        <span className="page-eyebrow">TRANSPARÊNCIA DA IA</span>
        <h1 className="page-title">Transparência da IA</h1>
        <p className="page-description">
          Como as respostas são fundamentadas e quais dados compõem o acervo consultado.
        </p>
      </header>

      <div className="principles-grid">
        {PRINCIPLES.map((item) => (
          <section key={item.title} className="transparency-card">
            <div className="transparency-title-row">
              <Icon name={item.icon} size={20} />
              <h2>{item.title}</h2>
            </div>
            <p className="transparency-summary">{item.text}</p>
          </section>
        ))}
      </div>

      <ProjectSummaryPanel />
    </div>
  );
}
