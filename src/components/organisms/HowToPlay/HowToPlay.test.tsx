import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HowToPlay from './HowToPlay'

describe('HowToPlay', () => {
  it('não renderiza quando fechado', () => {
    render(<HowToPlay isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra as regras em lista ordenada', () => {
    render(<HowToPlay isOpen onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog', { name: 'Como jogar' })
    const list = within(dialog).getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).toHaveClass('how-to-play')
    expect(within(list).getAllByRole('listitem')).toHaveLength(7)
    expect(within(list).getByText(/2 jogadores/)).toBeInTheDocument()
    expect(within(list).getByText(/faixa central vale 6 pontos/)).toBeInTheDocument()
    expect(within(list).getByText(/metade dos pontos/)).toBeInTheDocument()
    expect(within(list).getByText(/rodadas de desempate/)).toBeInTheDocument()
  })

  it('fecha pelo botão Fechar', async () => {
    const onClose = vi.fn()
    render(<HowToPlay isOpen onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
