import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useModal from './useModal'

describe('useModal', () => {
  it('começa fechado por padrão', () => {
    const { result } = renderHook(() => useModal())
    expect(result.current.isOpen).toBe(false)
  })

  it('respeita initialOpen', () => {
    const { result } = renderHook(() => useModal(true))
    expect(result.current.isOpen).toBe(true)
  })

  it('abre e fecha', () => {
    const { result } = renderHook(() => useModal())

    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('alterna o estado com toggle', () => {
    const { result } = renderHook(() => useModal())

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })

  it('mantém a identidade das funções', () => {
    const { result, rerender } = renderHook(() => useModal())
    const { open, close, toggle } = result.current

    act(() => result.current.open())
    rerender()

    expect(result.current.open).toBe(open)
    expect(result.current.close).toBe(close)
    expect(result.current.toggle).toBe(toggle)
  })
})
