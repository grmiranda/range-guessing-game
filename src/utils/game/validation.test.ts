import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TARGET_SCORE,
  MAX_NAME_LENGTH,
  MAX_TARGET_SCORE,
  MIN_TARGET_SCORE,
} from '../../constants/game'
import type { SetupErrors } from '../../types/game'
import { hasSetupErrors, normalizeName, validateSetup } from './validation'

const EMPTY = 'Informe o nome do jogador.'
const TOO_LONG = 'O nome deve ter no máximo 20 caracteres.'
const DUPLICATE = 'Os nomes devem ser diferentes.'
const INVALID_TARGET = 'A meta deve ser um número inteiro entre 5 e 50.'

describe('normalizeName', () => {
  it('apara as pontas e junta espaços internos', () => {
    expect(normalizeName('  Ana   Maria \t Silva  ')).toBe('Ana Maria Silva')
  })

  it('retorna string vazia para só espaços', () => {
    expect(normalizeName('   ')).toBe('')
  })
})

describe('validateSetup', () => {
  it('não retorna erros para dados válidos', () => {
    expect(validateSetup(['Ana', 'Bia'], DEFAULT_TARGET_SCORE)).toEqual({
      names: [null, null],
      targetScore: null,
    })
  })

  it('exige os dois nomes', () => {
    expect(validateSetup(['', '   '], DEFAULT_TARGET_SCORE).names).toEqual([
      EMPTY,
      EMPTY,
    ])
  })

  it('aceita nomes com exatamente o tamanho máximo', () => {
    const name = 'a'.repeat(MAX_NAME_LENGTH)
    expect(validateSetup([name, 'Bia'], DEFAULT_TARGET_SCORE).names[0]).toBeNull()
  })

  it('rejeita nomes longos demais', () => {
    const name = 'a'.repeat(MAX_NAME_LENGTH + 1)
    expect(validateSetup([name, `b${name}`], DEFAULT_TARGET_SCORE).names).toEqual(
      [TOO_LONG, TOO_LONG],
    )
  })

  it('mede o tamanho depois de normalizar', () => {
    const name = `  ${'a'.repeat(MAX_NAME_LENGTH)}  `
    expect(validateSetup([name, 'Bia'], DEFAULT_TARGET_SCORE).names[0]).toBeNull()
  })

  it('rejeita nomes iguais apenas no segundo jogador', () => {
    expect(validateSetup(['Ana', '  ana '], DEFAULT_TARGET_SCORE).names).toEqual([
      null,
      DUPLICATE,
    ])
    expect(
      validateSetup(['Ana  Maria', 'ANA MARIA'], DEFAULT_TARGET_SCORE).names,
    ).toEqual([null, DUPLICATE])
  })

  it('prioriza o erro de nome vazio sobre o de repetido', () => {
    expect(validateSetup(['', ''], DEFAULT_TARGET_SCORE).names[1]).toBe(EMPTY)
  })

  it.each([MIN_TARGET_SCORE, 25, MAX_TARGET_SCORE])('aceita a meta %s', (score) => {
    expect(validateSetup(['Ana', 'Bia'], score).targetScore).toBeNull()
  })

  it.each([
    MIN_TARGET_SCORE - 1,
    MAX_TARGET_SCORE + 1,
    7.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])('rejeita a meta %s', (score) => {
    expect(validateSetup(['Ana', 'Bia'], score).targetScore).toBe(INVALID_TARGET)
  })
})

describe('hasSetupErrors', () => {
  const noErrors: SetupErrors = { names: [null, null], targetScore: null }

  it('retorna false sem erros', () => {
    expect(hasSetupErrors(noErrors)).toBe(false)
  })

  it('detecta erro em qualquer campo', () => {
    expect(hasSetupErrors({ ...noErrors, names: [EMPTY, null] })).toBe(true)
    expect(hasSetupErrors({ ...noErrors, names: [null, DUPLICATE] })).toBe(true)
    expect(hasSetupErrors({ ...noErrors, targetScore: INVALID_TARGET })).toBe(true)
  })
})
