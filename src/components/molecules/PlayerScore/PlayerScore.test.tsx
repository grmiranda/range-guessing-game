import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PlayerScore from './PlayerScore'

describe('PlayerScore', () => {
  it('mostra nome e pontos com rótulo acessível', () => {
    render(<PlayerScore name="Ana" score={7} />)
    const group = screen.getByRole('group', { name: 'Ana: 7 pontos' })
    expect(group).toHaveClass('player-score')
    expect(group).not.toHaveClass('player-score--highlight')
    expect(group).toHaveTextContent('Ana')
    expect(group).toHaveTextContent('7')
    expect(screen.queryByText('Psíquico')).not.toBeInTheDocument()
  })

  it('mostra o selo de Psíquico', () => {
    render(<PlayerScore name="Ana" score={0} isPsychic />)
    expect(screen.getByText('Psíquico')).toHaveClass('player-score__badge')
  })

  it('aplica o destaque', () => {
    render(<PlayerScore name="Bia" score={3} highlight />)
    expect(screen.getByRole('group', { name: 'Bia: 3 pontos' })).toHaveClass(
      'player-score--highlight',
    )
  })
})
