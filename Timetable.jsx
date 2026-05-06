import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useTheme } from '../context/ThemeContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const COLORS = ['#00E5FF', '#6C5CE7', '#22C55E', '#F97316', '#EF4444', '#F59E0B', '#EC4899', '#8B5CF6']

const emptyForm = { code: '', title: '', day: 'Monday', startTime: '08:00', endTime: '10:00', venue: '' }

export default function Timetable() {
  const { isDark } = useTheme()
  const [entries, setEntries] = useLocalStorage('studyhive_timetable', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [activeDay, setActiveDay] = useState(
    DAYS[new Date().getDay() - 1] || 'Monday'
  )

  const getColor = (code) => {
    let hash = 0
    for (let c of code) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return COLORS[Math.abs(hash) % COLORS.length]
  }

  const handleSubmit = () => {
    if (!form.code.trim() || !form.title.trim()) return
    if (editId) {
      setEntries(entries.map(e => e.id === editId ? { ...form, id: editId } : e))
      setEditId(null)
    } else {
      setEntries([...entries, { ...form, id: Date.now().toString() }])
    }
    setForm(emptyForm)
    setShowModal(false)
  }

  const handleEdit = (entry) => {
    setForm({ code: entry.code, title: entry.title, day: entry.day, startTime: entry.startTime, endTime: entry.endTime, venue: entry.venue })
    setEditId(entry.id)
    setShowModal(true)
  }

  const handleDelete = (id) => setEntries(entries.filter(e => e.id !== id))

  const handleCloseModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  const dayEntries = entries
    .filter(e => e.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">🗓️ Weekly Timetable</h1>
          <p className="page-subtitle">Plan your weekly class schedule.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-1">+ Add Class</button>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeDay === day
                ? 'text-slate-900'
                : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
            style={activeDay === day ? { background: 'linear-gradient(135deg, #00E5FF, #6C5CE7)' } : {}}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Day entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
            {activeDay} · {dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {dayEntries.length === 0 ? (
          <Card>
            <EmptyState
              icon="🗓️"
              title={`No classes on ${activeDay}`}
              message="Add a class to your schedule for this day."
              action={
                <button onClick={() => { setForm({ ...emptyForm, day: activeDay }); setShowModal(true) }} className="btn-primary">
                  + Add Class
                </button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {dayEntries.map((entry, i) => {
              const color = getColor(entry.code)
              return (
                <Card key={entry.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-1 h-12 rounded-full" style={{ background: color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${color}18`, color }}>
                          {entry.code}
                        </span>
                        <span className="text-xs text-slate-500">{entry.startTime} – {entry.endTime}</span>
                      </div>
                      <p className="font-semibold text-sm">{entry.title}</p>
                      {entry.venue && (
                        <p className="text-xs text-slate-500 mt-0.5">📍 {entry.venue}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={() => handleEdit(entry)}
                        className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} text-slate-400`}>
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(entry.id)}
                        className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} text-danger`}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Weekly overview */}
      {entries.length > 0 && (
        <Card>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Weekly Overview</p>
          <div className="space-y-2">
            {DAYS.map(day => {
              const count = entries.filter(e => e.day === day).length
              return (
                <div key={day} className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveDay(day)}>
                  <span className="text-xs w-8 text-slate-400">{day.slice(0, 3)}</span>
                  <div className="flex-1 progress-bar">
                    <div className="progress-fill" style={{ width: count > 0 ? `${Math.min(count * 20, 100)}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editId ? 'Edit Class' : 'Add Class'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Course Code</label>
              <input className="input-field" placeholder="e.g., CSC301" value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
            <div>
              <label className="label">Day</label>
              <select className="input-field" value={form.day}
                onChange={e => setForm({ ...form, day: e.target.value })}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Course Title</label>
            <input className="input-field" placeholder="e.g., Data Structures" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Time</label>
              <input type="time" className="input-field" value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <label className="label">End Time</label>
              <input type="time" className="input-field" value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Venue</label>
            <input className="input-field" placeholder="e.g., LT2, Faculty Block A" value={form.venue}
              onChange={e => setForm({ ...form, venue: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCloseModal} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              {editId ? 'Save Changes' : 'Add Class'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
