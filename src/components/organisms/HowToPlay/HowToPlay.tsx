import Modal from '../Modal/Modal'
import styles from './HowToPlay.module.scss'

interface HowToPlayProps {
  isOpen: boolean
  onClose: () => void
}

const RULES = [
  'Sintonia é jogado por 2 jogadores.',
  'A cada rodada, um jogador é o Psíquico e o outro dá o palpite. Os papéis se alternam a cada rodada.',
  'O Psíquico gira a roleta, vê o alvo sozinho, esconde o alvo e dá uma dica falada sobre o espectro da rodada.',
  'Quem dá o palpite move o ponteiro até onde acha que está o alvo.',
  'Ao revelar o alvo: a faixa central vale 6 pontos, as faixas ao lado valem 4 e as faixas externas valem 2.',
  'O Psíquico ganha metade dos pontos do palpite.',
  'Vence quem atingir a meta primeiro com mais pontos. Se os dois empatarem na meta, a partida segue com rodadas de desempate.',
] as const

export default function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  return (
    <Modal isOpen={isOpen} title="Como jogar" onClose={onClose}>
      <ol className={styles['how-to-play']}>
        {RULES.map((rule) => (
          <li key={rule} className={styles['how-to-play__rule']}>
            {rule}
          </li>
        ))}
      </ol>
    </Modal>
  )
}
