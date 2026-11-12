import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GameProvider from '../../../context/GameProvider'
import { buildGameState, buildVictoryState, fixedRandom } from '../../../test/gameStates'
import type { GameState } from '../../../types/game'
import { createInitialState } from '../../../utils/game/gameReducer'
import ScreenRouter from './ScreenRouter'

function renderRouter(initialState: GameState) {
  return render(
    <GameProvider random={fixedRandom} initialState={initialState}>
      <ScreenRouter />
    </GameProvider>,
  )
}

describe('ScreenRouter', () => {
  it('mostra a tela inicial em setup', () => {
    renderRouter(createInitialState())
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
  })

  it('mostra a tela de jogo em game', () => {
    renderRouter(buildGameState())
    expect(screen.getByRole('heading', { name: 'Rodada 1' })).toBeInTheDocument()
  })

  it('mostra a tela de vitória em victory', () => {
    renderRouter(buildVictoryState())
    expect(screen.getByRole('heading', { level: 1, name: 'Fim de jogo' })).toBeInTheDocument()
  })
})
