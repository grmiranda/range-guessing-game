import type { ReactNode } from 'react'
import useGameActions from '../../../hooks/useGameActions'
import useGameState from '../../../hooks/useGameState'
import useModal from '../../../hooks/useModal'
import { getGuesserId } from '../../../utils/game/gameReducer'
import { resolveWinner } from '../../../utils/game/victory'
import Button from '../../atoms/Button/Button'
import Heading from '../../atoms/Heading/Heading'
import SpectrumLabels from '../../molecules/SpectrumLabels/SpectrumLabels'
import ConfirmDialog from '../../organisms/ConfirmDialog/ConfirmDialog'
import Dial from '../../organisms/Dial/Dial'
import GuessControl from '../../organisms/GuessControl/GuessControl'
import HandoffPanel from '../../organisms/HandoffPanel/HandoffPanel'
import HowToPlay from '../../organisms/HowToPlay/HowToPlay'
import RevealPanel from '../../organisms/RevealPanel/RevealPanel'
import Scoreboard from '../../organisms/Scoreboard/Scoreboard'
import ScreenTemplate from '../../templates/ScreenTemplate/ScreenTemplate'
import styles from './GamePage.module.scss'

interface PhaseView {
  content: ReactNode
  aside?: ReactNode
}

export default function GamePage() {
  const { players, targetScore, round, isTiebreak } = useGameState()
  const actions = useGameActions()
  const howToPlay = useModal()
  const abortDialog = useModal()

  if (round === null) return null

  const psychic = players[round.psychicId]
  const guesser = players[getGuesserId(round.psychicId)]

  const renderBoard = (showTarget: boolean, guessAngle: number | null) => (
    <div className={styles['game-page__board']}>
      <SpectrumLabels spectrum={round.spectrum} />
      <Dial targetAngle={round.targetAngle} showTarget={showTarget} guessAngle={guessAngle} />
    </div>
  )

  const getPhaseView = (): PhaseView => {
    switch (round.phase) {
      case 'psychicHandoff':
        return {
          content: (
            <HandoffPanel playerName={psychic.name} role="psychic" onConfirm={actions.spinTarget} />
          ),
        }
      case 'psychicView':
        return {
          content: renderBoard(true, null),
          aside: (
            <>
              <p className={styles['game-page__instruction']}>
                Memorize o alvo e pense em uma dica para {guesser.name}.
              </p>
              <Button fullWidth onClick={actions.hideTarget}>
                Esconder alvo
              </Button>
            </>
          ),
        }
      case 'guessHandoff':
        return {
          content: (
            <HandoffPanel playerName={guesser.name} role="guesser" onConfirm={actions.startGuess} />
          ),
        }
      case 'guessing':
        return {
          content: renderBoard(false, round.guessAngle),
          aside: (
            <>
              <GuessControl
                value={round.guessAngle}
                onChange={actions.setGuess}
                leftLabel={round.spectrum.left}
                rightLabel={round.spectrum.right}
              />
              <Button fullWidth onClick={actions.submitGuess}>
                Confirmar palpite
              </Button>
            </>
          ),
        }
      case 'reveal':
        return {
          content: renderBoard(true, round.guessAngle),
          aside: (
            <RevealPanel
              guesserName={guesser.name}
              psychicName={psychic.name}
              guesserPoints={round.guesserPoints ?? 0}
              psychicPoints={round.psychicPoints ?? 0}
              nextLabel={
                resolveWinner(players, targetScore) === null ? 'Próxima rodada' : 'Ver resultado'
              }
              onNext={actions.nextRound}
            />
          ),
        }
    }
  }

  const handleAbort = () => {
    abortDialog.close()
    actions.abortGame()
  }

  const { content, aside } = getPhaseView()

  const header = (
    <div className={styles['game-page__header']}>
      <div className={styles['game-page__round']}>
        <Heading level={2}>Rodada {round.number}</Heading>
        {isTiebreak && (
          <span role="status" className={styles['game-page__badge']}>
            Desempate!
          </span>
        )}
      </div>
      <div className={styles['game-page__scoreboard']}>
        <Scoreboard players={players} psychicId={round.psychicId} targetScore={targetScore} />
      </div>
      <div className={styles['game-page__actions']}>
        <Button variant="secondary" onClick={howToPlay.open}>
          Como jogar
        </Button>
        <Button variant="danger" onClick={abortDialog.open}>
          Encerrar partida
        </Button>
      </div>
    </div>
  )

  return (
    <ScreenTemplate header={header} aside={aside}>
      {content}
      <HowToPlay isOpen={howToPlay.isOpen} onClose={howToPlay.close} />
      <ConfirmDialog
        isOpen={abortDialog.isOpen}
        title="Encerrar partida?"
        message="O placar atual será perdido e vocês voltarão para a tela inicial."
        confirmLabel="Encerrar"
        onConfirm={handleAbort}
        onCancel={abortDialog.close}
      />
    </ScreenTemplate>
  )
}
