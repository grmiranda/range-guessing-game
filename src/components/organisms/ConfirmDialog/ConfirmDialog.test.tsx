import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ConfirmDialog from './ConfirmDialog'

function renderDialog(props: { isOpen?: boolean; cancelLabel?: string } = {}) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <ConfirmDialog
      isOpen={props.isOpen ?? true}
      title="Encerrar partida"
      message="O placar atual será perdido."
      confirmLabel="Encerrar"
      cancelLabel={props.cancelLabel}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  )
  return { onConfirm, onCancel }
}

describe('ConfirmDialog', () => {
  it('não renderiza quando fechado', () => {
    renderDialog({ isOpen: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra título, mensagem e botões', () => {
    renderDialog()
    expect(screen.getByRole('dialog', { name: 'Encerrar partida' })).toBeInTheDocument()
    expect(screen.getByText('O placar atual será perdido.')).toHaveClass(
      'confirm-dialog__message',
    )
    expect(screen.getByRole('button', { name: 'Encerrar' })).toHaveClass('button--danger')
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveClass('button--secondary')
  })

  it('usa o rótulo de cancelar personalizado', () => {
    renderDialog({ cancelLabel: 'Voltar' })
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('confirma', async () => {
    const { onConfirm, onCancel } = renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'Encerrar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('cancela pelo botão, pelo Fechar e pelo Escape', async () => {
    const { onConfirm, onCancel } = renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(3)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
