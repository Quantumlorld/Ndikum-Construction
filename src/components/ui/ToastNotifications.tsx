'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useAppState } from '@/store/ProductionState'
import { Notification } from '@/types'

const NOTIFICATION_TIMEOUT = 4000 // 4 seconds

export function ToastNotifications() {
  const { state, dispatch } = useAppState()

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // Auto-remove notifications after timeout
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    state.notifications.forEach((notification: Notification) => {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })
      }, NOTIFICATION_TIMEOUT)
      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [state.notifications, dispatch])

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {state.notifications.slice(-3).map((notification: Notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
