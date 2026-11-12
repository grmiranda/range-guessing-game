import { describe, expect, it } from 'vitest'
import { SPECTRUMS } from './spectrums'

function pairKey(left: string, right: string): string {
  return [left, right]
    .map((side) => side.toLocaleLowerCase('pt-BR'))
    .sort()
    .join('|')
}

describe('SPECTRUMS', () => {
  it('tem pelo menos 100 pares', () => {
    expect(SPECTRUMS.length).toBeGreaterThanOrEqual(100)
  })

  it('não tem textos vazios nem lados iguais', () => {
    for (const { left, right } of SPECTRUMS) {
      expect(left.trim()).not.toBe('')
      expect(right.trim()).not.toBe('')
      expect(left.trim()).toBe(left)
      expect(right.trim()).toBe(right)
      expect(left.toLocaleLowerCase('pt-BR')).not.toBe(
        right.toLocaleLowerCase('pt-BR'),
      )
    }
  })

  it('não tem pares duplicados, mesmo invertidos', () => {
    const keys = SPECTRUMS.map(({ left, right }) => pairKey(left, right))
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('usa maiúscula só na primeira letra', () => {
    for (const { left, right } of SPECTRUMS) {
      for (const side of [left, right]) {
        expect(side[0]).toBe(side[0].toLocaleUpperCase('pt-BR'))
        expect(side.slice(1)).toBe(side.slice(1).toLocaleLowerCase('pt-BR'))
      }
    }
  })

  it.each([
    ['Frio', 'Quente'],
    ['Chato', 'Divertido'],
    ['Impopular', 'Popular'],
  ])('contém o par %s / %s', (left, right) => {
    expect(SPECTRUMS).toContainEqual({ left, right })
  })
})
