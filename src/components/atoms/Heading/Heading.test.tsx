import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Heading from './Heading'

describe('Heading', () => {
  it.each([1, 2, 3] as const)('renderiza h%i com o modificador de nível', (level) => {
    render(<Heading level={level}>Sintonia</Heading>)
    const heading = screen.getByRole('heading', { level, name: 'Sintonia' })
    expect(heading.tagName).toBe(`H${level}`)
    expect(heading).toHaveClass('heading', `heading--level-${level}`)
  })

  it('alinha à esquerda por padrão', () => {
    render(<Heading level={1}>Sintonia</Heading>)
    expect(screen.getByRole('heading')).toHaveClass('heading--align-left')
  })

  it('aplica o alinhamento centralizado', () => {
    render(
      <Heading level={2} align="center">
        Sintonia
      </Heading>,
    )
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('heading--align-center')
    expect(heading).not.toHaveClass('heading--align-left')
  })
})
