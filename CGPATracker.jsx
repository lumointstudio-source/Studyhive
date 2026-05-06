import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateGPA, getGPAClass, getGradeColor, GRADE_POINTS } from '../utils/gpaCalculator'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { useTheme } from '../context/ThemeContext'

const GRADES = ['A', 'B', 'C', 'D', 'E', 'F']

const emptyForm = { code: '', title: '', units: '3', grade: 'A' }

export default function CGPATracker() {
  const { isDark } = useTheme()
  const [courses, setCourses] = useLocalStorage('studyhive_courses', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const { gpa, totalUnits, totalPoints } = calculateGPA(courses)
  const gpaClass = getGPAClass(gpa)

  const handleSubmit = () => {
    if (!form.code.trim() || !form.title.trim()) return
    if (editId) {
      setCourses(courses.map(c => c.id === editId ? { ...form, id: editId } : c))
      setEditId(null)
    } else {
      setCourses([...courses, { ...form, id: Date.now().toString() }])
    }
    setForm(emptyForm)
    setShowModal(false)
  }

  const handleEdit = (course) => {
    setForm({ code: course.code, title: course.title, units: course.units, grade: course.grade })
    setEditId(course.id)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setCourses(courses.filter(c => c.id !== id))
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">📊 CGPA Tracker</h1>
          <p className="page-subtitle">Track your grades and calculate GPA.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-1">+ Add Course</button>
      </div>

      {/* GPA Summary */}
      <Card glow>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Semester GPA</p>
            <p className="font-heading font-black text-5xl mt-1" style={{ color: gpaClass.color }}>
              {gpa.toFixed(2)}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${gpaClass.color}18`, color: gpaClass.color }}>
              {gpaClass.label}
            </span>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-xs text-slate-400">Total Units</p>
              <p className="font-bold text-lg">{totalUnits}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Grade Points</p>
              <p className="font-bold text-lg">{totalPoints.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* GPA progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>0.0</span>
            <span>5.0</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(gpa / 5) * 100}%` }} />
          </div>
        </div>
      </Card>

      {/* Grade reference */}
      <Card>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Grade Reference</p>
        <div className="grid grid-cols-6 gap-2">
          {GRADES.map(g => (
            <div key={g} className="text-center">
              <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-sm font-bold"
                style={{ background: `${getGradeColor(g)}18`, color: getGradeColor(g) }}>
                {g}
              </div>
              <p className="text-xs text-slate-500 mt-1">{GRADE_POINTS[g]}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Course list */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
          Courses ({courses.length})
        </p>
        {courses.length === 0 ? (
          <Card>
            <EmptyState
              icon="📚"
              title="No Courses Yet"
              message="Add your first course to start tracking your GPA."
              action={
                <button onClick={() => setShowModal(true)} className="btn-primary">
                  + Add Course
                </button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {courses.map((course, i) => (
              <Card key={course.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${getGradeColor(course.grade)}18`, color: getGradeColor(course.grade) }}>
                    {course.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{course.title}</p>
                    <p className="text-xs text-slate-400">{course.code} · {course.units} units</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-500">
                      {(GRADE_POINTS[course.grade] * Number(course.units)).toFixed(1)} pts
                    </span>
                    <button
                      onClick={() => handleEdit(course)}
                      className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors text-slate-400`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className={`p-1.5 rounded-lg text-xs ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors text-danger`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={editId ? 'Edit Course' : 'Add Course'}>
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
              <label className="label">Unit Load</label>
              <select className="input-field" value={form.units}
                onChange={e => setForm({ ...form, units: e.target.value })}>
                {[1, 2, 3, 4, 5, 6].map(u => (
                  <option key={u} value={u}>{u} unit{u > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Grade</label>
              <select className="input-field" value={form.grade}
                onChange={e => setForm({ ...form, grade: e.target.value })}>
                {GRADES.map(g => (
                  <option key={g} value={g}>{g} ({GRADE_POINTS[g]} pts)</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCloseModal} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              {editId ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
