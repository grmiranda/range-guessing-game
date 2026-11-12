import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Modal from './Modal'

function renderModal(isOpen = true) {
  const onClose = vi.fn()
  const result = render(
    <Modal isOpen={isOpen} title="Título" onClose={onClose}>
      <p>Conteúdo</p>
    </Modal>,
  )
  return { onClose, ...result }
}

describe('Modal', () => {
  it('não renderiza nada quando fechado', () => {
    const { container } = renderModal(false)
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza o diálogo acessível com título e conteúdo', () => {
    renderModal()
    const dialog = screen.getByRole('dialog', { name: 'Título' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveClass('modal__dialog')
    const heading = screen.getByRole('heading', { level: 2, name: 'Título' })
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('fecha pelo botão Fechar', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fecha ao clicar no fundo, mas não ao clicar dentro', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByText('Conteúdo'))
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
    const overlay = screen.getByRole('dialog').parentElement as HTMLElement
    expect(overlay).toHaveClass('modal')
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fecha com Escape e ignora outras teclas', async () => {
    const { onClose } = renderModal()
    await userEvent.keyboard('{Enter}')
    expect(onClose).not.toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('remove o listener de Escape ao fechar e ao desmontar', async () => {
    const onClose = vi.fn()
    const { rerender, unmount } = render(
      <Modal isOpen title="Título" onClose={onClose}>
        Conteúdo
      </Modal>,
    )
    rerender(
      <Modal isOpen={false} title="Título" onClose={onClose}>
        Conteúdo
      </Modal>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()

    rerender(
      <Modal isOpen title="Título" onClose={onClose}>
        Conteúdo
      </Modal>,
    )
    unmount()
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })
})
