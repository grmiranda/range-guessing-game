import type { GuessPoints } from '../../../types/game'
import Button from '../../atoms/Button/Button'
import styles from './RevealPanel.module.scss'

interface RevealPanelProps {
  guesserName: string
  psychicName: string
  guesserPoints: GuessPoints
  psychicPoints: number
  nextLabel: string
  onNext: () => void
}

function formatPoints(points: number): string {
  return `${points} ${points === 1 ? 'ponto' : 'pontos'}`
}

export default function RevealPanel({
  guesserName,
  psychicName,
  guesserPoints,
  psychicPoints,
  nextLabel,
  onNext,
}: RevealPanelProps) {
  return (
    <section className={styles['reveal-panel']} aria-live="polite">
      {guesserPoints === 0 ? (
        <p className={styles['reveal-panel__miss']}>Errou o alvo! Ninguém pontuou.</p>
      ) : (
        <ul className={styles['reveal-panel__results']}>
          <li className={styles['reveal-panel__result']}>
            {`${guesserName} ganhou ${formatPoints(guesserPoints)}`}
          </li>
          <li className={styles['reveal-panel__result']}>
            {`${psychicName} (Psíquico) ganhou ${formatPoints(psychicPoints)}`}
          </li>
        </ul>
      )}
      <Button onClick={onNext}>{nextLabel}</Button>
    </section>
  )
}
