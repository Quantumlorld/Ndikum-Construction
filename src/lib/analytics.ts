'use client'

import React, { useEffect } from 'react'

// Analytics Types
export interface AnalyticsEvent {
  type: 'page_view' | 'button_click' | 'form_submit' | 'production_action' | 'navigation' | 'error' | 'performance'
  name: string
  properties?: Record<string, any>
  timestamp: string
  userId?: string
  sessionId: string
  url: string
}

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: string
  endTime?: string
  duration?: number
  pageViews: number
  interactions: number
  errors: number
  bounceRate: number
  device: DeviceInfo
  browser: BrowserInfo
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  screenResolution: string
  viewportSize: string
}

export interface BrowserInfo {
  name: string
  version: string
  language: string
  cookiesEnabled: boolean
}

export interface AnalyticsReport {
  period: 'daily' | 'weekly' | 'monthly'
  totalSessions: number
  uniqueUsers: number
  pageViews: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topEvents: Array<{ event: string; count: number }>
  deviceBreakdown: Record<string, number>
  errorRate: number
}

// Analytics Manager Class
class AnalyticsManager {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null
  private sessionStartTime: number
  private pageViewCount: number = 0
  private interactionCount: number = 0
  private errorCount: number = 0
  private isTracking: boolean = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return

    // Track page views
    this.trackPageView()

