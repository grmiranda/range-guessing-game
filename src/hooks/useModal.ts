import { useCallback, useState } from 'react'

export interface ModalControls {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export default function useModal(initialOpen = false): ModalControls {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])
  return { isOpen, open, close, toggle }
}
