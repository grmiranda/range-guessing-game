import { ZONE_HALF_WIDTHS } from '../../constants/game'
import type { GuessPoints } from '../../types/game'

export function getAngleDistance(a: number, b: number): number {
  return Math.abs(a - b)
}

export function getGuessPoints(
  targetAngle: number,
  guessAngle: number,
): GuessPoints {
  const distance = getAngleDistance(targetAngle, guessAngle)
  if (distance <= ZONE_HALF_WIDTHS.six) return 6
  if (distance <= ZONE_HALF_WIDTHS.four) return 4
  if (distance <= ZONE_HALF_WIDTHS.two) return 2
  return 0
}

export function getPsychicPoints(guessPoints: GuessPoints): number {
  return guessPoints / 2
}
