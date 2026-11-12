import {
  DIAL_MAX,
  DIAL_MIN,
  TARGET_MAX_ANGLE,
  TARGET_MIN_ANGLE,
} from '../../constants/game'
import type { RandomFn } from '../../types/game'

export function spinTarget(random: RandomFn = Math.random): number {
  const angle =
    TARGET_MIN_ANGLE + random() * (TARGET_MAX_ANGLE - TARGET_MIN_ANGLE)
  return Math.round(angle * 10) / 10
}

export function clampAngle(angle: number): number {
  return Math.min(DIAL_MAX, Math.max(DIAL_MIN, angle))
}
