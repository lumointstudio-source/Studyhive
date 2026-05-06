import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getDaysUntil, formatDate } from '../utils/dateUtils'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useTheme } from '../context/ThemeContext'

const emptyForm = { code: '', title: '', date: '', time: '09:00' }

function CountdownTimer({ exam }) {
  const [countdown, setCountdown] = useState(getDaysUntil(`${exam.date}T${exam.time}`))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getDaysUntil(`${exam.date}T${exam.time}`))
    }, 60000)
    return () => clearInterval(interval)
  }, [exam])

  if (countdown.isPast) {
    return <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400">Completed</span>
  }

  const urgency = countdown.days <= 1 ? '#EF4444' : countdown.days <= 3 ? '#F97316' : countdown.days <= 7 ? '#F59E0B' : '#00E5FF'

  return (
    <div className="text-right flex-shrink-0">
      <div className="flex items-baseline gap-1 justify-end">
        <span className="font-heading font-black text-2xl" style={{ color: urgency }}>{countdown.days}</span>
        <span className="text-xs text-slate-500">days</span>
        <span className="font-bold text-base" style={{ color: urgency }}>{countdown.hours}</span>
        <span className="text-xs text-slate-500">hrs</span>
        <span className="font-bold text-base" style={{ color: urgency }}>{countdown.minutes}</span>
        <span className="text-xs text-slate-500">min</span>
      </div>
      {countdown.days <= 3 && (
        <span className="text-xs font-semibold" style={{ color: urgency }}>
          {countdown.days === 0 ? '🚨 Today!' : `⚠️ ${countdown.days} day${countdown.days > 1 ? 's' : ''} left!`}
        </span>
      )}
    </div>
  )
}

export default function ExamCountdown() {
  const { isDark } = useTheme()
  const [exams, setExams] = useLocalStorage('studyhive_exams', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const upcoming = exams
    .filter(e => !getDaysUntil(`${e.date}T${e.time}`).isPast)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const past = exams
    .filter(e => getDaysUntil(`${e.date}T${e.time}`).isPast)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleSubmit = () => {
    if (!form.code.trim() || !form.title.trim() || !form.date) return
    if (editId) {
      setExams(exams.map(e => e.id === editId ? { ...form, id: editId } : e))
      setEditId(null)
    } else {
      setExams([...exams, { ...form, id: Date.now().toString() }])
    }
    setForm(emptyForm)
    setShowModal(false)
  }

  const handleEdit = (exam) => {
    setForm({ code: exam.code, title: exam.title, date: exam.date, time: exam.time })
    setEditId(exam.id)
    setShowModal(true)
  }

  const handleDelete = (id) => setExams(exams.filter(e => e.id !== id))

  const handleCloseModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">📅 Exam Countdown</h1>
          <p className="page-subtitle">Track your exams and never miss a deadline.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-1">+ Add Exam</button>
      </div>

      {/* Upcoming */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
          Upcoming ({upcoming.length})
        </p>
        {upcoming.length === 0 ? (
          <Card>
            <EmptyState
              icon="📅"
              title="No Upcoming Exams"
              message="Add your exam schedule to start tracking countdowns."
              action={
                <button onClick={() => setShowModal(true)} className="btn-primary">
                  + Add Exam
                </button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((exam, i) => (
              <Card key={exam.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                        {exam.code}
                      </span>
                    </div>
                    <p className="font-semibold text-sm">{exam.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(exam.date)} at {exam.time}</p>
                  </div>
                  <CountdownTimer exam={exam} />
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(exam)}
                      className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors text-slate-400`}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(exam.id)}
                      className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors text-danger`}>
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
            Past Exams ({past.length})
          </p>
          <div className="space-y-2">
            {past.map(exam => (
              <Card key={exam.id} className="opacity-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{exam.title}</p>
                    <p className="text-xs text-slate-500">{exam.code} · {formatDate(exam.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Done</span>
                    <button onClick={() => handleDelete(exam.id)}
                      className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} text-danger`}>
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editId ? 'Edit Exam' : 'Add Exam'}>
        <div className="space-y-4">
          <div>
            <label className="label">Course Code</label>
            <input className="input-field" placeholder="e.g., CSC301" value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="label">Course Title</label>
            <input className="input-field" placeholder="e.g., Data Structures" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Exam Date</label>
              <input type="date" className="input-field" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label">Exam Time</label>
              <input type="time" className="input-field" value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCloseModal} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              {editId ? 'Save Changes' : 'Add Exam'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
