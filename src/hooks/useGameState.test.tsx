import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GameProvider from '../context/GameProvider'
import type { GameState } from '../types/game'
import { createInitialState } from '../utils/game/gameReducer'
import useGameContext from './useGameContext'
import useGameState from './useGameState'

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>
}

describe('fora do GameProvider', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('useGameState dispara erro', () => {
    expect(() => renderHook(() => useGameState())).toThrow(
      'useGameState deve ser usado dentro de GameProvider.',
    )
  })

  it('useGameContext dispara erro', () => {
    expect(() => renderHook(() => useGameContext())).toThrow(
      'useGameContext deve ser usado dentro de GameProvider.',
    )
  })
})

describe('useGameState', () => {
  it('retorna o estado inicial dentro do provider', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    expect(result.current).toEqual(createInitialState())
  })

  it('respeita a prop initialState', () => {
    const initialState: GameState = createInitialState(['Ana', 'Bia'], 20)
    const { result } = renderHook(() => useGameState(), {
      wrapper: ({ children }) => (
        <GameProvider initialState={initialState}>{children}</GameProvider>
      ),
    })
    expect(result.current).toBe(initialState)
  })
})

describe('useGameContext', () => {
  it('expõe state, dispatch e random', () => {
    const random = () => 0.5
    const { result } = renderHook(() => useGameContext(), {
      wrapper: ({ children }) => (
        <GameProvider random={random}>{children}</GameProvider>
      ),
    })
    expect(result.current.state).toEqual(createInitialState())
    expect(typeof result.current.dispatch).toBe('function')
    expect(result.current.random).toBe(random)
  })

  it('usa Math.random por padrão', () => {
    const { result } = renderHook(() => useGameContext(), { wrapper })
    expect(result.current.random).toBe(Math.random)
  })
})
