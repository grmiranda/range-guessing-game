import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renderiza com valores padrão', () => {
    render(<Button>Jogar</Button>)
    const button = screen.getByRole('button', { name: 'Jogar' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('button', 'button--primary')
    expect(button).not.toHaveClass('button--full-width')
    expect(button).toBeEnabled()
  })

  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)(
    'aplica o modificador da variante %s',
    (variant) => {
      render(<Button variant={variant}>Ok</Button>)
      expect(screen.getByRole('button')).toHaveClass(`button--${variant}`)
    },
  )

  it('aplica fullWidth e type submit', () => {
    render(
      <Button type="submit" fullWidth>
        Enviar
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('button--full-width')
  })

  it('usa ariaLabel como nome acessível', () => {
    render(<Button ariaLabel="Fechar janela">X</Button>)
    expect(screen.getByRole('button', { name: 'Fechar janela' })).toBeInTheDocument()
  })

  it('chama onClick ao clicar', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Jogar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando desabilitado', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Jogar
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
