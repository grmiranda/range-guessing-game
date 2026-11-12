import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GameProvider from '../context/GameProvider'
import type { GameState, RandomFn } from '../types/game'
import { createDeck } from '../utils/game/spectrumDeck'
import { spinTarget } from '../utils/game/target'
import useGameActions from './useGameActions'
import useGameState from './useGameState'

const random: RandomFn = () => 0.5

function renderGame(initialState?: GameState) {
  return renderHook(
    () => ({ state: useGameState(), actions: useGameActions() }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameProvider random={random} initialState={initialState}>
          {children}
        </GameProvider>
      ),
    },
  )
}

describe('useGameActions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('dispara erro fora do GameProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useGameActions())).toThrow(
      'useGameActions deve ser usado dentro de GameProvider.',
    )
  })

  it('joga uma rodada completa e passa para a próxima', () => {
    const { result } = renderGame()
    const deck = createDeck(random)

    act(() => result.current.actions.startGame(['Ana', 'Bia'], 10))
    expect(result.current.state.screen).toBe('game')
    expect(result.current.state.round?.number).toBe(1)
    expect(result.current.state.round?.phase).toBe('psychicHandoff')
    expect(result.current.state.round?.psychicId).toBe(0)
    expect(result.current.state.round?.spectrum).toEqual(deck[0])
    expect(result.current.state.players.map((p) => p.name)).toEqual([
      'Ana',
      'Bia',
    ])

    act(() => result.current.actions.spinTarget())
    expect(result.current.state.round?.phase).toBe('psychicView')
    expect(result.current.state.round?.targetAngle).toBe(spinTarget(random))

    act(() => result.current.actions.hideTarget())
    expect(result.current.state.round?.phase).toBe('guessHandoff')

    act(() => result.current.actions.startGuess())
    expect(result.current.state.round?.phase).toBe('guessing')

    act(() => result.current.actions.setGuess(100))
    expect(result.current.state.round?.guessAngle).toBe(100)

    act(() => result.current.actions.submitGuess())
    expect(result.current.state.round?.phase).toBe('reveal')
    expect(result.current.state.round?.guesserPoints).toBe(4)
    expect(result.current.state.round?.psychicPoints).toBe(2)
    expect(result.current.state.players.map((p) => p.score)).toEqual([2, 4])

    act(() => result.current.actions.nextRound())
    expect(result.current.state.round?.number).toBe(2)
    expect(result.current.state.round?.psychicId).toBe(1)
    expect(result.current.state.round?.phase).toBe('psychicHandoff')
    expect(result.current.state.round?.spectrum).toEqual(deck[1])
  })

  it('abortGame volta ao setup mantendo os nomes', () => {
    const { result } = renderGame()

    act(() => result.current.actions.startGame(['Ana', 'Bia'], 15))
    act(() => result.current.actions.abortGame())

    expect(result.current.state.screen).toBe('setup')
    expect(result.current.state.round).toBeNull()
    expect(result.current.state.targetScore).toBe(15)
    expect(result.current.state.players).toEqual([
      { id: 0, name: 'Ana', score: 0 },
      { id: 1, name: 'Bia', score: 0 },
    ])
  })

  it('restart a partir da vitória volta ao setup', () => {
    const victory: GameState = {
      screen: 'victory',
      players: [
        { id: 0, name: 'Ana', score: 12 },
        { id: 1, name: 'Bia', score: 7 },
      ],
      targetScore: 10,
      round: null,
      spectrumDeck: [],
      winnerId: 0,
      isTiebreak: false,
    }
    const { result } = renderGame(victory)

    act(() => result.current.actions.restart())

    expect(result.current.state.screen).toBe('setup')
    expect(result.current.state.winnerId).toBeNull()
    expect(result.current.state.targetScore).toBe(10)
    expect(result.current.state.players).toEqual([
      { id: 0, name: 'Ana', score: 0 },
      { id: 1, name: 'Bia', score: 0 },
    ])
  })

  it('mantém a identidade das ações entre renderizações', () => {
    const { result, rerender } = renderGame()
    const first = result.current.actions

    act(() => result.current.actions.startGame(['Ana', 'Bia'], 10))
    rerender()

    expect(result.current.actions).toBe(first)
  })
})
