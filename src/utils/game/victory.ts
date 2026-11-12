import type { Player, PlayerId } from '../../types/game'

export function resolveWinner(
  players: readonly [Player, Player],
  targetScore: number,
): PlayerId | null {
  const [first, second] = players
  if (first.score === second.score) return null
  const leader = first.score > second.score ? first : second
  return leader.score >= targetScore ? leader.id : null
}

export function isTiebreak(
  players: readonly [Player, Player],
  targetScore: number,
): boolean {
  const [first, second] = players
  return first.score === second.score && first.score >= targetScore
}
