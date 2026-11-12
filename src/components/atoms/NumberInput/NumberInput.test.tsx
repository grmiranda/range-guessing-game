import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import NumberInput from './NumberInput'

function ControlledNumberInput({
  initial,
  onChange,
}: {
  initial: number | ''
  onChange: (value: number | '') => void
}) {
  const [value, setValue] = useState<number | ''>(initial)
  return (
    <NumberInput
      id="meta"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('NumberInput', () => {
  it('renderiza com atributos numéricos', () => {
    render(<NumberInput id="meta" value={10} onChange={vi.fn()} min={1} max={50} step={1} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('id', 'meta')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '50')
    expect(input).toHaveAttribute('step', '1')
    expect(input).toHaveValue(10)
    expect(input).toHaveClass('number-input')
    expect(input).not.toHaveClass('number-input--invalid')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('renderiza vazio quando o valor é string vazia', () => {
    render(<NumberInput id="meta" value="" onChange={vi.fn()} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(null)
  })

  it('marca como inválido e liga a descrição', () => {
    render(
      <NumberInput id="meta" value={0} onChange={vi.fn()} invalid describedBy="meta-error" />,
    )
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveClass('number-input--invalid')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'meta-error')
  })

  it('emite string vazia ao limpar e número ao digitar', async () => {
    const onChange = vi.fn()
    render(<ControlledNumberInput initial={10} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')

    await userEvent.clear(input)
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(input).toHaveValue(null)

    await userEvent.type(input, '25')
    expect(onChange).toHaveBeenLastCalledWith(25)
    expect(input).toHaveValue(25)
  })
})
