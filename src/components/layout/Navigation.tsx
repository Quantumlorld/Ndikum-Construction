'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Menu, X, User, LogIn } from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState('hero')
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login')

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Metrics', href: '#metrics' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'System Flow', href: '#system-flow' },
    { name: 'Production', href: '#production' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Design Lab', href: '#design-lab' },
    { name: 'Contact', href: '#contact' }
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''))
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg transition-all duration-300">
        <div className="container-premium mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-black font-bold"
            >
              NDIKUM
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative px-3 py-2 rounded-md transition-all duration-300 font-bold ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      animate={true}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('login')
                  setIsAuthModalOpen(true)
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-bold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Access System
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('register')
                  setIsAuthModalOpen(true)
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg"
              >
                <User className="w-4 h-4" />
                Initialize Account
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
            >
              <div className="px-6 py-4 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md transition-all duration-300 font-bold ${
                      activeSection === item.href.replace('#', '')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setIsAuthModalOpen(true)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 font-bold transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Access System
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register')
                      setIsAuthModalOpen(true)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    Initialize Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
