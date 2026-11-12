import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  MAX_NAME_LENGTH,
  MAX_TARGET_SCORE,
  MIN_TARGET_SCORE,
} from '../../../constants/game'
import { SETUP_ERROR_MESSAGES } from '../../../utils/game/validation'
import SetupForm from './SetupForm'

function renderForm(names: [string, string] = ['', ''], targetScore = 10) {
  const onSubmit = vi.fn()
  render(<SetupForm initialNames={names} initialTargetScore={targetScore} onSubmit={onSubmit} />)
  return { onSubmit }
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Começar partida' }))

describe('SetupForm', () => {
  it('renderiza os campos com os valores iniciais', () => {
    renderForm(['Ana', 'Bia'], 15)
    const first = screen.getByLabelText('Jogador 1')
    const second = screen.getByLabelText('Jogador 2')
    const target = screen.getByLabelText('Pontos para vencer')
    expect(first).toHaveAttribute('id', 'player-1-name')
    expect(first).toHaveValue('Ana')
    expect(first).toHaveAttribute('maxlength', String(MAX_NAME_LENGTH))
    expect(second).toHaveAttribute('id', 'player-2-name')
    expect(second).toHaveValue('Bia')
    expect(target).toHaveAttribute('id', 'target-score')
    expect(target).toHaveValue(15)
    expect(target).toHaveAttribute('min', String(MIN_TARGET_SCORE))
    expect(target).toHaveAttribute('max', String(MAX_TARGET_SCORE))
    expect(screen.getByRole('button', { name: 'Começar partida' })).toHaveAttribute(
      'type',
      'submit',
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('mostra erros e não envia quando os nomes estão vazios', async () => {
    const { onSubmit } = renderForm()
    await submit()
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent(SETUP_ERROR_MESSAGES.emptyName)
    const first = screen.getByLabelText('Jogador 1')
    expect(first).toHaveAttribute('aria-invalid', 'true')
    expect(first).toHaveAttribute('aria-describedby', 'player-1-name-error')
    expect(first).toHaveAccessibleDescription(SETUP_ERROR_MESSAGES.emptyName)
    expect(screen.getByLabelText('Pontos para vencer')).not.toHaveAttribute('aria-describedby')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('acusa nomes repetidos no segundo jogador', async () => {
    const { onSubmit } = renderForm(['Ana', ' ana '])
    await submit()
    expect(screen.getByRole('alert')).toHaveTextContent(SETUP_ERROR_MESSAGES.duplicateName)
    expect(screen.getByLabelText('Jogador 2')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Jogador 1')).toHaveAttribute('aria-invalid', 'false')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('mostra erro ao limpar o campo de meta', async () => {
    const { onSubmit } = renderForm(['Ana', 'Bia'])
    const target = screen.getByLabelText('Pontos para vencer')
    await userEvent.clear(target)
    await submit()
    expect(screen.getByRole('alert')).toHaveTextContent(SETUP_ERROR_MESSAGES.invalidTargetScore)
    expect(target).toHaveAttribute('aria-invalid', 'true')
    expect(target).toHaveAccessibleDescription(SETUP_ERROR_MESSAGES.invalidTargetScore)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('mostra erro quando a meta está fora do limite', async () => {
    const { onSubmit } = renderForm(['Ana', 'Bia'], MAX_TARGET_SCORE + 1)
    await submit()
    expect(screen.getByRole('alert')).toHaveTextContent(SETUP_ERROR_MESSAGES.invalidTargetScore)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia nomes normalizados e a meta quando válido', async () => {
    const { onSubmit } = renderForm()
    await userEvent.type(screen.getByLabelText('Jogador 1'), '  Ana   Maria ')
    await userEvent.type(screen.getByLabelText('Jogador 2'), 'Bia')
    const target = screen.getByLabelText('Pontos para vencer')
    await userEvent.clear(target)
    await userEvent.type(target, '12')
    await submit()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(['Ana Maria', 'Bia'], 12)
  })

  it('limpa os erros depois de corrigir e reenviar', async () => {
    const { onSubmit } = renderForm(['', 'Bia'])
    await submit()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Jogador 1'), 'Ana')
    await submit()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledWith(['Ana', 'Bia'], 10)
  })
})
