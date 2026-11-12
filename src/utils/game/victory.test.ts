import { describe, expect, it } from 'vitest'
import type { Player } from '../../types/game'
import { isTiebreak, resolveWinner } from './victory'

function makePlayers(first: number, second: number): [Player, Player] {
  return [
    { id: 0, name: 'Ana', score: first },
    { id: 1, name: 'Bruno', score: second },
  ]
}

describe('resolveWinner', () => {
  it('retorna null quando ninguém atingiu a meta', () => {
    expect(resolveWinner(makePlayers(0, 0), 10)).toBeNull()
    expect(resolveWinner(makePlayers(9, 4), 10)).toBeNull()
    expect(resolveWinner(makePlayers(3, 9), 10)).toBeNull()
  })

  it('retorna quem atingiu a meta quando só um chegou lá', () => {
    expect(resolveWinner(makePlayers(10, 4), 10)).toBe(0)
    expect(resolveWinner(makePlayers(5, 12), 10)).toBe(1)
  })

  it('retorna quem tem mais pontos quando os dois atingiram a meta', () => {
    expect(resolveWinner(makePlayers(14, 11), 10)).toBe(0)
    expect(resolveWinner(makePlayers(10, 13), 10)).toBe(1)
  })

  it('retorna null quando os dois estão empatados na meta', () => {
    expect(resolveWinner(makePlayers(10, 10), 10)).toBeNull()
    expect(resolveWinner(makePlayers(12, 12), 10)).toBeNull()
  })
})

describe('isTiebreak', () => {
  it('é verdadeiro quando há empate com a meta atingida', () => {
    expect(isTiebreak(makePlayers(10, 10), 10)).toBe(true)
    expect(isTiebreak(makePlayers(15, 15), 10)).toBe(true)
  })

  it('é falso quando há empate abaixo da meta', () => {
    expect(isTiebreak(makePlayers(0, 0), 10)).toBe(false)
    expect(isTiebreak(makePlayers(9, 9), 10)).toBe(false)
  })

  it('é falso quando não há empate', () => {
    expect(isTiebreak(makePlayers(10, 9), 10)).toBe(false)
    expect(isTiebreak(makePlayers(11, 14), 10)).toBe(false)
  })
})

describe('desempate ao longo das rodadas', () => {
  it('continua no empate e é resolvido na rodada seguinte', () => {
    const tied = makePlayers(11, 11)
    expect(isTiebreak(tied, 10)).toBe(true)
    expect(resolveWinner(tied, 10)).toBeNull()

    const nextRound = makePlayers(tied[0].score + 3, tied[1].score + 6)
    expect(isTiebreak(nextRound, 10)).toBe(false)
    expect(resolveWinner(nextRound, 10)).toBe(1)
  })
})
