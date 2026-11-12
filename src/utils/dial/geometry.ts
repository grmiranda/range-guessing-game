import { clampAngle } from '../game/target'

export { clampAngle }

export interface Point {
  x: number
  y: number
}

function round(value: number): number {
  const rounded = Math.round(value * 1000) / 1000
  return rounded === 0 ? 0 : rounded
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): Point {
  const radians = (angle * Math.PI) / 180
  return {
    x: round(cx - radius * Math.cos(radians)),
    y: round(cy - radius * Math.sin(radians)),
  }
}

export function describeWedge(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const from = clampAngle(Math.min(startAngle, endAngle))
  const to = clampAngle(Math.max(startAngle, endAngle))
  const start = polarToCartesian(cx, cy, radius, from)
  const end = polarToCartesian(cx, cy, radius, to)
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} Z`
}
