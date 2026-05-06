import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getStreakData } from '../utils/streakUtils'
import { calculateGPA, getGPAClass } from '../utils/gpaCalculator'
import { minutesToHours } from '../utils/dateUtils'
import Card from '../components/ui/Card'

const LEVELS = ['100L', '200L', '300L', '400L', '500L', '600L', 'Postgraduate']

const defaultProfile = {
  name: '',
  university: '',
  department: '',
  level: '100L',
  matNo: '',
}

export default function Profile() {
  const [profile, setProfile] = useLocalStorage('studyhive_profile', defaultProfile)
  const [form, setForm] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const streak = getStreakData()
  const courses = JSON.parse(localStorage.getItem('studyhive_courses') || '[]')
  const { gpa } = calculateGPA(courses)
  const gpaClass = getGPAClass(gpa)

  const handleSave = () => {
    setProfile(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    setForm(profile)
    setEditing(false)
  }

  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Your academic identity and stats.</p>
      </div>

      {/* Avatar & name */}
      <Card glow>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-heading font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #6C5CE7)' }}>
            {profile.name ? initials : '🐝'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-xl truncate">
              {profile.name || 'Your Name'}
            </h2>
            <p className="text-sm text-slate-400 truncate">
              {profile.university || 'University'} · {profile.department || 'Department'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile.level} {profile.matNo && `· ${profile.matNo}`}
            </p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-ghost flex-shrink-0">
              Edit ✏️
            </button>
          )}
        </div>
      </Card>

      {/* Edit form */}
      {editing && (
        <Card className="animate-scale-in">
          <h3 className="font-heading font-semibold text-sm mb-4">Edit Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" placeholder="e.g., Chidi Okonkwo" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">University</label>
              <input className="input-field" placeholder="e.g., University of Lagos" value={form.university}
                onChange={e => setForm({ ...form, university: e.target.value })} />
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input-field" placeholder="e.g., Computer Science" value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Level</label>
                <select className="input-field" value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Mat. Number</label>
                <input className="input-field" placeholder="e.g., 190401001" value={form.matNo}
                  onChange={e => setForm({ ...form, matNo: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleCancel} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1">
                {saved ? '✅ Saved!' : 'Save Profile'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Academic Stats</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🔥', label: 'Current Streak', value: `${streak.current} days`, color: '#F97316' },
            { icon: '🏆', label: 'Longest Streak', value: `${streak.longest} days`, color: '#F59E0B' },
            { icon: '📚', label: 'Sessions Done', value: streak.completedSessions, color: '#00E5FF' },
            { icon: '⏰', label: 'Study Hours', value: minutesToHours(streak.totalMinutes), color: '#6C5CE7' },
          ].map(stat => (
            <Card key={stat.label}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="font-heading font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* GPA */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Current CGPA</p>
            <p className="font-heading font-black text-4xl" style={{ color: gpaClass.color }}>
              {gpa.toFixed(2)}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${gpaClass.color}18`, color: gpaClass.color }}>
              {gpaClass.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-slate-500 mt-1">Tracked in CGPA tool</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(gpa / 5) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0.0</span>
            <span>5.0 Max</span>
          </div>
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Achievements</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🔥', label: 'First Streak', unlocked: streak.current >= 1 },
            { icon: '📅', label: '7-Day Streak', unlocked: streak.longest >= 7 },
            { icon: '📚', label: '10 Sessions', unlocked: streak.completedSessions >= 10 },
            { icon: '⏰', label: '10 Hours', unlocked: streak.totalMinutes >= 600 },
            { icon: '🎓', label: 'First Class', unlocked: gpa >= 4.5 },
            { icon: '🏆', label: '30-Day Streak', unlocked: streak.longest >= 30 },
            { icon: '💪', label: '50 Sessions', unlocked: streak.completedSessions >= 50 },
            { icon: '⭐', label: 'Consistent', unlocked: streak.current >= 14 },
          ].map(badge => (
            <div key={badge.label} className={`text-center ${badge.unlocked ? '' : 'opacity-30'}`}>
              <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-2xl mb-1 ${
                badge.unlocked ? '' : 'grayscale'
              }`}
                style={{ background: badge.unlocked ? '#00E5FF15' : '#1E293B' }}>
                {badge.icon}
              </div>
              <p className="text-xs text-slate-400 leading-tight">{badge.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
