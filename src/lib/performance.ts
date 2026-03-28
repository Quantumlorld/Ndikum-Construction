'use client'

// Performance Metrics Types
export interface PerformanceMetrics {
  pageLoad: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  memoryUsage: number
  bundleSize: number
  apiResponseTime: number
  renderTime: number
}

export interface MetricEntry {
  name: string
  value: number
  timestamp: string
  unit: string
  threshold?: number
}

export interface PerformanceReport {
  url: string
  userAgent: string
  timestamp: string
  metrics: MetricEntry[]
  score: number
  recommendations: string[]
}

// Performance Monitor Class
class PerformanceMonitor {
  private metrics: MetricEntry[] = []
  private observers: PerformanceObserver[] = []
  private startTime: number = Date.now()
  private renderStartTime: number = 0

  constructor() {
    this.initializeObservers()
    this.trackPageLoad()
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !window.performance) return

    // Observer for Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.addMetric({
          name: 'Largest Contentful Paint',
          value: lastEntry.startTime,
          unit: 'ms',
          threshold: 2500
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)
    } catch (error) {
      console.warn('LCP observer not supported:', error)
    }

    // Observer for First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-input') {
            this.addMetric({
              name: 'First Input Delay',
              value: (entry as any).processingStart - entry.startTime,
              unit: 'ms',
              threshold: 100
            })
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)
    } catch (error) {
      console.warn('FID observer not supported:', error)
    }

    // Observer for Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })
        this.addMetric({
          name: 'Cumulative Layout Shift',
          value: clsValue,
          unit: 'score',
          threshold: 0.1
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    } catch (error) {
      console.warn('CLS observer not supported:', error)
    }
  }

  private trackPageLoad() {
    if (typeof window === 'undefined' || !window.performance) return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.addMetric({
        name: 'Page Load Time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        unit: 'ms',
        threshold: 3000
      })

      this.addMetric({
        name: 'First Contentful Paint',
        value: navigation.responseStart - navigation.fetchStart,
        unit: 'ms',
        threshold: 1800
      })
    })
  }

  addMetric(metric: Omit<MetricEntry, 'timestamp'>) {
    this.metrics.push({
      ...metric,
      timestamp: new Date().toISOString()
    })

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  startRenderTimer() {
    this.renderStartTime = performance.now()
  }

  endRenderTimer(componentName: string) {
    if (this.renderStartTime > 0) {
      const renderTime = performance.now() - this.renderStartTime
      this.addMetric({
        name: `Render Time - ${componentName}`,
        value: renderTime,
        unit: 'ms',
        threshold: 16 // 60fps = 16ms per frame
      })
      this.renderStartTime = 0
    }
  }

  trackApiResponse(endpoint: string, duration: number) {
    this.addMetric({
      name: `API Response - ${endpoint}`,
      value: duration,
      unit: 'ms',
      threshold: 1000
    })
  }

  trackMemoryUsage() {
    if (typeof window !== 'undefined' && (window as any).performance?.memory) {
      const memory = (window as any).performance.memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      
      this.addMetric({
        name: 'Memory Usage',
        value: usedMB,
        unit: 'MB',
        threshold: 100
      })
    }
  }

  getMetrics(): MetricEntry[] {
    return [...this.metrics]
  }

  getPerformanceScore(): number {
    const metrics = this.metrics
    let score = 100

    // Deduct points for metrics exceeding thresholds
    metrics.forEach(metric => {
      if (metric.threshold && metric.value > metric.threshold) {
        const excess = (metric.value - metric.threshold) / metric.threshold
        score -= Math.min(excess * 20, 50) // Max 50 points deduction per metric
      }
    })

    return Math.max(0, Math.round(score))
  }

  generateReport(): PerformanceReport {
    const score = this.getPerformanceScore()
    const recommendations = this.generateRecommendations()

    return {
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      score,
      recommendations
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    const metrics = this.metrics

    // Analyze metrics and generate recommendations
    metrics.forEach(metric => {
      if (metric.threshold && metric.value > metric.threshold) {
        switch (metric.name) {
          case 'Page Load Time':
            recommendations.push('Optimize images and reduce bundle size to improve page load time')
            break
          case 'Largest Contentful Paint':
            recommendations.push('Optimize critical resources and server response time')
            break
          case 'First Input Delay':
            recommendations.push('Reduce JavaScript execution time and main thread work')
            break
          case 'Cumulative Layout Shift':
            recommendations.push('Include size attributes for images and avoid inserting content above existing content')
            break
          case 'Memory Usage':
            recommendations.push('Check for memory leaks and optimize data structures')
            break
          default:
            if (metric.name.includes('API Response')) {
              recommendations.push('Optimize API endpoints and implement caching')
            }
        }
      }
    })

    return Array.from(new Set(recommendations)) // Remove duplicates
  }

  clearMetrics() {
    this.metrics = []
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React Hook for Performance Monitoring
import { useEffect, useState, useRef } from 'react'

export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<MetricEntry[]>([])
  const [score, setScore] = useState(100)
  const renderStartTime = useRef<number>(0)

  useEffect(() => {
    // Track render time
    renderStartTime.current = performance.now()

    return () => {
      const renderTime = performance.now() - renderStartTime.current
      performanceMonitor.addMetric({
        name: `Render Time - ${componentName}`,
        value: renderTime,
        unit: 'ms',
        threshold: 16
      })
    }
  }, [])

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics())
      setScore(performanceMonitor.getPerformanceScore())
    }

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000)
    
    // Initial update
    updateMetrics()

    return () => clearInterval(interval)
  }, [])

  const trackApiCall = (endpoint: string, startTime: number) => {
    const duration = performance.now() - startTime
    performanceMonitor.trackApiResponse(endpoint, duration)
  }

  return {
    metrics,
    score,
    trackApiCall,
    startTimer: () => performance.now(),
    trackMemory: () => performanceMonitor.trackMemoryUsage()
  }
}

// Utility Functions
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  threshold?: number
): T {
  const startTime = performance.now()
  const result = fn()
  const duration = performance.now() - startTime

  performanceMonitor.addMetric({
    name,
    value: duration,
    unit: 'ms',
    threshold
  })

  return result
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  threshold?: number
): Promise<T> {
  const startTime = performance.now()
  const result = await fn()
  const duration = performance.now() - startTime

  performanceMonitor.addMetric({
    name,
    value: duration,
    unit: 'ms',
    threshold
  })

  return result
}
