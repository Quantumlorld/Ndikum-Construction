'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  Mountain, 
  Zap, 
  Beaker, 
  Package, 
  Boxes,
  ArrowRight 
} from 'lucide-react'

const processSteps = [
  {
    id: 'stone',
    title: 'Stone',
    description: 'Raw materials extracted and prepared',
    icon: Mountain
  },
  {
    id: 'grinder',
    title: 'Grinder',
    description: 'Stone crushed to precise aggregate',
    icon: Zap
  },
  {
    id: 'mixer',
    title: 'Mixer',
    description: 'Concrete mixed with perfect ratios',
    icon: Beaker
  },
  {
    id: 'block-machine',
    title: 'Block Machine',
    description: 'Automated block production',
    icon: Package
  },
  {
    id: 'blocks',
    title: 'Finished Blocks',
    description: 'Quality blocks ready for delivery',
    icon: Boxes
  }
]

export function SystemFlow() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="system-flow" className="section-padding">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="glow-text">Intelligent Production</span>
            <br />
            <span className="accent-glow">System Flow</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From raw materials to finished blocks, every step is optimized for maximum efficiency 
            and quality control.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {processSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div variants={itemVariants}>
                  <GlassCard className="text-center h-full hover:scale-105 transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/20">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </GlassCard>
                </motion.div>
                
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="hidden md:flex justify-center items-center"
                    variants={itemVariants}
                  >
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-primary"
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Mobile arrows */}
          <div className="flex md:hidden justify-center mt-4">
            {processSteps.slice(0, -1).map((_, index) => (
              <motion.div
                key={index}
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                className="text-primary mx-2"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
