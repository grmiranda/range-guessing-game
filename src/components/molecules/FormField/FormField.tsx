import type { ReactNode } from 'react'
import styles from './FormField.module.scss'

interface FormFieldProps {
  id: string
  label: string
  error?: string | null
  children: ReactNode
}

export default function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className={styles['form-field']}>
      <label htmlFor={id} className={styles['form-field__label']}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={styles['form-field__error']}>
          {error}
        </p>
      )}
    </div>
  )
}
