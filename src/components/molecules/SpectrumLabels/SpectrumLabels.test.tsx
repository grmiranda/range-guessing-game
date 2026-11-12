import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpectrumLabels from './SpectrumLabels'

describe('SpectrumLabels', () => {
  it('mostra os dois extremos com rótulo acessível', () => {
    render(<SpectrumLabels spectrum={{ left: 'Frio', right: 'Quente' }} />)
    const group = screen.getByRole('group', { name: 'Espectro: Frio a Quente' })
    expect(group).toHaveClass('spectrum-labels')
    expect(screen.getByText('Frio')).toHaveClass('spectrum-labels__left')
    expect(screen.getByText('Quente')).toHaveClass('spectrum-labels__right')
  })
})
