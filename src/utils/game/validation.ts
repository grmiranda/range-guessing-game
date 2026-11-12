import {
  MAX_NAME_LENGTH,
  MAX_TARGET_SCORE,
  MIN_TARGET_SCORE,
} from '../../constants/game'
import type { SetupErrors } from '../../types/game'

export const SETUP_ERROR_MESSAGES = {
  emptyName: 'Informe o nome do jogador.',
  nameTooLong: `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
  duplicateName: 'Os nomes devem ser diferentes.',
  invalidTargetScore: `A meta deve ser um número inteiro entre ${MIN_TARGET_SCORE} e ${MAX_TARGET_SCORE}.`,
} as const

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function validateName(name: string): string | null {
  if (name.length === 0) return SETUP_ERROR_MESSAGES.emptyName
  if (name.length > MAX_NAME_LENGTH) return SETUP_ERROR_MESSAGES.nameTooLong
  return null
}

export function validateSetup(
  names: [string, string],
  targetScore: number,
): SetupErrors {
  const first = normalizeName(names[0])
  const second = normalizeName(names[1])

  const firstError = validateName(first)
  let secondError = validateName(second)
  if (
    secondError === null &&
    first.toLocaleLowerCase('pt-BR') === second.toLocaleLowerCase('pt-BR')
  ) {
    secondError = SETUP_ERROR_MESSAGES.duplicateName
  }

  const isValidTarget =
    Number.isInteger(targetScore) &&
    targetScore >= MIN_TARGET_SCORE &&
    targetScore <= MAX_TARGET_SCORE

  return {
    names: [firstError, secondError],
    targetScore: isValidTarget ? null : SETUP_ERROR_MESSAGES.invalidTargetScore,
  }
}

export function hasSetupErrors(errors: SetupErrors): boolean {
  return (
    errors.names[0] !== null ||
    errors.names[1] !== null ||
    errors.targetScore !== null
  )
}
