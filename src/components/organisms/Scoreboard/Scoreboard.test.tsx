import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Player } from '../../../types/game'
import Scoreboard from './Scoreboard'

const players: [Player, Player] = [
  { id: 0, name: 'Ana', score: 4 },
  { id: 1, name: 'Bia', score: 7 },
]

describe('Scoreboard', () => {
  it('mostra os dois jogadores e a meta', () => {
    const { container } = render(<Scoreboard players={players} psychicId={null} targetScore={10} />)
    expect(container.firstChild).toHaveClass('scoreboard')
    expect(screen.getByRole('group', { name: 'Ana: 4 pontos' })).not.toHaveClass(
      'player-score--highlight',
    )
    expect(screen.getByRole('group', { name: 'Bia: 7 pontos' })).not.toHaveClass(
      'player-score--highlight',
    )
    expect(screen.queryByText('Psíquico')).not.toBeInTheDocument()
    expect(screen.getByText('Meta: 10 pontos')).toHaveClass('scoreboard__goal')
  })

  it('destaca o Psíquico', () => {
    render(<Scoreboard players={players} psychicId={1} targetScore={15} />)
    const psychic = screen.getByRole('group', { name: 'Bia: 7 pontos' })
    expect(psychic).toHaveClass('player-score--highlight')
    expect(psychic).toHaveTextContent('Psíquico')
    expect(screen.getByRole('group', { name: 'Ana: 4 pontos' })).not.toHaveClass(
      'player-score--highlight',
    )
    expect(screen.getByText('Meta: 15 pontos')).toBeInTheDocument()
  })
})
