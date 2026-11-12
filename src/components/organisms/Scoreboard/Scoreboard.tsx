import type { Player, PlayerId } from '../../../types/game'
import PlayerScore from '../../molecules/PlayerScore/PlayerScore'
import styles from './Scoreboard.module.scss'

interface ScoreboardProps {
  players: [Player, Player]
  psychicId: PlayerId | null
  targetScore: number
}

export default function Scoreboard({ players, psychicId, targetScore }: ScoreboardProps) {
  return (
    <div className={styles.scoreboard}>
      <div className={styles.scoreboard__players}>
        {players.map((player) => {
          const isPsychic = player.id === psychicId
          return (
            <PlayerScore
              key={player.id}
              name={player.name}
              score={player.score}
              isPsychic={isPsychic}
              highlight={isPsychic}
            />
          )
        })}
      </div>
      <p className={styles.scoreboard__goal}>Meta: {targetScore} pontos</p>
    </div>
  )
}
