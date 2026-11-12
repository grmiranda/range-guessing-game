import classNames from '../../../utils/classNames'
import styles from './TextInput.module.scss'

interface TextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  invalid?: boolean
  describedBy?: string
  autoFocus?: boolean
}

export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  invalid = false,
  describedBy,
  autoFocus = false,
}: TextInputProps) {
  return (
    <input
      id={id}
      type="text"
      className={classNames(
        styles['text-input'],
        invalid && styles['text-input--invalid'],
      )}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      autoFocus={autoFocus}
      autoComplete="off"
    />
  )
}
