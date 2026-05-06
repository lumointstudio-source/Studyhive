import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import StudyTimer from './pages/StudyTimer'
import CGPATracker from './pages/CGPATracker'
import ExamCountdown from './pages/ExamCountdown'
import Timetable from './pages/Timetable'
import GroupStudy from './pages/GroupStudy'
import Profile from './pages/Profile'
import NotificationSettings from './pages/NotificationSettings'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timer" element={<StudyTimer />} />
            <Route path="/cgpa" element={<CGPATracker />} />
            <Route path="/exams" element={<ExamCountdown />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/group-study" element={<GroupStudy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
