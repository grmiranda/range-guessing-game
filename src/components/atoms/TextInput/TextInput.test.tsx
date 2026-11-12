import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import TextInput from './TextInput'

function ControlledTextInput({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <TextInput
      id="nome"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
      maxLength={5}
    />
  )
}

describe('TextInput', () => {
  it('renderiza com valores padrão', () => {
    render(<TextInput id="nome" value="Ana" onChange={vi.fn()} placeholder="Nome" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'nome')
    expect(input).toHaveValue('Ana')
    expect(input).toHaveAttribute('placeholder', 'Nome')
    expect(input).toHaveClass('text-input')
    expect(input).not.toHaveClass('text-input--invalid')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(input).not.toHaveFocus()
  })

  it('marca como inválido e liga a descrição', () => {
    render(
      <TextInput id="nome" value="" onChange={vi.fn()} invalid describedBy="nome-error" />,
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('text-input--invalid')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'nome-error')
  })

  it('recebe foco com autoFocus', () => {
    render(<TextInput id="nome" value="" onChange={vi.fn()} autoFocus />)
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('chama onChange com o texto digitado e respeita maxLength', async () => {
    const onChange = vi.fn()
    render(<ControlledTextInput onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Gabriel')
    expect(input).toHaveValue('Gabri')
    expect(onChange).toHaveBeenLastCalledWith('Gabri')
  })
})
