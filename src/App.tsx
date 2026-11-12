import ScreenRouter from './components/pages/ScreenRouter/ScreenRouter'
import GameProvider from './context/GameProvider'

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  )
}
