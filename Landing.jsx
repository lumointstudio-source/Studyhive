import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const features = [
  { icon: '⏱️', title: 'Focus Timer', desc: 'Pomodoro-style timer to stay laser-focused on your studies.' },
  { icon: '🔥', title: 'Study Streaks', desc: 'Build daily habits and maintain study streaks for motivation.' },
  { icon: '📊', title: 'CGPA Tracker', desc: 'Calculate your GPA per semester and track your academic progress.' },
  { icon: '📅', title: 'Exam Countdown', desc: 'Never miss an exam again with live countdown timers.' },
  { icon: '🗓️', title: 'Weekly Timetable', desc: 'Plan your entire week with a clean visual class timetable.' },
  { icon: '👥', title: 'Group Study', desc: 'Create virtual study rooms and compete with friends on a leaderboard.' },
]

export default function Landing() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-20 border-b backdrop-blur-lg ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐝</span>
            <span className="font-heading font-bold text-xl gradient-text">StudyHive</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link to="/dashboard" className="btn-primary text-sm px-4 py-2">
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-5 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00E5FF, #6C5CE7)' }} />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
            style={{ background: '#00E5FF10', borderColor: '#00E5FF30', color: '#00E5FF' }}>
            🎓 Built for Nigerian University Students
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Your Academic Edge{' '}
            <span className="gradient-text">Starts Here</span>
          </h1>

          <p className={`text-lg leading-relaxed mb-8 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            StudyHive helps you plan smarter, study harder, and track every step of your academic journey — all in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5">
              🚀 Open Dashboard
            </Link>
            <Link to="/timer" className="btn-ghost text-base px-8 py-3.5">
              ⏱️ Start Timer
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { value: '9', label: 'Core Features' },
              { value: '100%', label: 'Free to Use' },
              { value: '0', label: 'Login Needed' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-heading font-bold gradient-text">{s.value}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 px-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl mb-2">Everything You Need</h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Built specifically for the Nigerian university experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`p-5 rounded-2xl border transition-all duration-200 hover:border-cyan-500/40 animate-slide-up stagger-${i + 1}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: '#00E5FF10' }}
                >
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-base mb-1">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 px-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-3xl border"
            style={{ background: 'linear-gradient(135deg, #00E5FF08, #6C5CE708)', borderColor: '#00E5FF20' }}>
            <div className="text-4xl mb-4">🐝</div>
            <h2 className="font-heading font-bold text-2xl mb-3">Ready to Join the Hive?</h2>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No sign-up needed. Just open your dashboard and start studying smarter today.
            </p>
            <Link to="/dashboard" className="btn-primary px-8 py-3.5 text-base">
              Open Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 px-5 border-t text-center ${isDark ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
        <p className="text-xs">StudyHive © {new Date().getFullYear()} — Built for Nigerian students 🇳🇬</p>
      </footer>
    </div>
  )
}
