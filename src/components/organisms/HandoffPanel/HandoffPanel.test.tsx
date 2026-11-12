import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HandoffPanel from './HandoffPanel'

describe('HandoffPanel', () => {
  it('orienta o Psíquico e confirma ao girar a roleta', async () => {
    const onConfirm = vi.fn()
    render(<HandoffPanel playerName="Ana" role="psychic" onConfirm={onConfirm} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Passe o aparelho para Ana' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Você é o Psíquico desta rodada. Gire a roleta e veja o alvo sem mostrar para o outro jogador.',
      ),
    ).toHaveClass('handoff-panel__description')
    await userEvent.click(screen.getByRole('button', { name: 'Girar roleta' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('orienta quem dá o palpite', async () => {
    const onConfirm = vi.fn()
    render(<HandoffPanel playerName="Bia" role="guesser" onConfirm={onConfirm} />)
    expect(screen.getByRole('heading', { name: 'Passe o aparelho para Bia' })).toBeInTheDocument()
    expect(
      screen.getByText('Ouça a dica do Psíquico e posicione o ponteiro onde acha que está o alvo.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Girar roleta' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Estou pronto' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
