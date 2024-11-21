'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  label?: string
}

export function DeleteButton({ onDelete, label = 'Delete' }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete()
      window.location.reload()
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 size={20} />
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
              <h3 className="text-lg font-medium mb-2">Confirm Delete</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-4">
                Are you sure you want to delete this {label.toLowerCase()}? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 