import { ZONE_HALF_WIDTHS } from '../../../constants/game'
import { describeWedge, polarToCartesian } from '../../../utils/dial/geometry'
import styles from './Dial.module.scss'

interface DialProps {
  targetAngle: number | null
  showTarget: boolean
  guessAngle: number | null
}

const CX = 100
const CY = 100
const RADIUS = 90
const LABEL_RADIUS = RADIUS * 0.8
const PIVOT_RADIUS = 6

const ZONES = [
  { key: 'two', halfWidth: ZONE_HALF_WIDTHS.two },
  { key: 'four', halfWidth: ZONE_HALF_WIDTHS.four },
  { key: 'six', halfWidth: ZONE_HALF_WIDTHS.six },
] as const

const LABEL_OFFSETS = [
  { offset: -(ZONE_HALF_WIDTHS.four + ZONE_HALF_WIDTHS.two) / 2, points: 2 },
  { offset: -(ZONE_HALF_WIDTHS.six + ZONE_HALF_WIDTHS.four) / 2, points: 4 },
  { offset: 0, points: 6 },
  { offset: (ZONE_HALF_WIDTHS.six + ZONE_HALF_WIDTHS.four) / 2, points: 4 },
  { offset: (ZONE_HALF_WIDTHS.four + ZONE_HALF_WIDTHS.two) / 2, points: 2 },
] as const

function getAriaLabel(isTargetVisible: boolean, guessAngle: number | null): string {
  let label = 'Roleta'
  if (isTargetVisible) label += ', alvo visível'
  if (guessAngle !== null) label += `, ponteiro em ${guessAngle}°`
  return label
}

export default function Dial({ targetAngle, showTarget, guessAngle }: DialProps) {
  const isTargetVisible = showTarget && targetAngle !== null
  const needleEnd = guessAngle === null ? null : polarToCartesian(CX, CY, RADIUS, guessAngle)

  return (
    <svg
      className={styles.dial}
      viewBox="0 0 200 110"
      role="img"
      aria-label={getAriaLabel(isTargetVisible, guessAngle)}
    >
      <path className={styles.dial__background} d={describeWedge(CX, CY, RADIUS, 0, 180)} />
      {isTargetVisible && (
        <g>
          {ZONES.map(({ key, halfWidth }) => (
            <path
              key={key}
              className={styles[`dial__zone--${key}`]}
              d={describeWedge(CX, CY, RADIUS, targetAngle - halfWidth, targetAngle + halfWidth)}
            />
          ))}
          {LABEL_OFFSETS.map(({ offset, points }) => {
            const angle = targetAngle + offset
            if (angle < 0 || angle > 180) return null
            const position = polarToCartesian(CX, CY, LABEL_RADIUS, angle)
            return (
              <text
                key={offset}
                className={styles['dial__zone-label']}
                x={position.x}
                y={position.y}
                aria-hidden="true"
              >
                {points}
              </text>
            )
          })}
        </g>
      )}
      {needleEnd && (
        <line
          className={styles.dial__needle}
          x1={CX}
          y1={CY}
          x2={needleEnd.x}
          y2={needleEnd.y}
        />
      )}
      <circle className={styles.dial__pivot} cx={CX} cy={CY} r={PIVOT_RADIUS} />
    </svg>
  )
}
