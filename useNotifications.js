import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const isSupported = typeof Notification !== 'undefined'

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'unsupported'
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (e) {
      return 'denied'
    }
  }, [isSupported])

  const sendNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') return
    try {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options,
      })
    } catch (e) {
      console.error('Notification error:', e)
    }
  }, [isSupported, permission])

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('studyhive_notifications') || '{}')
    if (!settings.enabled || !settings.reminderTime || permission !== 'granted') return

    const checkReminder = () => {
      const now = new Date()
      const [h, m] = settings.reminderTime.split(':').map(Number)
      if (now.getHours() === h && now.getMinutes() === m) {
        sendNotification('📚 Study Reminder', {
          body: "It's time for your study session! Open StudyHive to start.",
          tag: 'daily-reminder',
        })
      }
    }

    const interval = setInterval(checkReminder, 60000)
    return () => clearInterval(interval)
  }, [permission, sendNotification])

  return { isSupported, permission, requestPermission, sendNotification }
}
