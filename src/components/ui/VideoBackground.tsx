'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VideoBackgroundProps {
  videoSrc?: string
  imageSrc?: string
  className?: string
  children?: React.ReactNode
}

export function VideoBackground({ videoSrc, imageSrc, className = '', children }: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false)

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {videoSrc ? (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
