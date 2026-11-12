import { describe, expect, it } from 'vitest'
import { DEFAULT_TARGET_SCORE, DIAL_CENTER } from '../../constants/game'
import type { GameState, Round, Spectrum } from '../../types/game'
import {
  createInitialState,
  gameReducer,
  getGuesserId,
} from './gameReducer'
import type { GameAction } from './gameReducer'

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const key of Object.keys(value)) {
      deepFreeze((value as Record<string, unknown>)[key])
    }
  }
  return value
}

function makeDeck(size: number, prefix = 'E'): Spectrum[] {
  return Array.from({ length: size }, (_, index) => ({
    left: `${prefix}${index}-esq`,
    right: `${prefix}${index}-dir`,
  }))
}

function reduce(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(
    (current, action) => gameReducer(deepFreeze(current), action),
    state,
  )
}

function startGame(
  deck: Spectrum[] = makeDeck(5),
  targetScore = DEFAULT_TARGET_SCORE,
): GameState {
  return reduce(createInitialState(), {
    type: 'START_GAME',
    names: ['Ana', 'Bruno'],
    targetScore,
    deck,
  })
}

function toPhase(state: GameState, phase: Round['phase']): GameState {
  const steps: GameAction[] = [
    { type: 'SPIN_TARGET', targetAngle: 100 },
    { type: 'HIDE_TARGET' },
    { type: 'START_GUESS' },
    { type: 'SUBMIT_GUESS' },
  ]
  const order: Round['phase'][] = [
    'psychicHandoff',
    'psychicView',
    'guessHandoff',
    'guessing',
    'reveal',
  ]
  return reduce(state, ...steps.slice(0, order.indexOf(phase)))
}

function playRound(
  state: GameState,
  targetAngle: number,
  guessAngle: number,
  reshuffledDeck: Spectrum[] = makeDeck(3, 'R'),
): GameState {
  const revealed = reduce(
    state,
    { type: 'SPIN_TARGET', targetAngle },
    { type: 'HIDE_TARGET' },
    { type: 'START_GUESS' },
    { type: 'SET_GUESS', angle: guessAngle },
    { type: 'SUBMIT_GUESS' },
  )
  return reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck })
}

function getRound(state: GameState): Round {
  if (state.round === null) throw new Error('Rodada ausente')
  return state.round
}

function withScores(state: GameState, first: number, second: number): GameState {
  return {
    ...state,
    players: [
      { ...state.players[0], score: first },
      { ...state.players[1], score: second },
    ],
  }
}

const ALL_ACTIONS: GameAction[] = [
  { type: 'START_GAME', names: ['Ana', 'Bruno'], targetScore: 10, deck: makeDeck(2) },
  { type: 'SPIN_TARGET', targetAngle: 50 },
  { type: 'HIDE_TARGET' },
  { type: 'START_GUESS' },
  { type: 'SET_GUESS', angle: 30 },
  { type: 'SUBMIT_GUESS' },
  { type: 'NEXT_ROUND', reshuffledDeck: makeDeck(2) },
  { type: 'RESTART' },
  { type: 'ABORT_GAME' },
]

describe('createInitialState', () => {
  it('usa valores padrão', () => {
    expect(createInitialState()).toEqual({
      screen: 'setup',
      players: [
        { id: 0, name: '', score: 0 },
        { id: 1, name: '', score: 0 },
      ],
      targetScore: DEFAULT_TARGET_SCORE,
      round: null,
      spectrumDeck: [],
      winnerId: null,
      isTiebreak: false,
    })
  })

  it('aceita nomes e meta personalizados', () => {
    const state = createInitialState(['Ana', 'Bruno'], 15)
    expect(state.players.map((player) => player.name)).toEqual(['Ana', 'Bruno'])
    expect(state.targetScore).toBe(15)
  })
})

describe('getGuesserId', () => {
  it('retorna o outro jogador', () => {
    expect(getGuesserId(0)).toBe(1)
    expect(getGuesserId(1)).toBe(0)
  })
})

