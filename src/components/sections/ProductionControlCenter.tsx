'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, FileText, Activity, Zap, AlertCircle, CheckCircle, Settings, BarChart3 } from 'lucide-react'
import { useAppState } from '@/store/ProductionState'
import { LoadingButton } from '@/components/ui/LoadingSpinner'
import { ProductionChart, MetricCard } from '@/components/charts/ProductionChart'
import { ProgressIndicator, CircularProgress } from '@/components/ui/ProgressIndicator'

export function ProductionControlCenter() {
  const { state, dispatch } = useAppState()
  const [isLoading, setIsLoading] = React.useState<'start' | 'pause' | null>(null)
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  // Generate sample data for charts
  const productionData = React.useMemo(() => [
    { time: '00:00', value: 2100 },
    { time: '04:00', value: 2450 },
    { time: '08:00', value: 2847 },
    { time: '12:00', value: 3200 },
    { time: '16:00', value: 2950 },
    { time: '20:00', value: 2680 },
  ], [])

  const efficiencyData = React.useMemo(() => [
    { time: 'Mon', value: 92 },
    { time: 'Tue', value: 94 },
    { time: 'Wed', value: 89 },
    { time: 'Thu', value: 96 },
    { time: 'Fri', value: 94 },
  ], [])

  const handleStartProduction = async () => {
    setIsLoading('start')
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch({ type: 'START_PRODUCTION' })
    setIsLoading(null)
  }

  const handlePauseProduction = async () => {
    setIsLoading('pause')
    await new Promise(resolve => setTimeout(resolve, 800))
    dispatch({ type: 'PAUSE_PRODUCTION' })
    setIsLoading(null)
  }

  const handleViewReports = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'info',
        message: 'Generating detailed production reports...'
      }
    })
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600'
  }

  const getStatusBg = (status: boolean) => {
    return status ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />
  }

  const getStatusText = (status: boolean) => {
    return status ? 'RUNNING' : 'STOPPED'
  }

  const productionSteps = [
    {
      id: 'init',
      label: 'System Initialization',
      status: state.production.isRunning ? 'completed' as const : 'pending' as const,
      description: 'Initialize all production systems'
    },
    {
      id: 'machines',
      label: 'Machine Activation',
      status: state.production.isRunning ? 'completed' as const : 'pending' as const,
      description: 'Activate production machinery'
    },
    {
      id: 'production',
      label: 'Production Running',
      status: state.production.isRunning ? 'active' as const : 'pending' as const,
      description: 'Manufacturing in progress'
    },
    {
      id: 'monitoring',
      label: 'Active Monitoring',
      status: state.production.isRunning ? 'active' as const : 'pending' as const,
      description: 'Real-time system monitoring'
    }
  ]

  return (
    <section id="dashboard" className="section-padding bg-gray-50">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            <span className="text-blue-600">Production Control</span>
            <br />
            <span className="text-gray-900">Center</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Advanced real-time control and monitoring of your intelligent production system
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Production Overview */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductionChart
                data={productionData}
                title="Production Output Rate"
                unit="blocks/hr"
                color="#3B82F6"
                height={250}
              />
            </div>
            <div>
              <MetricCard
                title="System Efficiency"
                value={state.production.efficiency}
                unit="%"
                change={2.3}
                changeType="increase"
                icon={<Activity className="w-5 h-5 text-blue-600" />}
                chart={efficiencyData}
                color="#10B981"
              />
            </div>
          </div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                System Control Panel
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                {showAdvanced ? 'Simple View' : 'Advanced View'}
              </motion.button>
            </div>

            {showAdvanced ? (
              <div className="space-y-8">
                <ProgressIndicator steps={productionSteps} />
                
                <div className="grid md:grid-cols-3 gap-6">
                  <LoadingButton
                    whileHover={{ scale: state.production.isRunning ? 1 : 1.05 }}
                    whileTap={{ scale: state.production.isRunning ? 1 : 0.95 }}
                    onClick={handleStartProduction}
                    disabled={state.production.isRunning || isLoading !== null}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      state.production.isRunning || isLoading !== null
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400'
                    }`}
                    isLoading={isLoading === 'start'}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={state.production.isRunning ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: state.production.isRunning ? Infinity : 0 }}
                      >
                        <Play className={`w-12 h-12 ${state.production.isRunning || isLoading !== null ? 'text-gray-400' : 'text-green-600'}`} />
                      </motion.div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900">Start Production</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {state.production.isRunning ? 'System is running' : 'Initialize all systems'}
                        </p>
                      </div>
                    </div>
                  </LoadingButton>

                  <LoadingButton
                    whileHover={{ scale: !state.production.isRunning ? 1 : 1.05 }}
                    whileTap={{ scale: !state.production.isRunning ? 1 : 0.95 }}
                    onClick={handlePauseProduction}
                    disabled={!state.production.isRunning || isLoading !== null}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      !state.production.isRunning || isLoading !== null
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                        : 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400'
                    }`}
                    isLoading={isLoading === 'pause'}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Pause className={`w-12 h-12 ${!state.production.isRunning || isLoading !== null ? 'text-gray-400' : 'text-red-600'}`} />
                      <div>
                        <h4 className="text-xl font-black text-gray-900">Pause Production</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {!state.production.isRunning ? 'System is stopped' : 'Temporarily halt operations'}
                        </p>
                      </div>
                    </div>
                  </LoadingButton>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewReports}
                    className="p-6 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="w-12 h-12 text-blue-600" />
                      <div>
                        <h4 className="text-xl font-black text-gray-900">View Reports</h4>
                        <p className="text-sm text-gray-600 mt-1">Generate detailed analytics</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <LoadingButton
                  whileHover={{ scale: state.production.isRunning ? 1 : 1.05 }}
                  whileTap={{ scale: state.production.isRunning ? 1 : 0.95 }}
                  onClick={handleStartProduction}
                  disabled={state.production.isRunning || isLoading !== null}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    state.production.isRunning || isLoading !== null
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400'
                  }`}
                  isLoading={isLoading === 'start'}
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={state.production.isRunning ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: state.production.isRunning ? Infinity : 0 }}
                    >
                      <Play className={`w-12 h-12 ${state.production.isRunning || isLoading !== null ? 'text-gray-400' : 'text-green-600'}`} />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">Start Production</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {state.production.isRunning ? 'System is running' : 'Initialize all systems'}
                      </p>
                    </div>
                  </div>
                </LoadingButton>

                <LoadingButton
                  whileHover={{ scale: !state.production.isRunning ? 1 : 1.05 }}
                  whileTap={{ scale: !state.production.isRunning ? 1 : 0.95 }}
                  onClick={handlePauseProduction}
                  disabled={!state.production.isRunning || isLoading !== null}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    !state.production.isRunning || isLoading !== null
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400'
                  }`}
                  isLoading={isLoading === 'pause'}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Pause className={`w-12 h-12 ${!state.production.isRunning || isLoading !== null ? 'text-gray-400' : 'text-red-600'}`} />
                    <div>
                      <h4 className="text-xl font-black text-gray-900">Pause Production</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {!state.production.isRunning ? 'System is stopped' : 'Temporarily halt operations'}
                      </p>
                    </div>
                  </div>
                </LoadingButton>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewReports}
                  className="p-6 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-300"
                >
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="w-12 h-12 text-blue-600" />
                    <div>
                      <h4 className="text-xl font-black text-gray-900">View Reports</h4>
                      <p className="text-sm text-gray-600 mt-1">Generate detailed analytics</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Live Status Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* System Status */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl border-2 ${getStatusBg(state.production.isRunning)} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-600">System Status</span>
                <div className={getStatusColor(state.production.isRunning)}>
                  {getStatusIcon(state.production.isRunning)}
                </div>
              </div>
              <motion.div
                key={`status-${state.production.isRunning}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className={`text-2xl font-black ${getStatusColor(state.production.isRunning)}`}>
                  {getStatusText(state.production.isRunning)}
                </p>
              </motion.div>
            </motion.div>

            {/* Output Rate */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-600">Output Rate</span>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <motion.div
                key={state.production.outputRate}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl font-black text-gray-900">
                  {state.production.outputRate.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">blocks/hr</p>
              </motion.div>
            </motion.div>

            {/* Active Machines */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-600">Active Machines</span>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <motion.div
                key={state.production.activeMachines}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl font-black text-gray-900">
                  {state.production.activeMachines}/{state.production.totalMachines}
                </p>
                <p className="text-sm text-gray-500 mt-1">operational</p>
              </motion.div>
            </motion.div>

            {/* Efficiency */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-600">Efficiency</span>
                <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <motion.div
                key={state.production.efficiency}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl font-black text-gray-900">
                  {state.production.efficiency}%
                </p>
                <p className="text-sm text-gray-500 mt-1">optimal</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Production Progress */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Production Progress</h3>
                <CircularProgress
                  value={state.production.isRunning ? 68 : 0}
                  max={100}
                  size={150}
                  strokeWidth={12}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">68%</div>
                    <div className="text-sm text-gray-500">Daily Target</div>
                  </div>
                </CircularProgress>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-bold text-green-600">42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Memory</span>
                    <span className="text-sm font-bold text-yellow-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-sm font-bold text-green-600">Normal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temperature</span>
                    <span className="text-sm font-bold text-green-600">72°C</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
