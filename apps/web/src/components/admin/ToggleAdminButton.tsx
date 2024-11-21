'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleUserAdmin } from '../../actions/admin'
import type { User } from '@prisma/client'

interface ToggleAdminButtonProps {
  user: User
}

export function ToggleAdminButton({ user }: ToggleAdminButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await toggleUserAdmin(user.id)
      window.location.reload()
    } catch (err) {
      console.error('Failed to toggle admin status:', err)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-lg transition-colors"
      >
        <Shield size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-primary-900 rounded-xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-medium mb-2">Confirm Admin Toggle</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-4">
                Are you sure you want to {user.superAdmin ? 'remove' : 'grant'} admin privileges 
                for {user.name || user.username}?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle}
                  disabled={isLoading}
                  className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 