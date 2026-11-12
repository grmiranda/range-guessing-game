import { useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { GameState, RandomFn } from '../types/game'
import { createInitialState, gameReducer } from '../utils/game/gameReducer'
import { GameContext } from './gameContext'
import type { GameContextValue } from './gameContext'

interface GameProviderProps {
  children: ReactNode
  random?: RandomFn
  initialState?: GameState
}

export default function GameProvider({
  children,
  random = Math.random,
  initialState,
}: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState ?? createInitialState(),
  )

  const value = useMemo<GameContextValue>(
    () => ({ state, dispatch, random }),
    [state, random],
  )

  return <GameContext value={value}>{children}</GameContext>
}
