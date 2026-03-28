'use client'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProductionData {
  id: string
  timestamp: string
  outputRate: number
  efficiency: number
  activeMachines: number
  totalMachines: number
  status: 'running' | 'stopped' | 'maintenance'
}

export interface ProductionMetrics {
  dailyOutput: number
  monthlyRevenue: number
  systemEfficiency: number
  productionAccuracy: number
  uptime: number
}

// API Client Class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Production API Methods
  async getProductionData(): Promise<ApiResponse<ProductionData[]>> {
    return this.request<ProductionData[]>('/production')
  }

  async getProductionMetrics(): Promise<ApiResponse<ProductionMetrics>> {
    return this.request<ProductionMetrics>('/production/metrics')
  }

  async startProduction(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/production/start', {
      method: 'POST',
    })
  }

  async stopProduction(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/production/stop', {
      method: 'POST',
    })
  }

  async pauseProduction(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/production/pause', {
      method: 'POST',
    })
  }

  // User Authentication Methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/profile')
  }

  // Reports API Methods
  async getProductionReport(params: {
    startDate: string
    endDate: string
    format?: 'json' | 'csv' | 'pdf'
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params as any).toString()
    return this.request<any>(`/reports/production?${queryParams}`)
  }

  async getEfficiencyReport(params: {
    period: 'daily' | 'weekly' | 'monthly'
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params as any).toString()
    return this.request<any>(`/reports/efficiency?${queryParams}`)
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Mock API for development (when backend is not available)
export const mockApiClient = {
  async getProductionData(): Promise<ApiResponse<ProductionData[]>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          outputRate: 2847,
          efficiency: 94,
          activeMachines: 8,
          totalMachines: 10,
          status: 'running'
        }
      ]
    }
  },

  async getProductionMetrics(): Promise<ApiResponse<ProductionMetrics>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        dailyOutput: 2847,
        monthlyRevenue: 35000000,
        systemEfficiency: 94,
        productionAccuracy: 99.8,
        uptime: 98.5
      }
    }
  },

  async startProduction(): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { message: 'Production started successfully' }
    }
  },

  async stopProduction(): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      success: true,
      data: { message: 'Production stopped successfully' }
    }
  },

  async pauseProduction(): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return {
      success: true,
      data: { message: 'Production paused successfully' }
    }
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock authentication logic
    if (credentials.email === 'admin@ndikum.com' && credentials.password === 'admin123') {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'System Administrator',
            email: 'admin@ndikum.com',
            role: 'admin',
            permissions: ['read', 'write', 'admin']
          },
          token: 'mock-jwt-token'
        }
      }
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: { message: 'Logged out successfully' }
    }
  },

  async getUserProfile(): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        id: '1',
        name: 'System Administrator',
        email: 'admin@ndikum.com',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
      }
    }
  }
}

// Export API client (use mock in development, real in production)
export const api = process.env.NEXT_PUBLIC_MOCK_API === 'true' ? mockApiClient : apiClient
