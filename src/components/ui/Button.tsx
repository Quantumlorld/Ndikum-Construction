'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({ variant = 'primary', className, children, disabled, onClick, type = 'button' }: ButtonProps) {
  const baseClasses = variant === 'primary' 
    ? 'btn-primary' 
    : 'btn-secondary'

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseClasses, className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}
