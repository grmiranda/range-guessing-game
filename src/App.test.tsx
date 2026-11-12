import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

async function playRound(
  user: UserEvent,
  { psychic, guesser, guess }: { psychic: string; guesser: string; guess: number },
) {
  expect(screen.getByRole('heading', { name: `Passe o aparelho para ${psychic}` })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Girar roleta' }))
  expect(screen.getByText(`Memorize o alvo e pense em uma dica para ${guesser}.`)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Esconder alvo' }))
  expect(screen.getByRole('heading', { name: `Passe o aparelho para ${guesser}` })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Estou pronto' }))
  fireEvent.change(screen.getByRole('slider', { name: 'Posição do ponteiro' }), {
    target: { value: String(guess) },
  })
  await user.click(screen.getByRole('button', { name: 'Confirmar palpite' }))
}

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mostra erros de validação com nomes vazios', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Começar partida' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.getAllByText('Informe o nome do jogador.')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
  })

  it('joga uma partida completa até a vitória e reinicia', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Jogador 1'), 'Ana')
    await user.type(screen.getByLabelText('Jogador 2'), 'Bruno')
    const targetInput = screen.getByLabelText('Pontos para vencer')
    await user.clear(targetInput)
    await user.type(targetInput, '5')
    await user.click(screen.getByRole('button', { name: 'Começar partida' }))

    expect(screen.getByRole('heading', { name: 'Rodada 1' })).toBeInTheDocument()
    await playRound(user, { psychic: 'Ana', guesser: 'Bruno', guess: 0 })
    expect(screen.getByText('Errou o alvo! Ninguém pontuou.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima rodada' }))

    expect(screen.getByRole('heading', { name: 'Rodada 2' })).toBeInTheDocument()
    await playRound(user, { psychic: 'Bruno', guesser: 'Ana', guess: 80 })
    expect(screen.getByText('Ana ganhou 4 pontos')).toBeInTheDocument()
    expect(screen.getByText('Bruno (Psíquico) ganhou 2 pontos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima rodada' }))

    expect(screen.getByRole('heading', { name: 'Rodada 3' })).toBeInTheDocument()
    await playRound(user, { psychic: 'Ana', guesser: 'Bruno', guess: 90 })
    expect(screen.getByText('Bruno ganhou 6 pontos')).toBeInTheDocument()
    expect(screen.getByText('Ana (Psíquico) ganhou 3 pontos')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próxima rodada' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver resultado' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Fim de jogo' })).toBeInTheDocument()
    expect(screen.getByText('Bruno venceu!')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Bruno: 8 pontos' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ana: 7 pontos' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Jogar novamente' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Sintonia' })).toBeInTheDocument()
    expect(screen.getByLabelText('Jogador 1')).toHaveValue('Ana')
    expect(screen.getByLabelText('Jogador 2')).toHaveValue('Bruno')
    expect(screen.getByLabelText('Pontos para vencer')).toHaveValue(5)
  })
})
