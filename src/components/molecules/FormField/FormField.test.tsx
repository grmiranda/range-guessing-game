import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TextInput from '../../atoms/TextInput/TextInput'
import FormField from './FormField'

describe('FormField', () => {
  it('associa o rótulo ao campo', () => {
    render(
      <FormField id="nome" label="Nome do jogador">
        <TextInput id="nome" value="" onChange={vi.fn()} />
      </FormField>,
    )
    expect(screen.getByLabelText('Nome do jogador')).toHaveAttribute('id', 'nome')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('não mostra erro quando error é null', () => {
    render(
      <FormField id="nome" label="Nome" error={null}>
        <TextInput id="nome" value="" onChange={vi.fn()} />
      </FormField>,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('mostra o erro ligado ao campo via aria-describedby', () => {
    render(
      <FormField id="nome" label="Nome" error="Informe um nome">
        <TextInput id="nome" value="" onChange={vi.fn()} invalid describedBy="nome-error" />
      </FormField>,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Informe um nome')
    expect(alert).toHaveAttribute('id', 'nome-error')
    expect(alert).toHaveClass('form-field__error')
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Informe um nome')
  })
})
