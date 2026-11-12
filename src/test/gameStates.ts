import type { GameState, RandomFn, RoundPhase, Spectrum } from '../types/game'
import { createInitialState, gameReducer } from '../utils/game/gameReducer'

export const TEST_DECK: Spectrum[] = [
  { left: 'Quente', right: 'Frio' },
  { left: 'Chato', right: 'Divertido' },
  { left: 'Impopular', right: 'Popular' },
]

export const fixedRandom: RandomFn = () => 0.5

interface BuildOptions {
  names?: [string, string]
  targetScore?: number
  phase?: RoundPhase
  targetAngle?: number
  guessAngle?: number
}

const PHASE_ORDER: RoundPhase[] = [
  'psychicHandoff',
  'psychicView',
  'guessHandoff',
  'guessing',
  'reveal',
]

export function buildGameState({
  names = ['Ana', 'Bruno'],
  targetScore = 10,
  phase = 'psychicHandoff',
  targetAngle = 90,
  guessAngle = 90,
}: BuildOptions = {}): GameState {
  let state = gameReducer(createInitialState(), {
    type: 'START_GAME',
    names,
    targetScore,
    deck: TEST_DECK,
  })
  const steps = PHASE_ORDER.indexOf(phase)
  if (steps >= 1) state = gameReducer(state, { type: 'SPIN_TARGET', targetAngle })
  if (steps >= 2) state = gameReducer(state, { type: 'HIDE_TARGET' })
  if (steps >= 3) {
    state = gameReducer(state, { type: 'START_GUESS' })
    state = gameReducer(state, { type: 'SET_GUESS', angle: guessAngle })
  }
  if (steps >= 4) state = gameReducer(state, { type: 'SUBMIT_GUESS' })
  return state
}

export function buildVictoryState(): GameState {
  const reveal = buildGameState({ targetScore: 5, phase: 'reveal' })
  return gameReducer(reveal, { type: 'NEXT_ROUND', reshuffledDeck: TEST_DECK })
}
