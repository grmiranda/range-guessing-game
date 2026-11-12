import { describe, expect, it } from 'vitest'
import classNames from './classNames'

describe('classNames', () => {
  it('junta as classes com espaço', () => {
    expect(classNames('a', 'b', 'c')).toBe('a b c')
  })

  it('ignora valores falsos', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('retorna string vazia sem valores válidos', () => {
    expect(classNames()).toBe('')
    expect(classNames(false, null)).toBe('')
  })
})
