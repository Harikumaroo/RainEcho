import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchNotifications, markNotificationsRead } from '../api/weatherApi'

export default function NotificationCenter({ user }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const { data } = await fetchNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Failed to load notifications', err)
    }
  }

  const handleDismiss = async () => {
    try {
      await markNotificationsRead()
      setNotifications([])
    } catch (err) {
      console.error('Failed to dismiss notifications', err)
    }
  }

  if (!user || notifications.length === 0) return null

  return (
    <div className="w-full mb-6">
      <AnimatePresence>
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`relative overflow-hidden mb-3 p-5 rounded-2xl shadow-lg border ${
              note.alert_type === 'danger'
                ? 'bg-red-50/90 border-red-200 text-red-900'
                : note.alert_type === 'warning'
                ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                : 'bg-blue-50/90 border-blue-200 text-blue-900'
            } backdrop-blur-md`}
          >
            {/* Background Icon/Gradient Decorator */}
            <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                {note.alert_type === 'danger' && (
                  <path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4M11 16v2h2v-2" />
                )}
                {note.alert_type === 'warning' && (
                  <path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4M11 16v2h2v-2" />
                )}
                {note.alert_type === 'info' && (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                )}
              </svg>
            </div>

            <div className="flex justify-between items-start z-10 relative">
              <div className="flex gap-3">
                <span className="text-2xl mt-1">
                  {note.alert_type === 'danger' ? '🚨' : note.alert_type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <h4 className="font-bold text-lg">{note.title}</h4>
                  <p className="mt-1 font-medium opacity-90">{note.message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-end mt-2">
        <button
          onClick={handleDismiss}
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white/90 px-4 py-2 rounded-full border border-gray-200 shadow-sm transition"
        >
          Dismiss All
        </button>
      </div>
    </div>
  )
}
