'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MetricCard } from '@/components/ui/MetricCard'
import { 
  Factory, 
  TrendingUp, 
  Zap, 
  Target 
} from 'lucide-react'

const metrics = [
  {
    id: 'production-rate',
    label: 'Production Rate',
    value: 5000,
    unit: ' blocks/day',
    icon: Factory,
    trend: 15
  },
  {
    id: 'monthly-revenue',
    label: 'Monthly Revenue',
    value: 35,
    unit: 'M XAF',
    icon: TrendingUp,
    trend: 22
  },
  {
    id: 'efficiency',
    label: 'System Efficiency',
    value: 96,
    unit: '%',
    icon: Zap,
    trend: 4
  },
  {
    id: 'accuracy',
    label: 'Production Accuracy',
    value: 99.8,
    unit: '%',
    icon: Target,
    trend: 1
  }
]

export function MetricsSystem() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section id="metrics" className="section-padding">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            <span className="glow-text">Live Metrics</span>
            <br />
            <span className="accent-glow">Real-Time Intelligence</span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
            Track production efficiency, quality metrics, and operational performance
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <MetricCard 
              key={metric.id}
              {...metric}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
