import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import ExtractPage from './pages/ExtractPage'
import ColorizePage from './pages/ColorizePage'
import RecommendPage from './pages/RecommendPage'
import PalettesPage from './pages/PalettesPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <main className="flex-1 ml-[240px] transition-all duration-300">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/extract" element={<ExtractPage />} />
          <Route path="/colorize" element={<ColorizePage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/palettes" element={<PalettesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
