export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDaysUntil(dateStr) {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes, isPast: false }
}

export function isToday(dateStr) {
  const today = new Date().toDateString()
  return new Date(dateStr).toDateString() === today
}

export function toDateString(date = new Date()) {
  return date.toISOString().split('T')[0]
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function minutesToHours(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}
