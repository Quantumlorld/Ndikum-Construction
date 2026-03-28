'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'

interface ProgressIndicatorProps {
  steps: Array<{
    id: string
    label: string
    status: 'completed' | 'active' | 'pending'
    description?: string
  }>
  className?: string
}

export function ProgressIndicator({ steps, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4"
        >
          {/* Step Icon */}
          <div className="relative">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : step.status === 'active'
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : step.status === 'active' ? (
                <motion.div
                  className="w-3 h-3 bg-blue-600 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </motion.div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-10 left-5 w-0.5 h-8 -translate-x-1/2 bg-gray-300" />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pb-8">
            <h3 className={`font-semibold ${
              step.status === 'completed' 
                ? 'text-green-900' 
                : step.status === 'active'
                ? 'text-blue-900'
                : 'text-gray-500'
            }`}>
              {step.label}
            </h3>
            {step.description && (
              <p className={`text-sm mt-1 ${
                step.status === 'active' ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {step.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
}

export function CircularProgress({ 
  value, 
  max = 100, 
  size = 120, 
  strokeWidth = 8,
  className = '',
  children
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-blue-600"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'yellow' | 'red'
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true,
  color = 'blue',
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
