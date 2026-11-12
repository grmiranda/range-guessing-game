import type { ReactNode } from 'react'
import classNames from '../../../utils/classNames'
import styles from './Button.module.scss'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        styles[`button--${variant}`],
        fullWidth && styles['button--full-width'],
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
