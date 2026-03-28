'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  height?: string
  width?: string
  variant?: 'text' | 'rectangular' | 'circular'
  lines?: number
}

export function LoadingSkeleton({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full',
  variant = 'rectangular',
  lines = 1
}: LoadingSkeletonProps) {
  const baseClasses = "bg-gray-200 rounded animate-pulse"
  
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${width}`}
            style={{ 
              width: i === lines - 1 ? '60%' : width,
              opacity: 1 - (i * 0.1)
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${height} ${width} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton width="w-32" height="h-6" />
        <LoadingSkeleton variant="circular" width="w-8" height="h-8" />
      </div>
      <LoadingSkeleton height="h-4" />
      <LoadingSkeleton height="h-4" width="w-3/4" />
      <LoadingSkeleton height="h-20" />
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton width="w-24" height="h-4" />
        <LoadingSkeleton variant="circular" width="w-6" height="h-6" />
      </div>
      <LoadingSkeleton height="h-8" width="w-20" />
      <LoadingSkeleton height="h-3" width="w-16" />
    </div>
  )
}
