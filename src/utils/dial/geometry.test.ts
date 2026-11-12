import { describe, expect, it } from 'vitest'
import { clampAngle, describeWedge, polarToCartesian } from './geometry'

describe('clampAngle', () => {
  it.each([
    [-10, 0],
    [0, 0],
    [90, 90],
    [180, 180],
    [200, 180],
  ])('limita %i a %i', (angle, expected) => {
    expect(clampAngle(angle)).toBe(expected)
  })
})

describe('polarToCartesian', () => {
  it.each([
    [0, { x: 10, y: 100 }],
    [90, { x: 100, y: 10 }],
    [180, { x: 190, y: 100 }],
  ])('converte %i° com 0° à esquerda e 180° à direita', (angle, expected) => {
    expect(polarToCartesian(100, 100, 90, angle)).toEqual(expected)
  })

  it('calcula ângulos intermediários', () => {
    const point = polarToCartesian(100, 100, 90, 45)
    expect(point.x).toBeCloseTo(36.36, 2)
    expect(point.y).toBeCloseTo(36.36, 2)
  })

  it('não gera zero negativo', () => {
    const point = polarToCartesian(0, 0, 10, 90)
    expect(Object.is(point.x, -0)).toBe(false)
  })
})

describe('describeWedge', () => {
  it('descreve uma fatia do centro até o arco', () => {
    expect(describeWedge(100, 100, 90, 0, 90)).toBe('M 100 100 L 10 100 A 90 90 0 0 1 100 10 Z')
  })

  it('aceita os ângulos em qualquer ordem', () => {
    expect(describeWedge(100, 100, 90, 90, 0)).toBe(describeWedge(100, 100, 90, 0, 90))
  })

  it('limita as bordas a 0° e 180°', () => {
    expect(describeWedge(100, 100, 90, -20, 10)).toBe(describeWedge(100, 100, 90, 0, 10))
    expect(describeWedge(100, 100, 90, 170, 200)).toBe(describeWedge(100, 100, 90, 170, 180))
    expect(describeWedge(100, 100, 90, -30, 210)).toBe(
      'M 100 100 L 10 100 A 90 90 0 0 1 190 100 Z',
    )
  })
})
