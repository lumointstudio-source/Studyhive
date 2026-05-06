import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import { useTheme } from '../../context/ThemeContext'

export default function AppLayout() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950' : 'light bg-slate-50'}`}>
      <Sidebar />
      <TopBar />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
