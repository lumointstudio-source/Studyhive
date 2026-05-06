import { useState, useEffect, useRef, useCallback } from 'react'
import { recordStudySession, getStreakData } from '../utils/streakUtils'
import { minutesToHours } from '../utils/dateUtils'
import { useNotifications } from '../hooks/useNotifications'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'

const DURATIONS = [15, 25, 45, 60]

export default function StudyTimer() {
  const [selectedDuration, setSelectedDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [streak, setStreak] = useState({ current: 0, completedSessions: 0, totalMinutes: 0 })
  const intervalRef = useRef(null)
  const { sendNotification } = useNotifications()

  useEffect(() => {
    setStreak(getStreakData())
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleComplete = useCallback(() => {
    const updated = recordStudySession(selectedDuration)
    setStreak(updated)
    sendNotification('🎉 Session Complete!', {
      body: `Great job! You studied for ${selectedDuration} minutes. Keep it up!`,
    })
    setIsComplete(false)
    setTimeLeft(selectedDuration * 60)
  }, [selectedDuration, sendNotification])

  const handleDurationSelect = (dur) => {
    if (isRunning) return
    setSelectedDuration(dur)
    setTimeLeft(dur * 60)
    setIsComplete(false)
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setIsComplete(false)
    setTimeLeft(selectedDuration * 60)
  }

  const progress = 1 - timeLeft / (selectedDuration * 60)
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">⏱️ Study Timer</h1>
        <p className="page-subtitle">Focus, track, and build your study habit.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon="🔥" label="Streak" value={`${streak.current}d`} color="#F97316" />
        <StatCard icon="📚" label="Sessions" value={streak.completedSessions} color="#00E5FF" />
        <StatCard icon="⏰" label="Total" value={minutesToHours(streak.totalMinutes)} color="#6C5CE7" />
      </div>

      {/* Duration selector */}
      <Card>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Session Duration</p>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map(d => (
            <button
              key={d}
              onClick={() => handleDurationSelect(d)}
              disabled={isRunning}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedDuration === d
                  ? 'text-slate-900 shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              style={selectedDuration === d ? { background: 'linear-gradient(135deg, #00E5FF, #6C5CE7)' } : {}}
            >
              {d}m
            </button>
          ))}
        </div>
      </Card>

      {/* Timer circle */}
      <Card glow className="flex flex-col items-center py-8">
        <div className="relative" style={{ width: 220, height: 220 }}>
          <svg width="220" height="220" className="absolute inset-0">
            {/* Background ring */}
            <circle
              cx="110" cy="110" r={radius}
              fill="none" stroke="#1E293B" strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="110" cy="110" r={radius}
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="timer-ring transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-5xl tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {isRunning ? 'Focusing...' : isComplete ? 'Done! 🎉' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={isComplete}
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-slate-900 disabled:opacity-50"
              style={{ background: isComplete ? '#22C55E' : 'linear-gradient(135deg, #00E5FF, #6C5CE7)' }}
            >
              {isComplete ? '✅ Done' : '▶ Start'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 rounded-xl font-semibold text-sm bg-warning text-slate-900"
            >
              ⏸ Pause
            </button>
          )}
          <button onClick={handleReset} className="btn-ghost px-5 py-3">
            ↺ Reset
          </button>
        </div>

        {/* Complete session button */}
        {isComplete && (
          <div className="mt-4 text-center animate-scale-in">
            <p className="text-sm text-success mb-3">🎉 Session complete! Great work!</p>
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-success text-slate-900"
            >
              ✅ Save Session
            </button>
          </div>
        )}

        {/* Progress text */}
        <div className="mt-4 w-full max-w-xs">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="text-xs text-center text-slate-500 mt-1.5">
            {Math.round(progress * 100)}% complete
          </p>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <h3 className="font-heading font-semibold text-sm mb-3">📖 Study Tips</h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex gap-2"><span>•</span> Use the 25-min Pomodoro technique for best focus</li>
          <li className="flex gap-2"><span>•</span> Put your phone on silent before starting</li>
          <li className="flex gap-2"><span>•</span> Take a 5-min break between sessions</li>
          <li className="flex gap-2"><span>•</span> Study at the same time each day to build habit</li>
        </ul>
      </Card>
    </div>
  )
}
