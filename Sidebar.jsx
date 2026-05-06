import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/dashboard', icon: '⚡', label: 'Dashboard' },
  { to: '/timer', icon: '⏱️', label: 'Study Timer' },
  { to: '/cgpa', icon: '📊', label: 'CGPA Tracker' },
  { to: '/exams', icon: '📅', label: 'Exam Countdown' },
  { to: '/timetable', icon: '🗓️', label: 'Timetable' },
  { to: '/group-study', icon: '👥', label: 'Group Study' },
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/notifications', icon: '🔔', label: 'Notifications' },
]

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside className={`hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full border-r z-20 ${
      isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800/50">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🐝</span>
          <span className="font-heading font-bold text-xl gradient-text">StudyHive</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-4 border-t border-slate-800/50">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDark
              ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  )
}
