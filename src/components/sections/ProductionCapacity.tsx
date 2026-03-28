'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function ProductionCapacity() {
  return (
    <section id="production" className="section-padding bg-gray-50">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <div className="text-6xl lg:text-8xl font-black text-blue-600 mb-4">
              5,000
            </div>
            <p className="text-xl text-gray-700 font-bold">
              Daily Production Capacity
            </p>
            <p className="text-gray-600 mt-2">
              High-efficiency manufacturing with intelligent system optimization
            </p>
          </div>
        </motion.div>

        {/* System Panel with Machine Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Live Production Numbers */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-black text-gray-900">Live Production</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Rate:</span>
                <span className="text-2xl font-black text-blue-600">2,847/hr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today Total:</span>
                <span className="text-xl font-bold text-green-600">18,923</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Efficiency:</span>
                <span className="text-xl font-bold text-blue-600">94.2%</span>
              </div>
            </div>
          </motion.div>

          {/* Machine Status with Image */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          >
            <div className="relative h-48 bg-gray-100">
              <img
                src="/images/factory-machine.jpg"
                alt="Production Machine - High-Tech Manufacturing Equipment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  OPERATIONAL
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Machine Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-bold text-green-600">Normal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Output Rate:</span>
                  <span className="font-bold text-blue-600">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maintenance:</span>
                  <span className="font-bold text-gray-700">72h</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Output Rate */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-black text-gray-900">Output Rate</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Standard:</span>
                <span className="text-2xl font-black text-blue-600">2,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Premium:</span>
                <span className="text-xl font-bold text-blue-600">1,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Heavy Duty:</span>
                <span className="text-xl font-bold text-blue-600">1,500</span>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Target:</span>
                  <span className="text-2xl font-black text-green-600">5,000</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Production Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-500 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Standard Blocks</h3>
            <p className="text-3xl font-black text-blue-600">2,000</p>
            <p className="text-gray-600">per day</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-500 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Blocks</h3>
            <p className="text-3xl font-black text-blue-600">1,500</p>
            <p className="text-gray-600">per day</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-500 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Heavy Duty</h3>
            <p className="text-3xl font-black text-blue-600">1,500</p>
            <p className="text-gray-600">per day</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-xl"
          >
            View Production Line
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 font-bold py-4 px-8 rounded-lg transition-all duration-300"
          >
            Request Capacity
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
