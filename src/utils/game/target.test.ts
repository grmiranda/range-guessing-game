import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DIAL_MAX,
  DIAL_MIN,
  TARGET_MAX_ANGLE,
  TARGET_MIN_ANGLE,
} from '../../constants/game'
import { clampAngle, spinTarget } from './target'

describe('spinTarget', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna o ângulo mínimo quando random é 0', () => {
    expect(spinTarget(() => 0)).toBe(TARGET_MIN_ANGLE)
  })

  it('retorna o centro quando random é 0.5', () => {
    expect(spinTarget(() => 0.5)).toBe(90)
  })

  it('se aproxima do máximo quando random tende a 1', () => {
    expect(spinTarget(() => 0.999999)).toBe(TARGET_MAX_ANGLE)
  })

  it('arredonda para uma casa decimal', () => {
    expect(spinTarget(() => 0.123456)).toBe(37.3)
  })

  it('usa Math.random por padrão', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25)
    expect(spinTarget()).toBe(55)
  })

  it('fica sempre dentro do intervalo do alvo', () => {
    for (let i = 0; i < 200; i++) {
      const angle = spinTarget()
      expect(angle).toBeGreaterThanOrEqual(TARGET_MIN_ANGLE)
      expect(angle).toBeLessThanOrEqual(TARGET_MAX_ANGLE)
    }
  })
})

describe('clampAngle', () => {
  it('mantém ângulos dentro do dial', () => {
    expect(clampAngle(DIAL_MIN)).toBe(DIAL_MIN)
    expect(clampAngle(45.5)).toBe(45.5)
    expect(clampAngle(DIAL_MAX)).toBe(DIAL_MAX)
  })

  it('limita ângulos fora do dial', () => {
    expect(clampAngle(-10)).toBe(DIAL_MIN)
    expect(clampAngle(200)).toBe(DIAL_MAX)
  })
})
