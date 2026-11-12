import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Dial from './Dial'

describe('Dial', () => {
  it('renderiza o fundo e o pivô sem alvo nem ponteiro', () => {
    const { container } = render(<Dial targetAngle={90} showTarget={false} guessAngle={null} />)
    const svg = screen.getByRole('img', { name: 'Roleta' })
    expect(svg).toHaveClass('dial')
    expect(svg).toHaveAttribute('viewBox', '0 0 200 110')
    expect(container.querySelector('.dial__background')).toBeInTheDocument()
    expect(container.querySelector('.dial__pivot')).toBeInTheDocument()
    expect(container.querySelector('.dial__zone--two')).not.toBeInTheDocument()
    expect(container.querySelector('.dial__needle')).not.toBeInTheDocument()
  })

  it('não mostra o alvo quando targetAngle é null', () => {
    const { container } = render(<Dial targetAngle={null} showTarget guessAngle={null} />)
    expect(screen.getByRole('img', { name: 'Roleta' })).toBeInTheDocument()
    expect(container.querySelector('.dial__zone--six')).not.toBeInTheDocument()
  })

  it('mostra as faixas da mais larga para a mais estreita quando showTarget', () => {
    const { container } = render(<Dial targetAngle={90} showTarget guessAngle={null} />)
    expect(screen.getByRole('img', { name: 'Roleta, alvo visível' })).toBeInTheDocument()
    const zones = container.querySelectorAll('path[class^="dial__zone--"]')
    expect(Array.from(zones, (zone) => zone.getAttribute('class'))).toEqual([
      'dial__zone--two',
      'dial__zone--four',
      'dial__zone--six',
    ])
    expect(container.querySelectorAll('.dial__zone-label')).toHaveLength(5)
  })

  it('omite rótulos de faixa fora do dial', () => {
    const { container } = render(<Dial targetAngle={2} showTarget guessAngle={null} />)
    const labels = Array.from(container.querySelectorAll('.dial__zone-label'), (label) =>
      label.textContent,
    )
    expect(labels).toEqual(['6', '4', '2'])
    expect(container.querySelector('.dial__zone--two')?.getAttribute('d')).toContain('L 10 100')
  })

  it.each([
    [0, '10', '100'],
    [90, '100', '10'],
    [180, '190', '100'],
  ])('posiciona o ponteiro em %i°', (angle, x2, y2) => {
    const { container } = render(<Dial targetAngle={null} showTarget={false} guessAngle={angle} />)
    expect(screen.getByRole('img', { name: `Roleta, ponteiro em ${angle}°` })).toBeInTheDocument()
    const needle = container.querySelector('.dial__needle')
    expect(needle).toHaveAttribute('x1', '100')
    expect(needle).toHaveAttribute('y1', '100')
    expect(needle).toHaveAttribute('x2', x2)
    expect(needle).toHaveAttribute('y2', y2)
  })

  it('descreve alvo e ponteiro juntos', () => {
    render(<Dial targetAngle={60} showTarget guessAngle={70} />)
    expect(
      screen.getByRole('img', { name: 'Roleta, alvo visível, ponteiro em 70°' }),
    ).toBeInTheDocument()
  })
})