describe('START_GAME', () => {
  it('inicia a partida com a primeira rodada', () => {
    const deck = makeDeck(3)
    const state = reduce(createInitialState(), {
      type: 'START_GAME',
      names: ['  Ana   Maria ', ' Bruno '],
      targetScore: 12,
      deck,
    })
    expect(state).toEqual({
      screen: 'game',
      players: [
        { id: 0, name: 'Ana Maria', score: 0 },
        { id: 1, name: 'Bruno', score: 0 },
      ],
      targetScore: 12,
      round: {
        number: 1,
        psychicId: 0,
        phase: 'psychicHandoff',
        spectrum: deck[0],
        targetAngle: null,
        guessAngle: DIAL_CENTER,
        guesserPoints: null,
        psychicPoints: null,
      },
      spectrumDeck: deck.slice(1),
      winnerId: null,
      isTiebreak: false,
    })
    expect(deck).toHaveLength(3)
  })

  it.each([
    { names: ['', 'Bruno'] as [string, string], targetScore: 10 },
    { names: ['Ana', 'ana'] as [string, string], targetScore: 10 },
    { names: ['Ana', 'Bruno'] as [string, string], targetScore: 2 },
  ])('ignora configuração inválida %#', ({ names, targetScore }) => {
    const initial = deepFreeze(createInitialState())
    const action: GameAction = { type: 'START_GAME', names, targetScore, deck: makeDeck(3) }
    expect(gameReducer(initial, action)).toBe(initial)
  })

  it('ignora baralho vazio', () => {
    const initial = deepFreeze(createInitialState())
    const action: GameAction = {
      type: 'START_GAME',
      names: ['Ana', 'Bruno'],
      targetScore: 10,
      deck: [],
    }
    expect(gameReducer(initial, action)).toBe(initial)
  })

  it('é ignorado fora da tela de configuração', () => {
    const game = deepFreeze(startGame())
    expect(gameReducer(game, ALL_ACTIONS[0])).toBe(game)
  })
})

describe('transições de fase', () => {
  it('SPIN_TARGET leva à visão do Psíquico com o alvo limitado ao mostrador', () => {
    const state = reduce(startGame(), { type: 'SPIN_TARGET', targetAngle: 120 })
    expect(getRound(state).phase).toBe('psychicView')
    expect(getRound(state).targetAngle).toBe(120)

    const clamped = reduce(startGame(), { type: 'SPIN_TARGET', targetAngle: 999 })
    expect(getRound(clamped).targetAngle).toBe(180)
  })

  it('HIDE_TARGET leva à passagem para o palpite', () => {
    const state = reduce(toPhase(startGame(), 'psychicView'), { type: 'HIDE_TARGET' })
    expect(getRound(state).phase).toBe('guessHandoff')
  })

  it('START_GUESS leva ao palpite', () => {
    const state = reduce(toPhase(startGame(), 'guessHandoff'), { type: 'START_GUESS' })
    expect(getRound(state).phase).toBe('guessing')
  })

  it('SET_GUESS atualiza o ângulo limitado ao mostrador', () => {
    const guessing = toPhase(startGame(), 'guessing')
    expect(getRound(reduce(guessing, { type: 'SET_GUESS', angle: 45 })).guessAngle).toBe(45)
    expect(getRound(reduce(guessing, { type: 'SET_GUESS', angle: -10 })).guessAngle).toBe(0)
    expect(getRound(reduce(guessing, { type: 'SET_GUESS', angle: 200 })).guessAngle).toBe(180)
    expect(getRound(reduce(guessing, { type: 'SET_GUESS', angle: 45 })).phase).toBe('guessing')
  })

  it('SUBMIT_GUESS revela e pontua', () => {
    const state = reduce(
      toPhase(startGame(), 'guessing'),
      { type: 'SET_GUESS', angle: 100 },
      { type: 'SUBMIT_GUESS' },
    )
    const round = getRound(state)
    expect(round.phase).toBe('reveal')
    expect(round.guesserPoints).toBe(6)
    expect(round.psychicPoints).toBe(3)
  })

  it('SUBMIT_GUESS é ignorado se não houver alvo definido', () => {
    const game = startGame()
    const broken = deepFreeze({
      ...game,
      round: { ...getRound(game), phase: 'guessing' as const },
    })
    expect(gameReducer(broken, { type: 'SUBMIT_GUESS' })).toBe(broken)
  })

  it('NEXT_ROUND inicia a próxima rodada', () => {
    const deck = makeDeck(3)
    const state = reduce(toPhase(startGame(deck), 'reveal'), {
      type: 'NEXT_ROUND',
      reshuffledDeck: [],
    })
    expect(state.screen).toBe('game')
    expect(state.round).toEqual({
      number: 2,
      psychicId: 1,
      phase: 'psychicHandoff',
      spectrum: deck[1],
      targetAngle: null,
      guessAngle: DIAL_CENTER,
      guesserPoints: null,
      psychicPoints: null,
    })
    expect(state.spectrumDeck).toEqual(deck.slice(2))
  })
})

