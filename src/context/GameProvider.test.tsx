import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GameProvider from './GameProvider'

describe('GameProvider', () => {
  it('renderiza os filhos', () => {
    render(
      <GameProvider>
        <p>Conteúdo</p>
      </GameProvider>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })
})
