export interface Metric {
  id: string
  label: string
  value: number
  unit?: string
  trend?: number
  icon: React.ComponentType<{ className?: string }>
}

export interface ProcessStep {
  id: string
  title: string
  description: string
  icon: string
  video?: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  unit: string
  minQuantity: number
  features: string[]
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}

// State Management Types
export interface User {
  id: string
  name: string
  email: string
  company?: string
}

export interface ProductionState {
  isRunning: boolean
  outputRate: number
  efficiency: number
  activeMachines: number
  totalMachines: number
  productionTime: number
  lastUpdate: Date
}

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
}

export interface AppState {
  user: User | null
  isAuthenticated: boolean
  production: ProductionState
  notifications: Notification[]
}

export type AppAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'START_PRODUCTION' }
  | { type: 'PAUSE_PRODUCTION' }
  | { type: 'UPDATE_PRODUCTION'; payload: Partial<ProductionState> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
