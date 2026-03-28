'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  whileHover?: any
  whileTap?: any
}

export function LoadingButton({
  children,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  whileHover,
  whileTap
}: LoadingButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={whileHover}
      whileTap={whileTap}
      className={`relative flex items-center justify-center gap-2 transition-all duration-200 ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </motion.button>
  )
}
