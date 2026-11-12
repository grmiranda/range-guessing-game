import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ScreenTemplate from './ScreenTemplate'

describe('ScreenTemplate', () => {
  it('renderiza só o conteúdo principal quando não há outras áreas', () => {
    const { container } = render(<ScreenTemplate>Conteúdo</ScreenTemplate>)
    const root = container.firstElementChild
    expect(root).toHaveClass('screen-template')
    expect(root).not.toHaveClass('screen-template--with-aside')
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo')
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('renderiza cabeçalho, lateral e rodapé', () => {
    const { container } = render(
      <ScreenTemplate header="Topo" aside="Lateral" footer="Rodapé">
        Conteúdo
      </ScreenTemplate>,
    )
    expect(container.firstElementChild).toHaveClass('screen-template--with-aside')
    expect(screen.getByRole('banner')).toHaveTextContent('Topo')
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo')
    expect(screen.getByRole('complementary')).toHaveTextContent('Lateral')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Rodapé')
  })

  it('ignora lateral nula', () => {
    const { container } = render(<ScreenTemplate aside={null}>Conteúdo</ScreenTemplate>)
    expect(container.firstElementChild).not.toHaveClass('screen-template--with-aside')
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
