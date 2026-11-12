import { afterEach, describe, expect, it, vi } from 'vitest'
import { SPECTRUMS } from '../../constants/spectrums'
import type { RandomFn, Spectrum } from '../../types/game'
import { createDeck, drawSpectrum, shuffle } from './spectrumDeck'

function createSeededRandom(seed: number): RandomFn {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const SAMPLE: readonly Spectrum[] = [
  { left: 'A', right: 'B' },
  { left: 'C', right: 'D' },
  { left: 'E', right: 'F' },
]

describe('shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('não muta a lista original e mantém os mesmos itens', () => {
    const items = [1, 2, 3, 4, 5]
    const result = shuffle(items, createSeededRandom(42))
    expect(items).toEqual([1, 2, 3, 4, 5])
    expect(result).not.toBe(items)
    expect([...result].sort()).toEqual(items)
  })

  it('é determinístico com o mesmo gerador', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8]
    expect(shuffle(items, createSeededRandom(7))).toEqual(
      shuffle(items, createSeededRandom(7)),
    )
  })

  it('mantém a ordem quando random sempre retorna próximo de 1', () => {
    expect(shuffle([1, 2, 3, 4], () => 0.999)).toEqual([1, 2, 3, 4])
  })

  it('rotaciona quando random sempre retorna 0', () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
  })

  it('lida com listas vazias e de um item', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle(['x'])).toEqual(['x'])
  })

  it('usa Math.random por padrão', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(shuffle([1, 2, 3])).toEqual([2, 3, 1])
    expect(spy).toHaveBeenCalledTimes(2)
  })
})

describe('createDeck', () => {
  it('cria uma cópia embaralhada de todos os espectros por padrão', () => {
    const deck = createDeck(createSeededRandom(1))
    expect(deck).toHaveLength(SPECTRUMS.length)
    expect(deck).not.toBe(SPECTRUMS)
    expect(new Set(deck)).toEqual(new Set(SPECTRUMS))
  })

  it('aceita uma fonte personalizada sem mutá-la', () => {
    const source = [...SAMPLE]
    const deck = createDeck(() => 0, source)
    expect(deck).toEqual([SAMPLE[1], SAMPLE[2], SAMPLE[0]])
    expect(source).toEqual(SAMPLE)
  })

  it('funciona sem argumentos', () => {
    expect(createDeck()).toHaveLength(SPECTRUMS.length)
  })
})

describe('drawSpectrum', () => {
  it('tira o primeiro item sem mutar o baralho', () => {
    const deck = [...SAMPLE]
    const result = drawSpectrum(deck)
    expect(result.spectrum).toBe(SAMPLE[0])
    expect(result.deck).toEqual([SAMPLE[1], SAMPLE[2]])
    expect(deck).toEqual(SAMPLE)
  })

  it('esvazia o baralho sem repetir espectros', () => {
    let deck: Spectrum[] = [...SAMPLE]
    const drawn: Spectrum[] = []
    for (let i = 0; i < SAMPLE.length; i++) {
      const result = drawSpectrum(deck)
      drawn.push(result.spectrum)
      deck = result.deck
    }
    expect(drawn).toEqual(SAMPLE)
    expect(deck).toEqual([])
  })

  it('reembaralha a fonte quando o baralho está vazio', () => {
    const result = drawSpectrum([], () => 0, SAMPLE)
    expect(result.spectrum).toBe(SAMPLE[1])
    expect(result.deck).toEqual([SAMPLE[2], SAMPLE[0]])
  })

  it('usa SPECTRUMS como fonte padrão ao reembaralhar', () => {
    const result = drawSpectrum([], createSeededRandom(3))
    expect(SPECTRUMS).toContain(result.spectrum)
    expect(result.deck).toHaveLength(SPECTRUMS.length - 1)
    expect(result.deck).not.toContain(result.spectrum)
  })

  it('lança erro quando não há espectros na fonte', () => {
    expect(() => drawSpectrum([], () => 0, [])).toThrow(
      'Não há espectros disponíveis para sortear.',
    )
  })
})
