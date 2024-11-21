'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SettingsForm } from './SettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs'
import { useAuth } from '../../contexts/auth'

export function SettingsDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    window.addEventListener('toggleSettings', handleToggle)
    return () => window.removeEventListener('toggleSettings', handleToggle)
  }, [])

  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white dark:bg-primary-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                    <SettingsForm user={user} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 