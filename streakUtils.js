import { toDateString } from './dateUtils'

const STREAK_KEY = 'studyhive_streak'

export function getStreakData() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || {
      current: 0,
      longest: 0,
      lastStudyDate: null,
      completedSessions: 0,
      totalMinutes: 0,
    }
  } catch {
    return {
      current: 0,
      longest: 0,
      lastStudyDate: null,
      completedSessions: 0,
      totalMinutes: 0,
    }
  }
}

export function saveStreakData(data) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function recordStudySession(durationMinutes) {
  const data = getStreakData()
  const today = toDateString()
  const yesterday = toDateString(new Date(Date.now() - 86400000))

  let newCurrent = data.current

  // Only increment streak once per day
  if (data.lastStudyDate !== today) {
    if (data.lastStudyDate === yesterday) {
      newCurrent = data.current + 1
    } else {
      newCurrent = 1
    }
  }

  const updated = {
    current: newCurrent,
    longest: Math.max(data.longest, newCurrent),
    lastStudyDate: today,
    completedSessions: data.completedSessions + 1,
    totalMinutes: data.totalMinutes + durationMinutes,
  }

  saveStreakData(updated)
  return updated
}

export function checkAndUpdateStreak() {
  const data = getStreakData()
  const today = toDateString()
  const yesterday = toDateString(new Date(Date.now() - 86400000))

  if (!data.lastStudyDate) return data

  // Reset streak if missed a day
  if (data.lastStudyDate !== today && data.lastStudyDate !== yesterday) {
    const updated = { ...data, current: 0 }
    saveStreakData(updated)
    return updated
  }

  return data
}
