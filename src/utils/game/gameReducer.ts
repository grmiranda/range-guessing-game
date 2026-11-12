import { DEFAULT_TARGET_SCORE, DIAL_CENTER } from '../../constants/game'
import type {
  GameState,
  Player,
  PlayerId,
  Round,
  RoundPhase,
  Spectrum,
} from '../../types/game'
import { getGuessPoints, getPsychicPoints } from './scoring'
import { clampAngle } from './target'
import { hasSetupErrors, normalizeName, validateSetup } from './validation'
import { isTiebreak, resolveWinner } from './victory'

export type GameAction =
  | {
      type: 'START_GAME'
      names: [string, string]
      targetScore: number
      deck: Spectrum[]
    }
  | { type: 'SPIN_TARGET'; targetAngle: number }
  | { type: 'HIDE_TARGET' }
  | { type: 'START_GUESS' }
  | { type: 'SET_GUESS'; angle: number }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'NEXT_ROUND'; reshuffledDeck: Spectrum[] }
  | { type: 'RESTART' }
  | { type: 'ABORT_GAME' }

export function createInitialState(
  names: [string, string] = ['', ''],
  targetScore: number = DEFAULT_TARGET_SCORE,
): GameState {
  return {
    screen: 'setup',
    players: [
      { id: 0, name: names[0], score: 0 },
      { id: 1, name: names[1], score: 0 },
    ],
    targetScore,
    round: null,
    spectrumDeck: [],
    winnerId: null,
    isTiebreak: false,
  }
}

export function getGuesserId(psychicId: PlayerId): PlayerId {
  return psychicId === 0 ? 1 : 0
}

function createRound(
  number: number,
  psychicId: PlayerId,
  spectrum: Spectrum,
): Round {
  return {
    number,
    psychicId,
    phase: 'psychicHandoff',
    spectrum,
    targetAngle: null,
    guessAngle: DIAL_CENTER,
    guesserPoints: null,
    psychicPoints: null,
  }
}

function getPlayerNames(state: GameState): [string, string] {
  return [state.players[0].name, state.players[1].name]
}

function getActiveRound(state: GameState, phase: RoundPhase): Round | null {
  if (state.screen !== 'game' || state.round === null) return null
  return state.round.phase === phase ? state.round : null
}

function startGame(
  state: GameState,
  names: [string, string],
  targetScore: number,
  deck: readonly Spectrum[],
): GameState {
  if (state.screen !== 'setup') return state
  const normalized: [string, string] = [
    normalizeName(names[0]),
    normalizeName(names[1]),
  ]
  if (hasSetupErrors(validateSetup(normalized, targetScore))) return state
  if (deck.length === 0) return state

  const [spectrum, ...rest] = deck
  return {
    screen: 'game',
    players: [
      { id: 0, name: normalized[0], score: 0 },
      { id: 1, name: normalized[1], score: 0 },
    ],
    targetScore,
    round: createRound(1, 0, spectrum),
    spectrumDeck: rest,
    winnerId: null,
    isTiebreak: false,
  }
}

function submitGuess(state: GameState): GameState {
  const round = getActiveRound(state, 'guessing')
  if (round === null || round.targetAngle === null) return state

  const guesserPoints = getGuessPoints(round.targetAngle, round.guessAngle)
  const psychicPoints = getPsychicPoints(guesserPoints)
  const addPoints = (player: Player): Player => ({
    ...player,
    score:
      player.score +
      (player.id === round.psychicId ? psychicPoints : guesserPoints),
  })

  return {
    ...state,
    players: [addPoints(state.players[0]), addPoints(state.players[1])],
    round: { ...round, phase: 'reveal', guesserPoints, psychicPoints },
  }
}

function nextRound(
  state: GameState,
  reshuffledDeck: readonly Spectrum[],
): GameState {
  const round = getActiveRound(state, 'reveal')
  if (round === null) return state

  const winnerId = resolveWinner(state.players, state.targetScore)
  if (winnerId !== null) {
    return { ...state, screen: 'victory', winnerId, isTiebreak: false }
  }

  const deck = state.spectrumDeck.length > 0 ? state.spectrumDeck : reshuffledDeck
  if (deck.length === 0) return state

  const [spectrum, ...rest] = deck
  return {
    ...state,
    round: createRound(round.number + 1, getGuesserId(round.psychicId), spectrum),
    spectrumDeck: rest,
    isTiebreak: isTiebreak(state.players, state.targetScore),
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return startGame(state, action.names, action.targetScore, action.deck)
    case 'SPIN_TARGET': {
      const round = getActiveRound(state, 'psychicHandoff')
      if (round === null) return state
      return {
        ...state,
        round: {
          ...round,
          phase: 'psychicView',
          targetAngle: clampAngle(action.targetAngle),
        },
      }
    }
    case 'HIDE_TARGET': {
      const round = getActiveRound(state, 'psychicView')
      if (round === null) return state
      return { ...state, round: { ...round, phase: 'guessHandoff' } }
    }
    case 'START_GUESS': {
      const round = getActiveRound(state, 'guessHandoff')
      if (round === null) return state
      return { ...state, round: { ...round, phase: 'guessing' } }
    }
    case 'SET_GUESS': {
      const round = getActiveRound(state, 'guessing')
      if (round === null) return state
      return {
        ...state,
        round: { ...round, guessAngle: clampAngle(action.angle) },
      }
    }
    case 'SUBMIT_GUESS':
      return submitGuess(state)
    case 'NEXT_ROUND':
      return nextRound(state, action.reshuffledDeck)
    case 'RESTART':
      if (state.screen !== 'victory') return state
      return createInitialState(getPlayerNames(state), state.targetScore)
    case 'ABORT_GAME':
      if (state.screen !== 'game') return state
      return createInitialState(getPlayerNames(state), state.targetScore)
  }
}
