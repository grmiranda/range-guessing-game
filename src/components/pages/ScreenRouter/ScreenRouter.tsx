import useGameState from '../../../hooks/useGameState'
import GamePage from '../GamePage/GamePage'
import HomePage from '../HomePage/HomePage'
import VictoryPage from '../VictoryPage/VictoryPage'

export default function ScreenRouter() {
  const { screen } = useGameState()

  switch (screen) {
    case 'setup':
      return <HomePage />
    case 'game':
      return <GamePage />
    case 'victory':
      return <VictoryPage />
  }
}
