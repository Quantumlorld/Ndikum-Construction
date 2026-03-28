'use client'

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
  stack?: string
  context?: string
}

export interface ErrorReport {
  error: AppError
  userAgent: string
  url: string
  userId?: string
  sessionId: string
}

// Error Categories
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
  UNKNOWN = 'unknown'
}

// Error Handler Class
class ErrorHandler {
  private errors: AppError[] = []
  private maxErrors = 100
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError({
          code: 'UNHANDLED_PROMISE_REJECTION',
          message: event.reason?.message || 'Unhandled promise rejection',
          details: event.reason,
          stack: event.reason?.stack,
          context: 'unhandledrejection'
        })
      })

      // Handle uncaught errors
      window.addEventListener('error', (event) => {
        this.handleError({
          code: 'UNCAUGHT_ERROR',
          message: event.message,
          details: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          },
          stack: event.error?.stack,
          context: 'window.onerror'
        })
      })
    }
  }

  handleError(error: Partial<AppError>, category: ErrorCategory = ErrorCategory.UNKNOWN): void {
    const appError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.details,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      context: error.context
    }

    // Add to error log
    this.errors.push(appError)
    
    // Limit error history
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console
    console.error(`[${category.toUpperCase()}]`, appError)

    // Send to monitoring service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(appError)
    }

    // Show user notification for critical errors
    if (this.isCriticalError(category)) {
      this.showUserNotification(appError)
    }
  }

  private isCriticalError(category: ErrorCategory): boolean {
    return [
      ErrorCategory.NETWORK,
      ErrorCategory.AUTHENTICATION,
      ErrorCategory.SYSTEM
    ].includes(category)
  }

  private showUserNotification(error: AppError) {
    // Dispatch custom event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-error', {
        detail: {
          type: 'error',
          title: 'System Error',
          message: this.getUserFriendlyMessage(error),
          code: error.code
        }
      }))
    }
  }

  private getUserFriendlyMessage(error: AppError): string {
    const friendlyMessages: Record<string, string> = {
      'NETWORK_ERROR': 'Connection to server failed. Please check your internet connection.',
      'AUTHENTICATION_FAILED': 'Login failed. Please check your credentials.',
      'PERMISSION_DENIED': 'You don\'t have permission to perform this action.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'SERVER_ERROR': 'Server is temporarily unavailable. Please try again later.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.'
    }

    return friendlyMessages[error.code] || error.message
  }

  private async reportError(error: AppError): Promise<void> {
    try {
      const report: ErrorReport = {
        error,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        userId: this.userId || undefined,
        sessionId: this.sessionId
      }

      // Send to error reporting service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  getErrors(): AppError[] {
    return [...this.errors]
  }

  clearErrors(): void {
    this.errors = []
  }

  getErrorStats(): { total: number; byCategory: Record<string, number> } {
    const byCategory: Record<string, number> = {}
    
    this.errors.forEach(error => {
      const category = this.categorizeError(error)
      byCategory[category] = (byCategory[category] || 0) + 1
    })

    return {
      total: this.errors.length,
      byCategory
    }
  }

  private categorizeError(error: AppError): string {
    const code = error.code.toUpperCase()
    
    if (code.includes('NETWORK') || code.includes('FETCH')) return ErrorCategory.NETWORK
    if (code.includes('AUTH') || code.includes('LOGIN')) return ErrorCategory.AUTHENTICATION
    if (code.includes('PERMISSION') || code.includes('FORBIDDEN')) return ErrorCategory.AUTHORIZATION
    if (code.includes('VALIDATION') || code.includes('INVALID')) return ErrorCategory.VALIDATION
    if (code.includes('SYSTEM') || code.includes('INTERNAL')) return ErrorCategory.SYSTEM
    
    return ErrorCategory.UNKNOWN
  }

  // Specific error handlers
  handleNetworkError(error: Error, context?: string): void {
    this.handleError({
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      details: {
        originalError: error.message,
        context
      },
      stack: error.stack,
      context: context || 'network'
    }, ErrorCategory.NETWORK)
  }

  handleValidationError(message: string, details?: any): void {
    this.handleError({
      code: 'VALIDATION_ERROR',
      message,
      details,
      context: 'validation'
    }, ErrorCategory.VALIDATION)
  }

  handleAuthError(message: string, details?: any): void {
    this.handleError({
      code: 'AUTHENTICATION_FAILED',
      message,
      details,
      context: 'authentication'
    }, ErrorCategory.AUTHENTICATION)
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// React Hook for Error Handling
import { useEffect, useState } from 'react'

export function useErrorHandler() {
  const [errorStats, setErrorStats] = useState(errorHandler.getErrorStats())

  useEffect(() => {
    const updateStats = () => {
      setErrorStats(errorHandler.getErrorStats())
    }

    // Listen for custom error events
    const handleAppError = () => {
      updateStats()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('app-error', handleAppError)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('app-error', handleAppError)
      }
    }
  }, [])

  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    handleNetworkError: errorHandler.handleNetworkError.bind(errorHandler),
    handleValidationError: errorHandler.handleValidationError.bind(errorHandler),
    handleAuthError: errorHandler.handleAuthError.bind(errorHandler),
    getErrors: errorHandler.getErrors.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler),
    errorStats,
    setUserId: errorHandler.setUserId.bind(errorHandler)
  }
}

// Utility Functions
export function createError(code: string, message: string, details?: any): AppError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  }
}

export function isNetworkError(error: any): boolean {
  return error instanceof TypeError && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  )
}

export function isAuthError(error: any): boolean {
  return error?.code === 401 || error?.message?.includes('unauthorized')
}
