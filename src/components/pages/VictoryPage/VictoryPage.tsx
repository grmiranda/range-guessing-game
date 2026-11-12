import useGameActions from '../../../hooks/useGameActions'
import useGameState from '../../../hooks/useGameState'
import Button from '../../atoms/Button/Button'
import Heading from '../../atoms/Heading/Heading'
import Scoreboard from '../../organisms/Scoreboard/Scoreboard'
import ScreenTemplate from '../../templates/ScreenTemplate/ScreenTemplate'
import styles from './VictoryPage.module.scss'

export default function VictoryPage() {
  const { players, targetScore, winnerId } = useGameState()
  const { restart } = useGameActions()

  if (winnerId === null) return null

  const winner = players[winnerId]

  return (
    <ScreenTemplate header={<Heading level={1} align="center">Fim de jogo</Heading>}>
      <div className={styles['victory-page']}>
        <p className={styles['victory-page__winner']}>{winner.name} venceu!</p>
        <Scoreboard players={players} psychicId={null} targetScore={targetScore} />
        <Button onClick={restart}>Jogar novamente</Button>
      </div>
    </ScreenTemplate>
  )
}
