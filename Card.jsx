import { useTheme } from '../../context/ThemeContext'

export default function Card({ children, className = '', glow = false, onClick }) {
  const { isDark } = useTheme()

  return (
    <div
      onClick={onClick}
      className={`card ${isDark ? 'card-dark' : 'card-light'} p-5 ${glow ? (isDark ? 'glow-cyan' : '') : ''} ${onClick ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
