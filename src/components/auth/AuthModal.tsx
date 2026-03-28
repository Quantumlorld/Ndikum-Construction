'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-react'
import { LoadingButton } from '@/components/ui/LoadingSpinner'
import { User as UserType } from '@/types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
  onLogin?: (userData: UserType) => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange, onLogin }: AuthModalProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
    company: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Simulate successful authentication
      if (onLogin) {
        const userData: UserType = {
          id: Date.now().toString(),
          name: formData.name || 'System User',
          email: formData.email,
          company: formData.company
        }
        onLogin(userData)
      }
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        name: '',
        company: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-black">
                {mode === 'login' ? 'Access Production System' : 'Create System Account'}
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                Secure access to Ndikum intelligent production platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-white/20 rounded-lg p-1">
            <motion.button
              onClick={() => onModeChange('login')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                mode === 'login' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white/80 hover:text-white'
              }`}
              layoutId="authModeToggle"
              disabled={isLoading}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => onModeChange('register')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                mode === 'register' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white/80 hover:text-white'
              }`}
              disabled={isLoading}
            >
              Register
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-black text-gray-900 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="John Doe"
                    required={mode === 'register'}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ndikum Construction Ltd."
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="john@ndikum.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="•••••••"
                required
                disabled={isLoading}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" disabled={isLoading} />
              <span className="text-sm text-gray-600">Remember system access</span>
            </label>
            {mode === 'login' && (
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Reset credentials
              </a>
            )}
          </div>

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
          >
            {mode === 'login' ? 'Access System →' : 'Create Account →'}
          </LoadingButton>

          {mode === 'login' && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need system credentials?{' '}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onModeChange('register')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                  disabled={isLoading}
                >
                  Initialize Account
                </motion.button>
              </p>
            </div>
          )}

          {mode === 'register' && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Have system access?{' '}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onModeChange('login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                  disabled={isLoading}
                >
                  Continue Setup
                </motion.button>
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  )
}
