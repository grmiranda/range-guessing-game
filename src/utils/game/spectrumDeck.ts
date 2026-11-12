import { SPECTRUMS } from '../../constants/spectrums'
import type { RandomFn, Spectrum } from '../../types/game'

export interface DrawResult {
  spectrum: Spectrum
  deck: Spectrum[]
}

export function shuffle<T>(
  items: readonly T[],
  random: RandomFn = Math.random,
): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function createDeck(
  random: RandomFn = Math.random,
  source: readonly Spectrum[] = SPECTRUMS,
): Spectrum[] {
  return shuffle(source, random)
}

export function drawSpectrum(
  deck: readonly Spectrum[],
  random: RandomFn = Math.random,
  source: readonly Spectrum[] = SPECTRUMS,
): DrawResult {
  const available = deck.length > 0 ? deck : createDeck(random, source)
  if (available.length === 0) {
    throw new Error('Não há espectros disponíveis para sortear.')
  }
  const [spectrum, ...rest] = available
  return { spectrum, deck: rest }
}
