import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { to: '/dashboard', icon: '⚡', label: 'Home' },
  { to: '/timer', icon: '⏱️', label: 'Timer' },
  { to: '/cgpa', icon: '📊', label: 'CGPA' },
  { to: '/exams', icon: '📅', label: 'Exams' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  const { isDark } = useTheme()

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t ${
      isDark ? 'bg-slate-900/95 border-slate-800 backdrop-blur-lg' : 'bg-white border-slate-200 backdrop-blur-lg'
    }`}>
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `bottom-nav-link flex-1 text-center py-1 ${isActive ? 'active' : ''}`
            }
          >
            <div className="text-xl mb-0.5">{item.icon}</div>
            <div className="text-xs font-medium">{item.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
