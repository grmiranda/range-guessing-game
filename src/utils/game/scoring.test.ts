import { describe, expect, it } from 'vitest'
import { getAngleDistance, getGuessPoints, getPsychicPoints } from './scoring'

describe('getAngleDistance', () => {
  it('retorna a diferença absoluta', () => {
    expect(getAngleDistance(90, 100)).toBe(10)
    expect(getAngleDistance(100, 90)).toBe(10)
    expect(getAngleDistance(45, 45)).toBe(0)
  })
})

describe('getGuessPoints', () => {
  const target = 90

  it.each([
    [0, 6],
    [4, 6],
    [4.01, 4],
    [12, 4],
    [12.01, 2],
    [20, 2],
    [20.01, 0],
    [90, 0],
  ])('distância %s vale %s pontos dos dois lados do alvo', (distance, points) => {
    expect(getGuessPoints(target, target + distance)).toBe(points)
    expect(getGuessPoints(target, target - distance)).toBe(points)
  })
})

describe('getPsychicPoints', () => {
  it.each([
    [6, 3],
    [4, 2],
    [2, 1],
    [0, 0],
  ] as const)('palpite de %s dá %s ao Psíquico', (guess, psychic) => {
    expect(getPsychicPoints(guess)).toBe(psychic)
  })
})
