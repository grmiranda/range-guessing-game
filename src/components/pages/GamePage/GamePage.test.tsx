import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import GameProvider from '../../../context/GameProvider'
import { buildGameState, fixedRandom } from '../../../test/gameStates'
import type { GameState } from '../../../types/game'
import { createInitialState } from '../../../utils/game/gameReducer'
import ScreenRouter from '../ScreenRouter/ScreenRouter'
import GamePage from './GamePage'

function renderWith(initialState: GameState, ui: ReactNode = <GamePage />) {
  return render(
    <GameProvider random={fixedRandom} initialState={initialState}>
      {ui}
    </GameProvider>,
  )
}

function getTargetZone(container: HTMLElement) {
  return container.querySelector('.dial__zone--six')
}

describe('GamePage', () => {
  it('não renderiza nada sem rodada', () => {
    const { container } = renderWith(createInitialState())
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra o cabeçalho com rodada, placar e ações', () => {
    renderWith(buildGameState())
    expect(screen.getByRole('heading', { name: 'Rodada 1' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ana: 0 pontos' })).toHaveTextContent('Psíquico')
    expect(screen.getByRole('group', { name: 'Bruno: 0 pontos' })).not.toHaveTextContent(
      'Psíquico',
    )
    expect(screen.getByText('Meta: 10 pontos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Como jogar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encerrar partida' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('mostra o aviso de desempate', () => {
    renderWith({ ...buildGameState(), isTiebreak: true })
    expect(screen.getByRole('status')).toHaveTextContent('Desempate!')
  })

  it('psychicHandoff: pede o aparelho para o Psíquico sem mostrar o alvo', async () => {
    const user = userEvent.setup()
    const { container } = renderWith(buildGameState())
    expect(
      screen.getByRole('heading', { name: 'Passe o aparelho para Ana' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /Roleta/ })).not.toBeInTheDocument()
    expect(getTargetZone(container)).toBeNull()
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Girar roleta' }))
    expect(screen.getByRole('img', { name: 'Roleta, alvo visível' })).toBeInTheDocument()
    expect(getTargetZone(container)).not.toBeNull()
  })

  it('psychicView: mostra o alvo e a instrução para esconder', async () => {
    const user = userEvent.setup()
    const { container } = renderWith(buildGameState({ phase: 'psychicView' }))
    expect(screen.getByRole('group', { name: 'Espectro: Quente a Frio' })).toBeInTheDocument()
    expect(getTargetZone(container)).not.toBeNull()
    const aside = screen.getByRole('complementary')
    expect(aside).toHaveTextContent('Memorize o alvo e pense em uma dica para Bruno.')

    await user.click(within(aside).getByRole('button', { name: 'Esconder alvo' }))
    expect(
      screen.getByRole('heading', { name: 'Passe o aparelho para Bruno' }),
    ).toBeInTheDocument()
    expect(getTargetZone(container)).toBeNull()
  })

  it('guessHandoff: pede o aparelho para quem dá o palpite sem mostrar o alvo', async () => {
    const user = userEvent.setup()
    const { container } = renderWith(buildGameState({ phase: 'guessHandoff' }))
    expect(
      screen.getByRole('heading', { name: 'Passe o aparelho para Bruno' }),
    ).toBeInTheDocument()
    expect(getTargetZone(container)).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Estou pronto' }))
    expect(screen.getByRole('slider', { name: 'Posição do ponteiro' })).toBeInTheDocument()
  })

  it('guessing: move o ponteiro sem mostrar o alvo e confirma o palpite', async () => {
    const user = userEvent.setup()
    const { container } = renderWith(buildGameState({ phase: 'guessing' }))
    expect(getTargetZone(container)).toBeNull()
    expect(screen.getByRole('img', { name: 'Roleta, ponteiro em 90°' })).toBeInTheDocument()

    const slider = screen.getByRole('slider', { name: 'Posição do ponteiro' })
    expect(slider).toHaveValue('90')
    fireEvent.change(slider, { target: { value: '80' } })
    expect(slider).toHaveValue('80')
    expect(screen.getByRole('img', { name: 'Roleta, ponteiro em 80°' })).toBeInTheDocument()
    expect(getTargetZone(container)).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Confirmar palpite' }))
    expect(screen.getByText('Bruno ganhou 4 pontos')).toBeInTheDocument()
    expect(screen.getByText('Ana (Psíquico) ganhou 2 pontos')).toBeInTheDocument()
    expect(getTargetZone(container)).not.toBeNull()
  })

  it('reveal: mostra os pontos e avança para a próxima rodada', async () => {
    const user = userEvent.setup()
    const { container } = renderWith(buildGameState({ phase: 'reveal' }))
    expect(getTargetZone(container)).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Roleta, alvo visível, ponteiro em 90°' })).toBeInTheDocument()
    expect(screen.getByText('Bruno ganhou 6 pontos')).toBeInTheDocument()
    expect(screen.getByText('Ana (Psíquico) ganhou 3 pontos')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Próxima rodada' }))
    expect(screen.getByRole('heading', { name: 'Rodada 2' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Passe o aparelho para Bruno' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Bruno: 6 pontos' })).toHaveTextContent('Psíquico')
  })

  it('reveal: mostra Ver resultado quando há vencedor', () => {
    renderWith(buildGameState({ phase: 'reveal', targetScore: 5 }))
    expect(screen.getByRole('button', { name: 'Ver resultado' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próxima rodada' })).not.toBeInTheDocument()
  })

  it('reveal: mostra o erro quando ninguém pontua', () => {
    renderWith(buildGameState({ phase: 'reveal', guessAngle: 0 }))
    expect(screen.getByText('Errou o alvo! Ninguém pontuou.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima rodada' })).toBeInTheDocument()
  })

  it('abre o Como jogar', async () => {
    const user = userEvent.setup()
    renderWith(buildGameState())
    await user.click(screen.getByRole('button', { name: 'Como jogar' }))
    expect(screen.getByRole('dialog', { name: 'Como jogar' })).toBeInTheDocument()
  })

  it('encerra a partida após confirmar e volta para o início', async () => {
    const user = userEvent.setup()
    renderWith(buildGameState({ phase: 'guessing' }), <ScreenRouter />)
    await user.click(screen.getByRole('button', { name: 'Encerrar partida' }))
    const dialog = screen.getByRole('dialog', { name: 'Encerrar partida?' })
    expect(dialog).toHaveTextContent(
      'O placar atual será perdido e vocês voltarão para a tela inicial.',
    )

    await user.click(within(dialog).getByRole('button', { name: 'Encerrar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
    expect(screen.getByLabelText('Jogador 1')).toHaveValue('Ana')
    expect(screen.getByLabelText('Jogador 2')).toHaveValue('Bruno')
  })

  it('mantém a partida ao cancelar o encerramento', async () => {
    const user = userEvent.setup()
    renderWith(buildGameState({ phase: 'guessing' }), <ScreenRouter />)
    await user.click(screen.getByRole('button', { name: 'Encerrar partida' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Rodada 1' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Posição do ponteiro' })).toBeInTheDocument()
  })
})
