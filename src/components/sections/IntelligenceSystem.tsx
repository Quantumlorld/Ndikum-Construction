'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Brain, Cpu, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Intelligent Tracking',
    description: 'Every production unit is tracked in real-time with AI-powered monitoring systems that ensure accuracy and reduce waste.'
  },
  {
    icon: Cpu,
    title: 'Smart Optimization',
    description: 'Our system automatically optimizes production parameters based on demand patterns, material availability, and efficiency metrics.'
  },
  {
    icon: Zap,
    title: 'Waste Reduction',
    description: 'Advanced algorithms predict and minimize material waste, saving costs and improving environmental impact.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Automated quality checks at every stage ensure consistent output and meet industry standards.'
  }
]

export function IntelligenceSystem() {
  return (
    <section id="intelligence-system" className="section-padding bg-black text-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            <span className="text-blue-400">Intelligent Production</span>
            <br />
            <span className="text-white">System</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            The brain behind our manufacturing excellence - combining AI precision with industrial strength
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                borderColor: '#2563EB',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
              }}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-8 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <p className="text-5xl font-black text-blue-400 mb-2">99.9%</p>
                <p className="text-gray-300 font-semibold">System Uptime</p>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <p className="text-5xl font-black text-green-400 mb-2">-87%</p>
                <p className="text-gray-300 font-semibold">Waste Reduction</p>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <p className="text-5xl font-black text-white mb-2">24/7</p>
                <p className="text-gray-300 font-semibold">AI Monitoring</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-xl"
          >
            Learn About Our Technology
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
