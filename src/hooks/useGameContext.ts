import { useContext } from 'react'
import { GameContext } from '../context/gameContext'
import type { GameContextValue } from '../context/gameContext'

export default function useGameContext(
  hookName = 'useGameContext',
): GameContextValue {
  const context = useContext(GameContext)
  if (context === null) {
    throw new Error(`${hookName} deve ser usado dentro de GameProvider.`)
  }
  return context
}
