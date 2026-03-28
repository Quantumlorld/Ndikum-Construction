'use client'

// WebSocket Types
export interface WebSocketMessage {
  type: 'production_update' | 'system_alert' | 'metrics_update' | 'notification'
  data: any
  timestamp: string
}

export interface ProductionUpdate {
  outputRate: number
  efficiency: number
  activeMachines: number
  status: 'running' | 'stopped' | 'maintenance'
}

export interface SystemAlert {
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  component?: string
  action?: string
}

// WebSocket Manager Class
class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private messageHandlers: Map<string, ((data: any) => void)> = new Map()
  private connectionCallbacks: ((connected: boolean) => void)[] = []

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve()
        return
      }

      this.isConnecting = true

      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.notifyConnectionCallbacks(true)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.isConnecting = false
          this.notifyConnectionCallbacks(false)
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private handleMessage(message: WebSocketMessage) {
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message.data)
    }
  }

  private notifyConnectionCallbacks(connected: boolean) {
    this.connectionCallbacks.forEach(callback => callback(connected))
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    console.log(`Attempting to reconnect in ${delay}ms...`)

    setTimeout(() => {
      this.reconnectAttempts++
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  subscribe(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler)
  }

  unsubscribe(messageType: string) {
    this.messageHandlers.delete(messageType)
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback)
    return () => {
      const index = this.connectionCallbacks.indexOf(callback)
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1)
      }
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, message not sent:', message)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
    this.connectionCallbacks = []
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Mock WebSocket for development
class MockWebSocketManager {
  private messageHandlers: Map<string, ((data: any) => void)> = new Map()
  private connectionCallbacks: ((connected: boolean) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null

  async connect(): Promise<void> {
    console.log('Mock WebSocket connected')
    this.notifyConnectionCallbacks(true)
    
    // Simulate real-time updates
    this.intervalId = setInterval(() => {
      this.simulateProductionUpdate()
    }, 5000)
  }

  private simulateProductionUpdate() {
    const updates = [
      { type: 'production_update', data: { outputRate: 2847 + Math.floor(Math.random() * 100), efficiency: 94 + Math.floor(Math.random() * 3) } },
      { type: 'metrics_update', data: { dailyOutput: 2847 + Math.floor(Math.random() * 50) } },
      { type: 'system_alert', data: { level: 'info', message: 'System operating normally' } }
    ]
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
    const handler = this.messageHandlers.get(randomUpdate.type)
    if (handler) {
      handler(randomUpdate.data)
    }
  }

  subscribe(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler)
  }

  unsubscribe(messageType: string) {
    this.messageHandlers.delete(messageType)
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback)
    return () => {
      const index = this.connectionCallbacks.indexOf(callback)
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1)
      }
    }
  }

  private notifyConnectionCallbacks(connected: boolean) {
    this.connectionCallbacks.forEach(callback => callback(connected))
  }

  send(message: WebSocketMessage) {
    console.log('Mock WebSocket send:', message)
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.messageHandlers.clear()
    this.connectionCallbacks = []
    console.log('Mock WebSocket disconnected')
  }

  isConnected(): boolean {
    return true
  }
}

// Create singleton instance
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
const useMock = process.env.NEXT_PUBLIC_MOCK_API === 'true'

export const wsManager = useMock ? new MockWebSocketManager() : new WebSocketManager(wsUrl)

// React Hook for WebSocket
import { useEffect, useState, useCallback } from 'react'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    const unsubscribe = wsManager.onConnectionChange(setIsConnected)
    
    const handleMessage = (data: any) => {
      setLastMessage({
        type: 'production_update', // Default type
        data,
        timestamp: new Date().toISOString()
      })
    }

    wsManager.subscribe('production_update', handleMessage)
    wsManager.subscribe('system_alert', handleMessage)
    wsManager.subscribe('metrics_update', handleMessage)

    return () => {
      unsubscribe()
      wsManager.unsubscribe('production_update')
      wsManager.unsubscribe('system_alert')
      wsManager.unsubscribe('metrics_update')
    }
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    wsManager.send(message)
  }, [])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe: wsManager.subscribe.bind(wsManager),
    unsubscribe: wsManager.unsubscribe.bind(wsManager)
  }
}
