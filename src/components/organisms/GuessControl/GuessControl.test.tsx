import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GuessControl from './GuessControl'

describe('GuessControl', () => {
  it('renderiza o slider com rótulo, limites e texto acessível', () => {
    render(<GuessControl value={90} onChange={vi.fn()} leftLabel="Frio" rightLabel="Quente" />)
    const slider = screen.getByRole('slider', { name: 'Posição do ponteiro' })
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '180')
    expect(slider).toHaveAttribute('step', '1')
    expect(slider).toHaveValue('90')
    expect(slider).toHaveAttribute('aria-valuetext', '90° entre Frio e Quente')
    expect(slider).toBeEnabled()
    expect(slider).toHaveClass('guess-control__input')
    expect(screen.getByText('Posição do ponteiro')).toHaveClass('guess-control__label')
    expect(screen.getByText('Frio')).toHaveClass('guess-control__end')
    expect(screen.getByText('Quente')).toHaveClass('guess-control__end')
  })

  it('chama onChange com o ângulo numérico', () => {
    const onChange = vi.fn()
    render(<GuessControl value={90} onChange={onChange} leftLabel="Frio" rightLabel="Quente" />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '135' } })
    expect(onChange).toHaveBeenCalledWith(135)
  })

  it('pode ser desabilitado', () => {
    render(
      <GuessControl value={10} onChange={vi.fn()} leftLabel="A" rightLabel="B" disabled />,
    )
    const slider = screen.getByRole('slider')
    expect(slider).toBeDisabled()
    expect(slider).toHaveAttribute('aria-valuetext', '10° entre A e B')
  })
})
