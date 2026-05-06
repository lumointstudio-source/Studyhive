import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNotifications } from '../hooks/useNotifications'
import Card from '../components/ui/Card'

const defaultSettings = {
  enabled: false,
  reminderTime: '08:00',
  sessionComplete: true,
  examReminder: true,
}

export default function NotificationSettings() {
  const { isSupported, permission, requestPermission, sendNotification } = useNotifications()
  const [settings, setSettings] = useLocalStorage('studyhive_notifications', defaultSettings)
  const [requesting, setRequesting] = useState(false)
  const [testSent, setTestSent] = useState(false)

  const handleRequestPermission = async () => {
    setRequesting(true)
    await requestPermission()
    setRequesting(false)
  }

  const handleToggle = async (key) => {
    if (key === 'enabled' && !settings.enabled) {
      if (permission !== 'granted') {
        const result = await requestPermission()
        if (result !== 'granted') return
      }
    }
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleTestNotification = () => {
    sendNotification('🐝 StudyHive Test', {
      body: 'Notifications are working! You\'re all set.',
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">🔔 Notifications</h1>
        <p className="page-subtitle">Set up study reminders and alerts.</p>
      </div>

      {/* Support status */}
      {!isSupported ? (
        <Card>
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm">Notifications Not Supported</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Your browser does not support notifications. Try using Chrome, Firefox, or Edge for the best experience.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Permission status */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">{permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '🔔'}</span>
                <div>
                  <p className="font-semibold text-sm">Browser Permission</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {permission === 'granted'
                      ? 'Notifications are allowed. You\'re all set!'
                      : permission === 'denied'
                      ? 'Permission was denied. Please allow notifications in your browser settings.'
                      : 'Click to enable browser notifications.'}
                  </p>
                </div>
              </div>
              {permission !== 'granted' && permission !== 'denied' && (
                <button
                  onClick={handleRequestPermission}
                  disabled={requesting}
                  className="btn-primary flex-shrink-0 text-xs px-4 py-2"
                >
                  {requesting ? 'Asking...' : 'Enable'}
                </button>
              )}
              {permission === 'granted' && (
                <span className="text-xs text-success font-semibold flex-shrink-0">Enabled ✓</span>
              )}
            </div>
          </Card>

          {/* Settings */}
          {permission === 'granted' && (
            <>
              <Card>
                <h3 className="font-heading font-semibold text-sm mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  {/* Daily reminder toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Daily Study Reminder</p>
                      <p className="text-xs text-slate-400 mt-0.5">Get reminded to study at your set time</p>
                    </div>
                    <button
                      onClick={() => handleToggle('enabled')}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${
                        settings.enabled ? '' : 'bg-slate-700'
                      }`}
                      style={settings.enabled ? { background: 'linear-gradient(135deg, #00E5FF, #6C5CE7)' } : {}}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow ${
                        settings.enabled ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Reminder time */}
                  {settings.enabled && (
                    <div className="animate-scale-in">
                      <label className="label">Reminder Time</label>
                      <input
                        type="time"
                        className="input-field"
                        value={settings.reminderTime}
                        onChange={e => setSettings({ ...settings, reminderTime: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 mt-1.5">
                        Reminder fires while the website is open in your browser.
                      </p>
                    </div>
                  )}

                  {/* Session complete */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <div>
                      <p className="text-sm font-medium">Session Complete Alert</p>
                      <p className="text-xs text-slate-400 mt-0.5">Notify when a study session ends</p>
                    </div>
                    <button
                      onClick={() => handleToggle('sessionComplete')}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${
                        settings.sessionComplete ? '' : 'bg-slate-700'
                      }`}
                      style={settings.sessionComplete ? { background: 'linear-gradient(135deg, #00E5FF, #6C5CE7)' } : {}}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow ${
                        settings.sessionComplete ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Test notification */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Test Notification</p>
                    <p className="text-xs text-slate-400 mt-0.5">Send a test notification to verify it's working</p>
                  </div>
                  <button
                    onClick={handleTestNotification}
                    className="btn-ghost text-xs px-4 py-2 flex-shrink-0"
                  >
                    {testSent ? '✅ Sent!' : '🔔 Test'}
                  </button>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* How it works */}
      <Card>
        <h3 className="font-heading font-semibold text-sm mb-3">ℹ️ How It Works</h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex gap-2"><span className="text-cyan-400">•</span> Notifications use the browser's built-in notification API</li>
          <li className="flex gap-2"><span className="text-cyan-400">•</span> Daily reminders only fire while the website is open</li>
          <li className="flex gap-2"><span className="text-cyan-400">•</span> No service workers or background push notifications</li>
          <li className="flex gap-2"><span className="text-cyan-400">•</span> All settings are saved to your local browser storage</li>
          <li className="flex gap-2"><span className="text-cyan-400">•</span> To stop notifications, toggle off or deny permission in browser settings</li>
        </ul>
      </Card>
    </div>
  )
}
