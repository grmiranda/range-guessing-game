import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  MAX_NAME_LENGTH,
  MAX_TARGET_SCORE,
  MIN_TARGET_SCORE,
} from '../../../constants/game'
import type { SetupErrors } from '../../../types/game'
import { hasSetupErrors, normalizeName, validateSetup } from '../../../utils/game/validation'
import Button from '../../atoms/Button/Button'
import NumberInput from '../../atoms/NumberInput/NumberInput'
import TextInput from '../../atoms/TextInput/TextInput'
import FormField from '../../molecules/FormField/FormField'
import styles from './SetupForm.module.scss'

interface SetupFormProps {
  initialNames: [string, string]
  initialTargetScore: number
  onSubmit: (names: [string, string], targetScore: number) => void
}

const NAME_FIELDS = [
  { id: 'player-1-name', label: 'Jogador 1' },
  { id: 'player-2-name', label: 'Jogador 2' },
] as const

const TARGET_SCORE_ID = 'target-score'

function errorId(id: string, error: string | null | undefined): string | undefined {
  return error ? `${id}-error` : undefined
}

export default function SetupForm({
  initialNames,
  initialTargetScore,
  onSubmit,
}: SetupFormProps) {
  const [names, setNames] = useState<[string, string]>(initialNames)
  const [targetScore, setTargetScore] = useState<number | ''>(initialTargetScore)
  const [errors, setErrors] = useState<SetupErrors | null>(null)

  function handleNameChange(index: 0 | 1, value: string) {
    setNames((current) => (index === 0 ? [value, current[1]] : [current[0], value]))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const score = targetScore === '' ? Number.NaN : targetScore
    const nextErrors = validateSetup(names, score)
    setErrors(nextErrors)
    if (hasSetupErrors(nextErrors)) return
    onSubmit([normalizeName(names[0]), normalizeName(names[1])], score)
  }

  const targetScoreError = errors?.targetScore

  return (
    <form className={styles['setup-form']} onSubmit={handleSubmit} noValidate>
      {NAME_FIELDS.map(({ id, label }, index) => {
        const playerIndex = index as 0 | 1
        const error = errors?.names[playerIndex]
        return (
          <FormField key={id} id={id} label={label} error={error}>
            <TextInput
              id={id}
              value={names[playerIndex]}
              onChange={(value) => handleNameChange(playerIndex, value)}
              maxLength={MAX_NAME_LENGTH}
              invalid={Boolean(error)}
              describedBy={errorId(id, error)}
            />
          </FormField>
        )
      })}
      <FormField id={TARGET_SCORE_ID} label="Pontos para vencer" error={targetScoreError}>
        <NumberInput
          id={TARGET_SCORE_ID}
          value={targetScore}
          onChange={setTargetScore}
          min={MIN_TARGET_SCORE}
          max={MAX_TARGET_SCORE}
          step={1}
          invalid={Boolean(targetScoreError)}
          describedBy={errorId(TARGET_SCORE_ID, targetScoreError)}
        />
      </FormField>
      <div className={styles['setup-form__actions']}>
        <Button type="submit" fullWidth>
          Começar partida
        </Button>
      </div>
    </form>
  )
}
