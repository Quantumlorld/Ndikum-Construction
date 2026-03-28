'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredPageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function SlideTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== 'undefined' ? window.location.pathname : 'default'}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
