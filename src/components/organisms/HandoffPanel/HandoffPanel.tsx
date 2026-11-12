import Button from '../../atoms/Button/Button'
import Heading from '../../atoms/Heading/Heading'
import styles from './HandoffPanel.module.scss'

interface HandoffPanelProps {
  playerName: string
  role: 'psychic' | 'guesser'
  onConfirm: () => void
}

const ROLE_CONTENT = {
  psychic: {
    description:
      'Você é o Psíquico desta rodada. Gire a roleta e veja o alvo sem mostrar para o outro jogador.',
    action: 'Girar roleta',
  },
  guesser: {
    description: 'Ouça a dica do Psíquico e posicione o ponteiro onde acha que está o alvo.',
    action: 'Estou pronto',
  },
} as const

export default function HandoffPanel({ playerName, role, onConfirm }: HandoffPanelProps) {
  const content = ROLE_CONTENT[role]
  return (
    <section className={styles['handoff-panel']}>
      <Heading level={2} align="center">
        Passe o aparelho para {playerName}
      </Heading>
      <p className={styles['handoff-panel__description']}>{content.description}</p>
      <Button onClick={onConfirm}>{content.action}</Button>
    </section>
  )
}
