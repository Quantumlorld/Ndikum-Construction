'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, ProductionState, Notification, AppState, AppAction } from '@/types'

// Constants
const STORAGE_KEYS = {
  USER: 'ndikum_user',
  AUTH: 'ndikum_auth',
  PRODUCTION: 'ndikum_production'
} as const

const NOTIFICATION_TIMEOUT = 4000 // 4 seconds
const MAX_NOTIFICATIONS = 3

// Initial state
const initialProductionState: ProductionState = {
  isRunning: false,
  outputRate: 2847,
  efficiency: 94.2,
  activeMachines: 0,
  totalMachines: 12,
  productionTime: 0,
  lastUpdate: new Date()
}

const getInitialState = (): AppState => {
  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH)
      const savedProduction = localStorage.getItem(STORAGE_KEYS.PRODUCTION)

      return {
        user: savedUser ? JSON.parse(savedUser) : null,
        isAuthenticated: savedAuth === 'true',
        production: savedProduction ? { ...JSON.parse(savedProduction), lastUpdate: new Date() } : initialProductionState,
        notifications: []
      }
    } catch (error) {
      console.warn('Error loading state from localStorage:', error)
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    production: initialProductionState,
    notifications: []
  }
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const newState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        notifications: [
          ...state.notifications.slice(-MAX_NOTIFICATIONS + 1),
          {
            id: Date.now().toString(),
            type: 'success' as const,
            message: `Welcome back, ${action.payload.name}! System access granted.`,
            timestamp: new Date()
          }
        ]
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload))
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true')
      }

      return newState

    case 'LOGOUT':
      const loggedOutState = {
        ...state,
        user: null,
        isAuthenticated: false,
        production: {
          ...initialProductionState,
          lastUpdate: new Date()
        },
        notifications: [
          ...state.notifications.slice(-MAX_NOTIFICATIONS + 1),
          {
            id: Date.now().toString(),
            type: 'info' as const,
            message: 'System access revoked. Goodbye!',
            timestamp: new Date()
          }
        ]
      }

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.AUTH)
        localStorage.removeItem(STORAGE_KEYS.PRODUCTION)
      }

      return loggedOutState

    case 'START_PRODUCTION':
      const startedState = {
        ...state,
        production: {
          ...state.production,
          isRunning: true,
          activeMachines: state.production.totalMachines,
          lastUpdate: new Date()
        },
        notifications: [
          ...state.notifications.slice(-MAX_NOTIFICATIONS + 1),
          {
            id: Date.now().toString(),
            type: 'success' as const,
            message: 'Production system started successfully.',
            timestamp: new Date()
          }
        ]
      }

      // Save production state
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(startedState.production))
      }

      return startedState

    case 'PAUSE_PRODUCTION':
      const pausedState = {
        ...state,
        production: {
          ...state.production,
          isRunning: false,
          activeMachines: 0,
          lastUpdate: new Date()
        },
        notifications: [
          ...state.notifications.slice(-MAX_NOTIFICATIONS + 1),
          {
            id: Date.now().toString(),
            type: 'warning' as const,
            message: 'Production system paused.',
            timestamp: new Date()
          }
        ]
      }

      // Save production state
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(pausedState.production))
      }

      return pausedState

    case 'UPDATE_PRODUCTION':
      const updatedState = {
        ...state,
        production: {
          ...state.production,
          ...action.payload,
          lastUpdate: new Date()
        }
      }

      // Save production state
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(updatedState.production))
      }

      return updatedState

    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date()
      }

      const notificationState = {
        ...state,
        notifications: [...state.notifications.slice(-MAX_NOTIFICATIONS + 1), newNotification]
      }

      // Auto-remove notification after timeout
      setTimeout(() => {
        // This will be handled by the component
      }, NOTIFICATION_TIMEOUT)

      return notificationState

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }

    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Provider
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, getInitialState())

  // Auto-save production state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(state.production))
    }
  }, [state.production])

  // Auto-cleanup old notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      state.notifications.forEach(notification => {
        const age = now.getTime() - notification.timestamp.getTime()
        if (age > NOTIFICATION_TIMEOUT) {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.notifications, dispatch])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