describe('ações inválidas', () => {
  const phases: Round['phase'][] = [
    'psychicHandoff',
    'psychicView',
    'guessHandoff',
    'guessing',
    'reveal',
  ]
  const validByPhase: Record<Round['phase'], GameAction['type'][]> = {
    psychicHandoff: ['SPIN_TARGET', 'ABORT_GAME'],
    psychicView: ['HIDE_TARGET', 'ABORT_GAME'],
    guessHandoff: ['START_GUESS', 'ABORT_GAME'],
    guessing: ['SET_GUESS', 'SUBMIT_GUESS', 'ABORT_GAME'],
    reveal: ['NEXT_ROUND', 'ABORT_GAME'],
  }

  for (const phase of phases) {
    for (const action of ALL_ACTIONS) {
      if (validByPhase[phase].includes(action.type)) continue
      it(`${action.type} na fase ${phase} mantém a mesma referência`, () => {
        const state = deepFreeze(toPhase(startGame(), phase))
        expect(gameReducer(state, action)).toBe(state)
      })
    }
  }

  for (const action of ALL_ACTIONS) {
    if (action.type === 'START_GAME') continue
    it(`${action.type} na configuração mantém a mesma referência`, () => {
      const state = deepFreeze(createInitialState())
      expect(gameReducer(state, action)).toBe(state)
    })
  }

  for (const action of ALL_ACTIONS) {
    if (action.type === 'RESTART') continue
    it(`${action.type} na vitória mantém a mesma referência`, () => {
      const revealed = withScores(toPhase(startGame(), 'reveal'), 10, 3)
      const victory = deepFreeze(
        reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] }),
      )
      expect(victory.screen).toBe('victory')
      expect(gameReducer(victory, action)).toBe(victory)
    })
  }
})

describe('pontuação', () => {
  it('com o Psíquico 0, o jogador 1 recebe os pontos do palpite', () => {
    const state = reduce(
      toPhase(startGame(), 'guessing'),
      { type: 'SET_GUESS', angle: 110 },
      { type: 'SUBMIT_GUESS' },
    )
    expect(getRound(state).guesserPoints).toBe(4)
    expect(state.players[0].score).toBe(2)
    expect(state.players[1].score).toBe(4)
  })

  it('com o Psíquico 1, o jogador 0 recebe os pontos do palpite', () => {
    const second = playRound(startGame(), 50, 150)
    expect(getRound(second).psychicId).toBe(1)
    const state = reduce(
      second,
      { type: 'SPIN_TARGET', targetAngle: 60 },
      { type: 'HIDE_TARGET' },
      { type: 'START_GUESS' },
      { type: 'SET_GUESS', angle: 78 },
      { type: 'SUBMIT_GUESS' },
    )
    expect(getRound(state).guesserPoints).toBe(2)
    expect(state.players[0].score).toBe(2)
    expect(state.players[1].score).toBe(1)
  })

  it('palpite fora das zonas não pontua', () => {
    const state = reduce(
      toPhase(startGame(), 'guessing'),
      { type: 'SET_GUESS', angle: 0 },
      { type: 'SUBMIT_GUESS' },
    )
    expect(getRound(state).guesserPoints).toBe(0)
    expect(getRound(state).psychicPoints).toBe(0)
    expect(state.players.map((player) => player.score)).toEqual([0, 0])
  })
})

describe('rodadas e baralho', () => {
  it('alterna o Psíquico a cada rodada', () => {
    let state = startGame(makeDeck(10), 50)
    const psychics: number[] = [getRound(state).psychicId]
    for (let index = 0; index < 4; index++) {
      state = playRound(state, 50, 150)
      psychics.push(getRound(state).psychicId)
    }
    expect(psychics).toEqual([0, 1, 0, 1, 0])
    expect(getRound(state).number).toBe(5)
  })

  it('consome o baralho e usa o baralho reembaralhado quando ele acaba', () => {
    const deck = makeDeck(2)
    const reshuffled = makeDeck(3, 'R')
    const second = playRound(startGame(deck), 50, 150, reshuffled)
    expect(getRound(second).spectrum).toEqual(deck[1])
    expect(second.spectrumDeck).toEqual([])

    const third = playRound(second, 50, 150, reshuffled)
    expect(getRound(third).spectrum).toEqual(reshuffled[0])
    expect(third.spectrumDeck).toEqual(reshuffled.slice(1))
  })

  it('não avança quando o baralho e o reembaralhado estão vazios', () => {
    const revealed = deepFreeze(toPhase(startGame(makeDeck(1)), 'reveal'))
    expect(gameReducer(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })).toBe(
      revealed,
    )
  })
})

