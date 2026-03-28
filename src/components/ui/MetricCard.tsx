'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Metric } from '@/types'

interface MetricCardProps extends Metric {
  className?: string
  delay?: number
}

export function MetricCard({ 
  label, 
  value, 
  unit = '', 
  trend, 
  icon: Icon, 
  className = '', 
  delay = 0 
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000
      const start = Date.now()
      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - start) / duration, 1)
        setDisplayValue(Math.floor(progress * value))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <motion.div
      className={cn('metric-card', className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        {displayValue.toLocaleString()}{unit}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  )
}
