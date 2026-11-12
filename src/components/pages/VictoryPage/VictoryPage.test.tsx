import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import GameProvider from '../../../context/GameProvider'
import { buildGameState, buildVictoryState, fixedRandom } from '../../../test/gameStates'
import type { GameState } from '../../../types/game'
import ScreenRouter from '../ScreenRouter/ScreenRouter'
import VictoryPage from './VictoryPage'

function renderWith(initialState: GameState, ui: ReactNode = <VictoryPage />) {
  return render(
    <GameProvider random={fixedRandom} initialState={initialState}>
      {ui}
    </GameProvider>,
  )
}

describe('VictoryPage', () => {
  it('não renderiza nada sem vencedor', () => {
    const { container } = renderWith(buildGameState())
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra o vencedor e o placar final', () => {
    renderWith(buildVictoryState())
    expect(screen.getByRole('heading', { level: 1, name: 'Fim de jogo' })).toBeInTheDocument()
    expect(screen.getByText('Bruno venceu!')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Bruno: 6 pontos' })).not.toHaveTextContent(
      'Psíquico',
    )
    expect(screen.getByRole('group', { name: 'Ana: 3 pontos' })).not.toHaveTextContent(
      'Psíquico',
    )
    expect(screen.getByText('Meta: 5 pontos')).toBeInTheDocument()
  })

  it('volta para o início com os nomes preenchidos ao jogar novamente', async () => {
    const user = userEvent.setup()
    renderWith(buildVictoryState(), <ScreenRouter />)
    await user.click(screen.getByRole('button', { name: 'Jogar novamente' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
    expect(screen.getByLabelText('Jogador 1')).toHaveValue('Ana')
    expect(screen.getByLabelText('Jogador 2')).toHaveValue('Bruno')
    expect(screen.getByLabelText('Pontos para vencer')).toHaveValue(5)
  })
})
