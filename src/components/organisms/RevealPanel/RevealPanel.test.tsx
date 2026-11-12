import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RevealPanel from './RevealPanel'

describe('RevealPanel', () => {
  it('mostra os pontos dos dois jogadores e avança', async () => {
    const onNext = vi.fn()
    render(
      <RevealPanel
        guesserName="Bia"
        psychicName="Ana"
        guesserPoints={6}
        psychicPoints={3}
        nextLabel="Próxima rodada"
        onNext={onNext}
      />,
    )
    expect(screen.getByText('Bia ganhou 6 pontos')).toHaveClass('reveal-panel__result')
    expect(screen.getByText('Ana (Psíquico) ganhou 3 pontos')).toBeInTheDocument()
    expect(screen.queryByText('Errou o alvo! Ninguém pontuou.')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Próxima rodada' }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('usa o singular para 1 ponto', () => {
    render(
      <RevealPanel
        guesserName="Bia"
        psychicName="Ana"
        guesserPoints={2}
        psychicPoints={1}
        nextLabel="Ver vencedor"
        onNext={vi.fn()}
      />,
    )
    expect(screen.getByText('Bia ganhou 2 pontos')).toBeInTheDocument()
    expect(screen.getByText('Ana (Psíquico) ganhou 1 ponto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver vencedor' })).toBeInTheDocument()
  })

  it('avisa quando ninguém pontuou', () => {
    render(
      <RevealPanel
        guesserName="Bia"
        psychicName="Ana"
        guesserPoints={0}
        psychicPoints={0}
        nextLabel="Próxima rodada"
        onNext={vi.fn()}
      />,
    )
    expect(screen.getByText('Errou o alvo! Ninguém pontuou.')).toHaveClass('reveal-panel__miss')
    expect(screen.queryByText(/ganhou/)).not.toBeInTheDocument()
  })
})
