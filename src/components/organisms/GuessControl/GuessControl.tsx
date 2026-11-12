import { useId } from 'react'
import { DIAL_MAX, DIAL_MIN } from '../../../constants/game'
import styles from './GuessControl.module.scss'

interface GuessControlProps {
  value: number
  onChange: (angle: number) => void
  leftLabel: string
  rightLabel: string
  disabled?: boolean
}

export default function GuessControl({
  value,
  onChange,
  leftLabel,
  rightLabel,
  disabled = false,
}: GuessControlProps) {
  const inputId = useId()

  return (
    <div className={styles['guess-control']}>
      <label htmlFor={inputId} className={styles['guess-control__label']}>
        Posição do ponteiro
      </label>
      <span className={styles['guess-control__end']} aria-hidden="true">
        {leftLabel}
      </span>
      <input
        id={inputId}
        type="range"
        className={styles['guess-control__input']}
        min={DIAL_MIN}
        max={DIAL_MAX}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        aria-valuetext={`${value}° entre ${leftLabel} e ${rightLabel}`}
      />
      <span className={styles['guess-control__end']} aria-hidden="true">
        {rightLabel}
      </span>
    </div>
  )
}
