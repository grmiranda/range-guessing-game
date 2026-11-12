import { createContext } from 'react'
import type { Dispatch } from 'react'
import type { GameState, RandomFn } from '../types/game'
import type { GameAction } from '../utils/game/gameReducer'

export interface GameContextValue {
  state: GameState
  dispatch: Dispatch<GameAction>
  random: RandomFn
}

export const GameContext = createContext<GameContextValue | null>(null)
