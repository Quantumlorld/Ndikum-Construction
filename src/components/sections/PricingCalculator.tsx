'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Calculator, Clock } from 'lucide-react'
import { useAppState } from '@/store/ProductionState'

const blockTypes = [
  { id: 'standard', name: 'Standard Block', price: 350, time: 24, outputMultiplier: 1.0 },
  { id: 'premium', name: 'Premium Block', price: 420, time: 48, outputMultiplier: 0.8 },
  { id: 'heavy-duty', name: 'Heavy-Duty Block', price: 550, time: 72, outputMultiplier: 0.6 }
]

const costBreakdown = {
  material: 0.65,  // 65% of total cost
  labor: 0.20,      // 20% of total cost  
  transport: 0.10,   // 10% of total cost
  overhead: 0.05     // 5% of total cost
}

export function PricingCalculator() {
  const [quantity, setQuantity] = React.useState(1000)
  const [blockType, setBlockType] = React.useState('standard')
  const [isCalculating, setIsCalculating] = React.useState(false)
  
  const { state, dispatch } = useAppState()

  const currentType = blockTypes.find(type => type.id === blockType) || blockTypes[0]
  const totalPrice = quantity * currentType.price
  const productionTime = Math.ceil(quantity / 5000) * currentType.time
  
  // Calculate production impact
  const machineLoad = Math.min((quantity / 10000) * 100, 100)
  const estimatedOutputRate = state.production.isRunning 
    ? Math.floor(state.production.outputRate * currentType.outputMultiplier)
    : 0
  const actualProductionTime = estimatedOutputRate > 0 
    ? Math.ceil(quantity / estimatedOutputRate)
    : productionTime

  // Calculate cost breakdown
  const materialCost = totalPrice * costBreakdown.material
  const laborCost = totalPrice * costBreakdown.labor
  const transportCost = totalPrice * costBreakdown.transport
  const overheadCost = totalPrice * costBreakdown.overhead

  React.useEffect(() => {
    setIsCalculating(true)
    const timer = setTimeout(() => setIsCalculating(false), 300)
    return () => clearTimeout(timer)
  }, [quantity, blockType])

  React.useEffect(() => {
    // Update production state based on pricing changes
    if (state.isAuthenticated) {
      dispatch({
        type: 'UPDATE_PRODUCTION',
        payload: {
          outputRate: estimatedOutputRate,
          efficiency: Math.max(85, 95 - (machineLoad * 0.1))
        }
      })

      // Show notification for significant changes
      if (quantity > 5000) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'info',
            message: `Large order detected: ${quantity.toLocaleString()} blocks will impact production schedule`
          }
        })
      }
    }
  }, [quantity, blockType, state.isAuthenticated])

  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            <span className="text-blue-600">Smart Pricing</span>
            <br />
            <span className="text-gray-900">Calculator</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Transparent cost breakdown with real-time system integration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Configure Order</h3>
              
              {/* Quantity Slider */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">Quantity</label>
                <motion.input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  whileFocus={{ scale: 1.02 }}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-gray-600">100</span>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-black text-blue-600"
                  >
                    {quantity.toLocaleString()}
                  </motion.span>
                  <span className="text-gray-600">10,000</span>
                </div>
              </div>

              {/* Block Type Selection */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">Block Type</label>
                <div className="space-y-3">
                  {blockTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBlockType(type.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        blockType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{type.name}</p>
                          <p className="text-gray-600">{formatCurrency(type.price)} per block</p>
                        </div>
                        {blockType === type.id && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Production Impact */}
              {state.isAuthenticated && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                  <h4 className="text-lg font-bold text-blue-900 mb-4">Production Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Machine Load:</span>
                      <span className="font-bold text-blue-900">{machineLoad.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Output Rate:</span>
                      <span className="font-bold text-blue-900">{estimatedOutputRate.toLocaleString()}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Est. Time:</span>
                      <span className="font-bold text-blue-900">{actualProductionTime} hrs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Production Time */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">Production Time</span>
                </div>
                <motion.div
                  key={actualProductionTime}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <p className="text-3xl font-black text-blue-600 mb-2">
                    {actualProductionTime} hours
                  </p>
                  <p className="text-lg text-gray-600">
                    Approx. {Math.ceil(actualProductionTime / 24)} days
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Output Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Total Cost Card */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)' }}
              className="bg-blue-600 text-white rounded-2xl p-8 shadow-xl mb-8"
            >
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">TOTAL COST</p>
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <p className="text-4xl lg:text-5xl font-black text-white">
                    {formatCurrency(totalPrice)}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Cost Breakdown */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-blue-600" />
                Cost Breakdown
              </h3>
              
              <div className="space-y-4">
                {/* Material Cost */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Material Cost:</span>
                    <motion.span
                      key={materialCost}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl font-bold text-gray-900"
                    >
                      {formatCurrency(materialCost)}
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      key={materialCost}
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">65% of total</p>
                </div>

                {/* Labor Cost */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Labor Cost:</span>
                    <motion.span
                      key={laborCost}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-xl font-bold text-gray-900"
                    >
                      {formatCurrency(laborCost)}
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      key={laborCost}
                      initial={{ width: '0%' }}
                      animate={{ width: '20%' }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">20% of total</p>
                </div>

                {/* Transport Cost */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Transport Cost:</span>
                    <motion.span
                      key={transportCost}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-xl font-bold text-gray-900"
                    >
                      {formatCurrency(transportCost)}
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      key={transportCost}
                      initial={{ width: '0%' }}
                      animate={{ width: '10%' }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">10% of total</p>
                </div>

                {/* Overhead Cost */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Overhead Cost:</span>
                    <motion.span
                      key={overheadCost}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-xl font-bold text-gray-900"
                    >
                      {formatCurrency(overheadCost)}
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      key={overheadCost}
                      initial={{ width: '0%' }}
                      animate={{ width: '5%' }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">5% of total</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
