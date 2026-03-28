'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface DataPoint {
  time: string
  value: number
  label?: string
}

interface ProductionChartProps {
  data: DataPoint[]
  title: string
  unit: string
  color?: string
  height?: number
  showTrend?: boolean
  className?: string
}

export function ProductionChart({ 
  data, 
  title, 
  unit, 
  color = '#3B82F6', 
  height = 200,
  showTrend = true,
  className = ''
}: ProductionChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const trend = data.length > 1 
    ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
    : 0

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((maxValue - point.value) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {showTrend && (
          <motion.div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </motion.div>
        )}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height }}>
        {/* SVG Chart */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 25}
              x2="100"
              y2={i * 25}
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Data Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Data Points */}
          {data.map((point, index) => (
            <motion.circle
              key={index}
              cx={(index / (data.length - 1)) * 100}
              cy={((maxValue - point.value) / range) * 100}
              r="2"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
            />
          ))}
        </svg>

        {/* Current Value */}
        <div className="absolute top-2 right-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {data[data.length - 1].value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{unit}</div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{data[0].time}</span>
        <span>{data[data.length - 1].time}</span>
      </div>
    </motion.div>
  )
}

interface MiniChartProps {
  data: DataPoint[]
  color?: string
  size?: number
  className?: string
}

export function MiniChart({ 
  data, 
  color = '#3B82F6', 
  size = 60,
  className = ''
}: MiniChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((maxValue - point.value) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={`${className}`} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  unit: string
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: React.ReactNode
  chart?: DataPoint[]
  color?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeType,
  icon,
  chart,
  color = '#3B82F6',
  className = ''
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {icon}
          {change !== undefined && (
            <motion.div
              className={`flex items-center gap-1 text-xs font-semibold ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {changeType === 'increase' ? '↑' : '↓'} {Math.abs(change)}%
            </motion.div>
          )}
        </div>
      </div>
      
      {chart && (
        <MiniChart data={chart} color={color} />
      )}
    </motion.div>
  )
}
