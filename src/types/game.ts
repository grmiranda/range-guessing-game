export type PlayerId = 0 | 1

export interface Player {
  id: PlayerId
  name: string
  score: number
}

export interface Spectrum {
  left: string
  right: string
}

export type Screen = 'setup' | 'game' | 'victory'

export type RoundPhase =
  | 'psychicHandoff'
  | 'psychicView'
  | 'guessHandoff'
  | 'guessing'
  | 'reveal'

export type GuessPoints = 0 | 2 | 4 | 6

export interface Round {
  number: number
  psychicId: PlayerId
  phase: RoundPhase
  spectrum: Spectrum
  targetAngle: number | null
  guessAngle: number
  guesserPoints: GuessPoints | null
  psychicPoints: number | null
}

export interface GameState {
  screen: Screen
  players: [Player, Player]
  targetScore: number
  round: Round | null
  spectrumDeck: Spectrum[]
  winnerId: PlayerId | null
  isTiebreak: boolean
}

export type RandomFn = () => number

export interface SetupErrors {
  names: [string | null, string | null]
  targetScore: string | null
}
