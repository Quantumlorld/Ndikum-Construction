'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api, ProductionData, ProductionMetrics } from '@/lib/api'

// Enhanced Types
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  permissions: string[]
}

interface ProductionState {
  isRunning: boolean
  outputRate: number
  efficiency: number
  activeMachines: number
  totalMachines: number
  lastUpdate: string
  status: 'running' | 'stopped' | 'maintenance' | 'error'
}

interface SystemHealth {
  cpu: number
  memory: number
  network: 'normal' | 'slow' | 'offline'
  temperature: number
  diskSpace: number
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  production: ProductionState
  metrics: ProductionMetrics | null
  systemHealth: SystemHealth
  notifications: Notification[]
  isLoading: boolean
  error: string | null
  lastSync: string | null
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  autoRemove?: boolean
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PRODUCTION_STATE'; payload: ProductionState }
  | { type: 'SET_METRICS'; payload: ProductionMetrics }
  | { type: 'SET_SYSTEM_HEALTH'; payload: SystemHealth }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'START_PRODUCTION' }
  | { type: 'STOP_PRODUCTION' }
  | { type: 'PAUSE_PRODUCTION' }
  | { type: 'SYNC_DATA' }
  | { type: 'SET_LAST_SYNC'; payload: string }

// Enhanced Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    
    case 'SET_PRODUCTION_STATE':
      return { ...state, production: action.payload }
    
    case 'SET_METRICS':
      return { ...state, metrics: action.payload }
    
    case 'SET_SYSTEM_HEALTH':
      return { ...state, systemHealth: action.payload }
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        autoRemove: true,
        ...action.payload
      }
      
      // Limit notifications to 5
      const updatedNotifications = [newNotification, ...state.notifications].slice(0, 5)
      
      return { ...state, notifications: updatedNotifications }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      }
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    
    case 'START_PRODUCTION':
      return {
        ...state,
        production: {
          ...state.production,
          isRunning: true,
          status: 'running',
          lastUpdate: new Date().toISOString()
        }
      }
    
    case 'STOP_PRODUCTION':
      return {
        ...state,
        production: {
          ...state.production,
          isRunning: false,
          status: 'stopped',
          activeMachines: 0,
          lastUpdate: new Date().toISOString()
        }
      }
    
    case 'PAUSE_PRODUCTION':
      return {
        ...state,
        production: {
          ...state.production,
          isRunning: false,
          status: 'maintenance',
          lastUpdate: new Date().toISOString()
        }
      }
    
    case 'SYNC_DATA':
      return { ...state, isLoading: true }
    
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload, isLoading: false }
    
    default:
      return state
  }
}

// Initial State
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  production: {
    isRunning: false,
    outputRate: 0,
    efficiency: 0,
    activeMachines: 0,
    totalMachines: 10,
    lastUpdate: new Date().toISOString(),
    status: 'stopped'
  },
  metrics: null,
  systemHealth: {
    cpu: 0,
    memory: 0,
    network: 'normal',
    temperature: 0,
    diskSpace: 0
  },
  notifications: [],
  isLoading: false,
  error: null,
  lastSync: null
}

// Enhanced Context Provider
interface AppStateContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // API Actions
  startProduction: () => Promise<void>
  stopProduction: () => Promise<void>
  pauseProduction: () => Promise<void>
  syncData: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshMetrics: () => Promise<void>
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function EnhancedAppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('ndikum-app-state')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        dispatch({ type: 'SET_USER', payload: parsed.user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: parsed.isAuthenticated })
        dispatch({ type: 'SET_PRODUCTION_STATE', payload: parsed.production })
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        production: state.production
      }
      localStorage.setItem('ndikum-app-state', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }, [state.user, state.isAuthenticated, state.production])

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      state.notifications.forEach(notification => {
        if (notification.autoRemove) {
          const notificationTime = new Date(notification.timestamp).getTime()
          if (now - notificationTime > 5000) {
            dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })
          }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [state.notifications])

  // API Actions
  const startProduction = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.startProduction()
      if (response.success) {
        dispatch({ type: 'START_PRODUCTION' })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Production Started',
            message: response.data?.message || 'Production has been started successfully'
          }
        })
      } else {
        throw new Error(response.error || 'Failed to start production')
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Production Error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const stopProduction = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.stopProduction()
      if (response.success) {
        dispatch({ type: 'STOP_PRODUCTION' })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Production Stopped',
            message: response.data?.message || 'Production has been stopped successfully'
          }
        })
      } else {
        throw new Error(response.error || 'Failed to stop production')
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Production Error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const pauseProduction = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.pauseProduction()
      if (response.success) {
        dispatch({ type: 'PAUSE_PRODUCTION' })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Production Paused',
            message: response.data?.message || 'Production has been paused successfully'
          }
        })
      } else {
        throw new Error(response.error || 'Failed to pause production')
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Production Error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const syncData = async () => {
    dispatch({ type: 'SYNC_DATA' })
    try {
      const [productionResponse, metricsResponse] = await Promise.all([
        api.getProductionData(),
        api.getProductionMetrics()
      ])

      if (productionResponse.success && productionResponse.data && productionResponse.data.length > 0) {
        const latestData = productionResponse.data[0]
        dispatch({ type: 'SET_PRODUCTION_STATE', payload: {
          isRunning: latestData.status === 'running',
          outputRate: latestData.outputRate,
          efficiency: latestData.efficiency,
          activeMachines: latestData.activeMachines,
          totalMachines: latestData.totalMachines,
          lastUpdate: latestData.timestamp,
          status: latestData.status
        }})
      }

      if (metricsResponse.success && metricsResponse.data) {
        dispatch({ type: 'SET_METRICS', payload: metricsResponse.data })
      }

      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() })
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Sync Error',
          message: 'Failed to sync data from server'
        }
      })
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.login({ email, password })
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data.user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Login Successful',
            message: `Welcome back, ${response.data.user.name}!`
          }
        })
        return true
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Login Failed',
          message: error instanceof Error ? error.message : 'Invalid credentials'
        }
      })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    dispatch({ type: 'SET_USER', payload: null })
    dispatch({ type: 'SET_AUTHENTICATED', payload: false })
    dispatch({ type: 'STOP_PRODUCTION' })
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'info',
        title: 'Logged Out',
        message: 'You have been logged out successfully'
      }
    })
  }

  const refreshMetrics = async () => {
    try {
      const response = await api.getProductionMetrics()
      if (response.success && response.data) {
        dispatch({ type: 'SET_METRICS', payload: response.data })
      }
    } catch (error) {
      console.error('Failed to refresh metrics:', error)
    }
  }

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  }

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  }

  const value: AppStateContextType = {
    state,
    dispatch,
    startProduction,
    stopProduction,
    pauseProduction,
    syncData,
    login,
    logout,
    refreshMetrics,
    markNotificationRead,
    clearNotifications
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// Hook to use enhanced app state
export function useEnhancedAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useEnhancedAppState must be used within an EnhancedAppStateProvider')
  }
  return context
}
