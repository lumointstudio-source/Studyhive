import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function TopBar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className={`lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 border-b ${
      isDark ? 'bg-slate-900/95 border-slate-800 backdrop-blur-lg' : 'bg-white border-slate-200 backdrop-blur-lg'
    }`}>
      <NavLink to="/" className="flex items-center gap-2">
        <span className="text-xl">🐝</span>
        <span className="font-heading font-bold text-lg gradient-text">StudyHive</span>
      </NavLink>

      <div className="flex items-center gap-2">
        <NavLink
          to="/notifications"
          className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
        >
          <span className="text-lg">🔔</span>
        </NavLink>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
        >
          <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  )
}
