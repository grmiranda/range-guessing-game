import classNames from '../../../utils/classNames'
import styles from './NumberInput.module.scss'

interface NumberInputProps {
  id: string
  value: number | ''
  onChange: (value: number | '') => void
  min?: number
  max?: number
  step?: number
  invalid?: boolean
  describedBy?: string
}

export default function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  invalid = false,
  describedBy,
}: NumberInputProps) {
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      className={classNames(
        styles['number-input'],
        invalid && styles['number-input--invalid'],
      )}
      value={value}
      onChange={(event) => {
        const raw = event.target.value
        onChange(raw === '' ? '' : Number(raw))
      }}
      min={min}
      max={max}
      step={step}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    />
  )
}
