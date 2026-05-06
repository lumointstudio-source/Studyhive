import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function Modal({ isOpen, onClose, title, children }) {
  const { isDark } = useTheme()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-lg rounded-2xl border animate-scale-in max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <h2 className="font-heading font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
