import useGameActions from '../../../hooks/useGameActions'
import useGameState from '../../../hooks/useGameState'
import useModal from '../../../hooks/useModal'
import Button from '../../atoms/Button/Button'
import Heading from '../../atoms/Heading/Heading'
import HowToPlay from '../../organisms/HowToPlay/HowToPlay'
import SetupForm from '../../organisms/SetupForm/SetupForm'
import ScreenTemplate from '../../templates/ScreenTemplate/ScreenTemplate'
import styles from './HomePage.module.scss'

export default function HomePage() {
  const { players, targetScore } = useGameState()
  const { startGame } = useGameActions()
  const howToPlay = useModal()

  const header = (
    <div className={styles['home-page__header']}>
      <div className={styles['home-page__title']}>
        <Heading level={1}>Sintonia</Heading>
        <p className={styles['home-page__subtitle']}>O jogo de sintonia entre duas pessoas</p>
      </div>
      <Button variant="secondary" onClick={howToPlay.open}>
        Como jogar
      </Button>
    </div>
  )

  return (
    <ScreenTemplate header={header}>
      <div className={styles['home-page__content']}>
        <SetupForm
          initialNames={[players[0].name, players[1].name]}
          initialTargetScore={targetScore}
          onSubmit={startGame}
        />
      </div>
      <HowToPlay isOpen={howToPlay.isOpen} onClose={howToPlay.close} />
    </ScreenTemplate>
  )
}
