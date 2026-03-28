'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Palette, Home, Sparkles, Loader2 } from 'lucide-react'

export function SmartDesignLab() {
  const [description, setDescription] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [previewGenerated, setPreviewGenerated] = React.useState(false)

  const handleGenerate = () => {
    if (!description.trim()) return
    
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setPreviewGenerated(true)
    }, 3000)
  }

  return (
    <section id="design-lab" className="py-32 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            <span className="glow-text">Smart Design</span>
            <br />
            <span className="accent-glow">Lab</span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light">
            Transform your vision into reality with AI-powered architectural design
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-10 h-full backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Palette className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white">Describe Your Dream House</h3>
                  </div>
                  
                  <motion.textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your ideal home - architectural style, number of rooms, special features, outdoor spaces, smart home technology, sustainable materials..."
                    className="w-full h-56 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-lg transition-all duration-300"
                    whileFocus={{ scale: 1.02, borderColor: '#00D1FF' }}
                  />
                  
                  <motion.div
                    className="mt-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleGenerate}
                      disabled={!description.trim() || isGenerating}
                      className="w-full px-8 py-4 text-lg relative overflow-hidden"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute left-4"
                          >
                            <Loader2 className="w-5 h-5" />
                          </motion.div>
                          <span className="ml-8">Generating your design...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Generate 3D Preview
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="glass-card p-4 text-center"
                    >
                      <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-gray-300">AI-powered design</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="glass-card p-4 text-center"
                    >
                      <Home className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-gray-300">Instant 3D visualization</p>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard className="p-10 h-full backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
                {/* Glow/Blur Effects Background */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
                </div>

                {!previewGenerated ? (
                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Home className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                    </motion.div>
                    <p className="text-xl text-gray-400 mb-4">
                      Your 3D house preview will appear here
                    </p>
                    <p className="text-gray-500">
                      Describe your dream house and click generate to see the magic
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-full relative z-10"
                  >
                    {/* Realistic 3D House Preview */}
                    <motion.div
                      className="aspect-video bg-gradient-to-br from-primary/10 via-white/5 to-accent/10 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                      
                      <div className="text-center relative z-10">
                        <motion.div
                          animate={{ rotateY: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="mb-4"
                        >
                          <Home className="w-16 h-16 text-primary mx-auto" />
                        </motion.div>
                        <p className="text-2xl font-bold text-primary mb-2">3D House Preview</p>
                        <p className="text-gray-400">AI-generated architectural design</p>
                      </div>
                    </motion.div>
                    
                    {/* Enhanced Details */}
                    <div className="grid grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6"
                      >
                        <p className="text-gray-400 mb-2">Style</p>
                        <p className="text-xl font-semibold text-white">Modern Contemporary</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6"
                      >
                        <p className="text-gray-400 mb-2">Square Feet</p>
                        <p className="text-xl font-semibold text-white">2,500 sq ft</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6"
                      >
                        <p className="text-gray-400 mb-2">Bedrooms</p>
                        <p className="text-xl font-semibold text-white">4 bedrooms</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6"
                      >
                        <p className="text-gray-400 mb-2">Est. Cost</p>
                        <p className="text-xl font-bold accent-glow">25M XAF</p>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-8"
                    >
                      <Button className="w-full px-8 py-4 text-lg">
                        Download Full Design
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
