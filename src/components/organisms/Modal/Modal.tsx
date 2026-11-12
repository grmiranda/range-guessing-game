import { useEffect, useId } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import Button from '../../atoms/Button/Button'
import styles from './Modal.module.scss'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div
        className={styles.modal__dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.modal__header}>
          <h2 id={titleId} className={styles.modal__title}>
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </div>
  )
}
