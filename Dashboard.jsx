import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkAndUpdateStreak, getStreakData } from '../utils/streakUtils'
import { calculateGPA, getGPAClass } from '../utils/gpaCalculator'
import { getDaysUntil, minutesToHours, formatDate } from '../utils/dateUtils'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'

const quickLinks = [
  { to: '/timer', icon: '⏱️', label: 'Start Timer', color: '#00E5FF' },
  { to: '/cgpa', icon: '📊', label: 'CGPA', color: '#6C5CE7' },
  { to: '/exams', icon: '📅', label: 'Exams', color: '#F97316' },
  { to: '/timetable', icon: '🗓️', label: 'Timetable', color: '#22C55E' },
  { to: '/group-study', icon: '👥', label: 'Group Study', color: '#00E5FF' },
  { to: '/notifications', icon: '🔔', label: 'Reminders', color: '#6C5CE7' },
]

export default function Dashboard() {
  const [streak, setStreak] = useState({ current: 0, longest: 0, completedSessions: 0, totalMinutes: 0 })
  const [gpa, setGpa] = useState({ gpa: 0 })
  const [exams, setExams] = useState([])
  const [profile, setProfile] = useState({})
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const updated = checkAndUpdateStreak()
    setStreak(updated)

    const courses = JSON.parse(localStorage.getItem('studyhive_courses') || '[]')
    setGpa(calculateGPA(courses))

    const savedExams = JSON.parse(localStorage.getItem('studyhive_exams') || '[]')
    const upcoming = savedExams
      .filter(e => !getDaysUntil(`${e.date}T${e.time || '00:00'}`).isPast)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
    setExams(upcoming)

    const p = JSON.parse(localStorage.getItem('studyhive_profile') || '{}')
    setProfile(p)

    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const gpaClass = getGPAClass(gpa.gpa)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{greeting} 👋</p>
            <h1 className="page-title font-heading">
              {profile.name ? profile.name.split(' ')[0] : 'Scholar'}
            </h1>
          </div>
          {streak.current > 0 && (
            <div className="streak-badge">
              🔥 {streak.current} day streak
            </div>
          )}
        </div>
        {profile.university && (
          <p className="text-xs text-slate-500 mt-1">{profile.university} · {profile.department}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon="🔥" label="Study Streak" value={`${streak.current}d`}
          sub={`Best: ${streak.longest}d`} color="#F97316"
          className="animate-slide-up stagger-1"
        />
        <StatCard
          icon="📚" label="Sessions" value={streak.completedSessions}
          sub="Completed" color="#00E5FF"
          className="animate-slide-up stagger-2"
        />
        <StatCard
          icon="⏰" label="Study Hours" value={minutesToHours(streak.totalMinutes)}
          sub="Total logged" color="#6C5CE7"
          className="animate-slide-up stagger-3"
        />
        <StatCard
          icon="🎓" label="CGPA" value={gpa.gpa.toFixed(2)}
          sub={gpaClass.label} color={gpaClass.color}
          className="animate-slide-up stagger-4"
        />
      </div>

      {/* CTA */}
      <Card glow className="animate-slide-up stagger-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-semibold text-base mb-1">Ready to focus?</h2>
            <p className="text-sm text-slate-400">Start a study session and build your streak.</p>
          </div>
          <Link to="/timer" className="btn-primary flex-shrink-0 ml-4">
            Start ⚡
          </Link>
        </div>
      </Card>

      {/* Upcoming Exams */}
      {exams.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-slate-400">
              Upcoming Exams
            </h2>
            <Link to="/exams" className="text-xs text-cyan-400 hover:underline">See all →</Link>
          </div>
          <div className="space-y-3">
            {exams.map(exam => {
              const countdown = getDaysUntil(`${exam.date}T${exam.time || '00:00'}`)
              return (
                <Card key={exam.id} className="animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{exam.title}</p>
                      <p className="text-xs text-slate-500">{exam.code} · {formatDate(exam.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      {countdown.days === 0 ? (
                        <span className="text-xs font-bold text-danger">Today!</span>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: countdown.days <= 3 ? '#EF4444' : '#F97316' }}>
                          {countdown.days}d {countdown.hours}h
                        </span>
                      )}
                      <p className="text-xs text-slate-500">remaining</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-slate-400 mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`card ${true ? 'card-dark' : 'card-light'} p-4 flex flex-col items-center gap-2 text-center hover:scale-[1.02] transition-transform animate-slide-up stagger-${i + 1}`}
              style={{ borderColor: `${link.color}20` }}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-xs font-medium text-slate-400">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Reminder card */}
      <Card className="border-dashed animate-slide-up">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-medium">Pro Tip</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Set up your profile and notification reminders to get the most out of StudyHive.
            </p>
          </div>
          <Link to="/profile" className="btn-ghost text-xs flex-shrink-0 ml-auto">
            Setup →
          </Link>
        </div>
      </Card>
    </div>
  )
}