    // Track outbound links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      if (link && link.hostname !== window.location.hostname) {
        this.trackEvent('navigation', 'outbound_link', {
          url: link.href,
          text: link.textContent
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackEvent('form_submit', form.id || 'unknown_form', {
        action: form.action,
        method: form.method
      })
    })

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })
  }

  trackPageView(url?: string) {
    if (!this.isTracking) return

    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : 'unknown')
    
    this.trackEvent('page_view', 'page_view', {
      url: pageUrl,
      title: typeof document !== 'undefined' ? document.title : 'Unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'direct'
    })

    this.pageViewCount++
  }

  trackEvent(type: AnalyticsEvent['type'], name: string, properties?: Record<string, any>) {
    if (!this.isTracking) return

    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }

    this.events.push(event)
    this.interactionCount++

    // Send to analytics service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendEvent(event)
    }

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }
  }

  trackButtonClick(buttonName: string, properties?: Record<string, any>) {
    this.trackEvent('button_click', buttonName, properties)
  }

  trackProductionAction(action: string, properties?: Record<string, any>) {
    this.trackEvent('production_action', action, properties)
  }

  trackError(error: Error | string, context?: string) {
    this.errorCount++
    this.trackEvent('error', 'javascript_error', {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context
    })
  }

  trackPerformance(metricName: string, value: number, unit: string) {
    this.trackEvent('performance', metricName, {
      value,
      unit,
      timestamp: new Date().toISOString()
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
    }
  }

  private endSession() {
    const sessionDuration = Date.now() - this.sessionStartTime
    const bounceRate = this.pageViewCount === 1 ? 100 : 0

    const session: UserSession = {
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      startTime: new Date(this.sessionStartTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: sessionDuration,
      pageViews: this.pageViewCount,
      interactions: this.interactionCount,
      errors: this.errorCount,
      bounceRate,
      device: this.getDeviceInfo(),
      browser: this.getBrowserInfo()
    }

    // Send session data
    if (process.env.NODE_ENV === 'production') {
      this.sendSessionData(session)
    }
  }

  private async sendSessionData(session: UserSession) {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session)
      })
    } catch (error) {
      console.warn('Failed to send session data:', error)
    }
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return { type: 'desktop', os: 'Unknown', screenResolution: 'Unknown', viewportSize: 'Unknown' }
    }

    const width = window.screen.width
    const height = window.screen.height
    const userAgent = navigator.userAgent

    let type: DeviceInfo['type'] = 'desktop'
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      type = /iPad/.test(userAgent) ? 'tablet' : 'mobile'
    }

    let os = 'Unknown'
    if (/Windows/.test(userAgent)) os = 'Windows'
    else if (/Mac/.test(userAgent)) os = 'macOS'
    else if (/Linux/.test(userAgent)) os = 'Linux'
    else if (/Android/.test(userAgent)) os = 'Android'
    else if (/iOS|iPhone|iPad/.test(userAgent)) os = 'iOS'

    return {
      type,
      os,
      screenResolution: `${width}x${height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    }
  }

  private getBrowserInfo(): BrowserInfo {
    if (typeof window === 'undefined') {
      return { name: 'Unknown', version: 'Unknown', language: 'Unknown', cookiesEnabled: false }
    }

    const userAgent = navigator.userAgent
    let name = 'Unknown'
    let version = 'Unknown'

    if (/Chrome/.test(userAgent)) {
      name = 'Chrome'
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
    } else if (/Firefox/.test(userAgent)) {
      name = 'Firefox'
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
    } else if (/Safari/.test(userAgent)) {
      name = 'Safari'
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown'
    } else if (/Edge/.test(userAgent)) {
      name = 'Edge'
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
    }

    return {
      name,
      version,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getSessionInfo(): Partial<UserSession> {
    return {
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      startTime: new Date(this.sessionStartTime).toISOString(),
      pageViews: this.pageViewCount,
      interactions: this.interactionCount,
      errors: this.errorCount,
      device: this.getDeviceInfo(),
      browser: this.getBrowserInfo()
    }
  }

  clearEvents() {
    this.events = []
  }

  disableTracking() {
    this.isTracking = false
  }

  enableTracking() {
    this.isTracking = true
  }

  generateReport(period: 'daily' | 'weekly' | 'monthly'): AnalyticsReport {
    // This would typically be calculated on the server
    // For now, return a mock report
    return {
      period,
      totalSessions: 1,
      uniqueUsers: this.userId ? 1 : 0,
      pageViews: this.pageViewCount,
      averageSessionDuration: Date.now() - this.sessionStartTime,
      bounceRate: this.pageViewCount === 1 ? 100 : 0,
      topPages: [
        { page: 'dashboard', views: this.pageViewCount }
      ],
      topEvents: [
        { event: 'page_view', count: this.pageViewCount },
        { event: 'button_click', count: this.interactionCount }
      ],
      deviceBreakdown: {
        [this.getDeviceInfo().type]: 1
      },
      errorRate: this.interactionCount > 0 ? (this.errorCount / this.interactionCount) * 100 : 0
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager()

// React Hook for Analytics
import { useCallback } from 'react'

export function useAnalytics() {
  const trackEvent = useCallback((type: AnalyticsEvent['type'], name: string, properties?: Record<string, any>) => {
    analytics.trackEvent(type, name, properties)
  }, [])

  const trackButtonClick = useCallback((buttonName: string, properties?: Record<string, any>) => {
    analytics.trackButtonClick(buttonName, properties)
  }, [])

  const trackProductionAction = useCallback((action: string, properties?: Record<string, any>) => {
    analytics.trackProductionAction(action, properties)
  }, [])

  const trackError = useCallback((error: Error | string, context?: string) => {
    analytics.trackError(error, context)
  }, [])

  const trackPerformance = useCallback((metricName: string, value: number, unit: string) => {
    analytics.trackPerformance(metricName, value, unit)
  }, [])

  return {
    trackEvent,
    trackButtonClick,
    trackProductionAction,
    trackError,
    trackPerformance,
    setUserId: analytics.setUserId.bind(analytics),
    getSessionInfo: analytics.getSessionInfo.bind(analytics),
    generateReport: analytics.generateReport.bind(analytics)
  }
}

// Higher-Order Component for tracking component interactions
export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return function TrackedComponent(props: P) {
    const analyticsHook = useAnalytics()

    useEffect(() => {
      analyticsHook.trackEvent('page_view', `component_${componentName}`, {
        props: Object.keys(props)
      })
    }, [])

    return React.createElement(WrappedComponent, props)
  }
}
