import { useMemo } from 'react'
import { createDeck } from '../utils/game/spectrumDeck'
import { spinTarget } from '../utils/game/target'
import useGameContext from './useGameContext'

export interface GameActions {
  startGame: (names: [string, string], targetScore: number) => void
  spinTarget: () => void
  hideTarget: () => void
  startGuess: () => void
  setGuess: (angle: number) => void
  submitGuess: () => void
  nextRound: () => void
  restart: () => void
  abortGame: () => void
}

export default function useGameActions(): GameActions {
  const { dispatch, random } = useGameContext('useGameActions')

  return useMemo<GameActions>(
    () => ({
      startGame: (names, targetScore) =>
        dispatch({
          type: 'START_GAME',
          names,
          targetScore,
          deck: createDeck(random),
        }),
      spinTarget: () =>
        dispatch({ type: 'SPIN_TARGET', targetAngle: spinTarget(random) }),
      hideTarget: () => dispatch({ type: 'HIDE_TARGET' }),
      startGuess: () => dispatch({ type: 'START_GUESS' }),
      setGuess: (angle) => dispatch({ type: 'SET_GUESS', angle }),
      submitGuess: () => dispatch({ type: 'SUBMIT_GUESS' }),
      nextRound: () =>
        dispatch({ type: 'NEXT_ROUND', reshuffledDeck: createDeck(random) }),
      restart: () => dispatch({ type: 'RESTART' }),
      abortGame: () => dispatch({ type: 'ABORT_GAME' }),
    }),
    [dispatch, random],
  )
}
