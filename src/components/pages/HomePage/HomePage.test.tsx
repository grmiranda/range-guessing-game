import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import GameProvider from '../../../context/GameProvider'
import useGameState from '../../../hooks/useGameState'
import { fixedRandom } from '../../../test/gameStates'
import type { GameState } from '../../../types/game'
import { createInitialState } from '../../../utils/game/gameReducer'
import HomePage from './HomePage'

function StateProbe() {
  const { screen: current, players, targetScore } = useGameState()
  return (
    <output data-testid="probe">
      {`${current}|${players[0].name}|${players[1].name}|${targetScore}`}
    </output>
  )
}

function renderHome(initialState: GameState = createInitialState()) {
  return render(
    <GameProvider random={fixedRandom} initialState={initialState}>
      <HomePage />
      <StateProbe />
    </GameProvider>,
  )
}

describe('HomePage', () => {
  it('mostra o título, o subtítulo e o formulário', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
    expect(screen.getByText('O jogo de sintonia entre duas pessoas')).toBeInTheDocument()
    expect(screen.getByLabelText('Jogador 1')).toHaveValue('')
    expect(screen.getByLabelText('Pontos para vencer')).toHaveValue(10)
  })

  it('preenche os nomes e a meta a partir do estado', () => {
    renderHome(createInitialState(['Ana', 'Bruno'], 15))
    expect(screen.getByLabelText('Jogador 1')).toHaveValue('Ana')
    expect(screen.getByLabelText('Jogador 2')).toHaveValue('Bruno')
    expect(screen.getByLabelText('Pontos para vencer')).toHaveValue(15)
  })

  it('inicia a partida ao enviar o formulário', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.type(screen.getByLabelText('Jogador 1'), 'Ana')
    await user.type(screen.getByLabelText('Jogador 2'), 'Bruno')
    await user.click(screen.getByRole('button', { name: 'Começar partida' }))
    expect(screen.getByTestId('probe')).toHaveTextContent('game|Ana|Bruno|10')
  })

  it('abre e fecha o Como jogar', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.click(screen.getByRole('button', { name: 'Como jogar' }))
    expect(screen.getByRole('dialog', { name: 'Como jogar' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
