import type { GameState } from '../types/game'
import useGameContext from './useGameContext'

export default function useGameState(): GameState {
  return useGameContext('useGameState').state
}
