'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/MetricCard'
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Package 
} from 'lucide-react'

const metrics = [
  {
    id: 'production-rate',
    label: 'Daily Production',
    value: 5000,
    unit: ' blocks',
    icon: Package,
    trend: 8
  },
  {
    id: 'quality-score',
    label: 'Quality Rate',
    value: 99.2,
    unit: '%',
    icon: Activity,
    trend: 5
  },
  {
    id: 'efficiency',
    label: 'Operational Uptime',
    value: 99.8,
    unit: '%',
    icon: Activity,
    trend: 2
  },
  {
    id: 'client-satisfaction',
    label: 'Client Satisfaction',
    value: 98,
    unit: '%',
    icon: Package,
    trend: 7
  }
]

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-black text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
      
      {/* Subtle grid pattern for industrial feel */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
              Welcome to Ndikum Construction
            </p>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-5xl lg:text-8xl font-black mb-6 leading-tight">
              <motion.span 
                className="inline-block"
                style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)'
                }}
                animate={{ 
                  textShadow: [
                    '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)',
                    '0 0 80px rgba(37, 99, 235, 0.6), 0 0 160px rgba(37, 99, 235, 0.3)',
                    '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Precision Block Production.
              </motion.span>
              <br />
              <motion.span 
                className="inline-block"
                style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)'
                }}
                animate={{ 
                  textShadow: [
                    '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)',
                    '0 0 80px rgba(37, 99, 235, 0.6), 0 0 160px rgba(37, 99, 235, 0.3)',
                    '0 0 60px rgba(37, 99, 235, 0.4), 0 0 120px rgba(37, 99, 235, 0.2)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                Powered by Intelligence.
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-16"
          >
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              High-efficiency manufacturing driven by real-time system optimization.
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('production')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-lg transition-all duration-300 shadow-xl"
            >
              View Production →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-400 font-black py-4 px-8 rounded-lg transition-all duration-300"
            >
              Calculate Cost
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Animated Production Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              whileHover={{ scale: 1.05, borderColor: '#2563EB' }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-8 text-center hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <metric.icon className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{metric.label}</h3>
              <motion.div
                key={metric.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 + index * 0.2 }}
              >
                <p className="text-3xl font-black text-white mb-2">
                  {metric.value.toLocaleString()}{metric.unit}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  {metric.trend > 0 ? (
                    <span className="text-green-400 font-bold">↑ {metric.trend}%</span>
                  ) : (
                    <span className="text-red-400 font-bold">↓ {Math.abs(metric.trend)}%</span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