describe('vitória e desempate', () => {
  it('vai para a vitória quando alguém atinge a meta', () => {
    const revealed = withScores(toPhase(startGame(), 'reveal'), 4, 11)
    const state = reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })
    expect(state.screen).toBe('victory')
    expect(state.winnerId).toBe(1)
    expect(state.isTiebreak).toBe(false)
    expect(state.round).toBe(revealed.round)
  })

  it('marca desempate e continua quando há empate na meta', () => {
    const revealed = withScores(toPhase(startGame(), 'reveal'), 10, 10)
    const state = reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })
    expect(state.screen).toBe('game')
    expect(state.isTiebreak).toBe(true)
    expect(state.winnerId).toBeNull()
    expect(getRound(state).number).toBe(2)
    expect(getRound(state).psychicId).toBe(1)
  })

  it('não marca desempate quando o empate está abaixo da meta', () => {
    const revealed = withScores(toPhase(startGame(), 'reveal'), 6, 6)
    const state = reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })
    expect(state.isTiebreak).toBe(false)
    expect(state.screen).toBe('game')
  })

  it('resolve o desempate na rodada seguinte', () => {
    const revealed = withScores(toPhase(startGame(), 'reveal'), 10, 10)
    const tiebreak = reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })
    expect(tiebreak.isTiebreak).toBe(true)

    const state = playRound(tiebreak, 90, 90)
    expect(state.screen).toBe('victory')
    expect(state.winnerId).toBe(0)
    expect(state.isTiebreak).toBe(false)
    expect(state.players.map((player) => player.score)).toEqual([16, 13])
  })
})

describe('RESTART e ABORT_GAME', () => {
  it('RESTART volta à configuração preservando nomes e meta', () => {
    const revealed = withScores(toPhase(startGame(makeDeck(3), 15), 'reveal'), 20, 3)
    const victory = reduce(revealed, { type: 'NEXT_ROUND', reshuffledDeck: [] })
    const state = reduce(victory, { type: 'RESTART' })
    expect(state).toEqual(createInitialState(['Ana', 'Bruno'], 15))
  })

  it('ABORT_GAME volta à configuração preservando nomes e meta', () => {
    const game = withScores(toPhase(startGame(makeDeck(3), 20), 'guessing'), 5, 7)
    const state = reduce(game, { type: 'ABORT_GAME' })
    expect(state).toEqual(createInitialState(['Ana', 'Bruno'], 20))
  })
})

describe('imutabilidade', () => {
  it('não altera o estado anterior nem os jogadores', () => {
    const guessing = deepFreeze(
      reduce(toPhase(startGame(), 'guessing'), { type: 'SET_GUESS', angle: 100 }),
    )
    const snapshot = structuredClone(guessing)
    const revealed = gameReducer(guessing, { type: 'SUBMIT_GUESS' })
    expect(guessing).toEqual(snapshot)
    expect(revealed.players).not.toBe(guessing.players)
    expect(revealed.players[0]).not.toBe(guessing.players[0])
    expect(revealed.players[1]).not.toBe(guessing.players[1])
    expect(revealed.round).not.toBe(guessing.round)
  })
})

describe('partida completa', () => {
  it('joga até a vitória de forma determinística', () => {
    let state = startGame(makeDeck(2), 10)
    const rounds: [number, number][] = [
      [90, 90],
      [60, 70],
      [120, 135],
    ]
    const scores: number[][] = []
    for (const [target, guess] of rounds) {
      expect(state.screen).toBe('game')
      state = playRound(state, target, guess, makeDeck(4, 'R'))
      scores.push(state.players.map((player) => player.score))
    }
    expect(scores).toEqual([
      [3, 6],
      [7, 8],
      [8, 10],
    ])
    expect(state.screen).toBe('victory')
    expect(state.winnerId).toBe(1)
    expect(state.players.map((player) => player.score)).toEqual([8, 10])
    expect(getRound(state).number).toBe(3)
  })
})
