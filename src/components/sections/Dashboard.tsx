'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Factory, 
  TrendingUp, 
  Activity 
} from 'lucide-react'

export function Dashboard() {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(78)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="dashboard" className="section-padding">
      <div className="container-premium grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            <span className="text-blue-600">Real-Time Control</span>
            <br />
            <span className="text-gray-700">of Production & Profit</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Monitor every aspect of your construction operation from a single dashboard. 
            Track production metrics, revenue streams, and system performance in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button>
              View Dashboard
            </Button>
            <Button variant="secondary">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Production Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">2,847</p>
                <p className="text-gray-600">blocks today</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">94.2%</p>
                <p className="text-gray-600">operational</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
