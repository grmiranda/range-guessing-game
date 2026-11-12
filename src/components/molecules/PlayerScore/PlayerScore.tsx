import classNames from '../../../utils/classNames'
import styles from './PlayerScore.module.scss'

interface PlayerScoreProps {
  name: string
  score: number
  isPsychic?: boolean
  highlight?: boolean
}

export default function PlayerScore({
  name,
  score,
  isPsychic = false,
  highlight = false,
}: PlayerScoreProps) {
  return (
    <div
      role="group"
      aria-label={`${name}: ${score} pontos`}
      className={classNames(
        styles['player-score'],
        highlight && styles['player-score--highlight'],
      )}
    >
      <span className={styles['player-score__name']}>{name}</span>
      <span className={styles['player-score__score']}>{score}</span>
      {isPsychic && <span className={styles['player-score__badge']}>Psíquico</span>}
    </div>
  )
}
