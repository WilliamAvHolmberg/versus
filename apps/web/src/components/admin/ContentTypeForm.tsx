'use client'

import { useState } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createContentType, updateContentType } from '../../actions/admin'
import type { ContentType } from '@prisma/client'

interface ContentTypeFormProps {
  contentType?: ContentType
  mode?: 'create' | 'edit'
}

export function ContentTypeForm({ contentType, mode = 'create' }: ContentTypeFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: contentType?.name || '',
    logo: contentType?.logo || '',
    strategy: contentType?.strategy || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'create') {
        await createContentType(formData)
      } else if (contentType) {
        await updateContentType(contentType.id, formData)
      }

      // Reset form
      setFormData({
        name: '',
        logo: '',
        strategy: ''
      })
      setIsOpen(false)
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${mode === 'create' 
            ? 'bg-accent-500 text-white hover:bg-accent-600' 
            : 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-800/50'
          }`}
      >
        {mode === 'create' ? (
          <>
            <Plus size={20} />
            Add Content Type
          </>
        ) : (
          <Pencil size={20} />
        )}
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
              className="bg-white dark:bg-primary-900 rounded-xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {mode === 'create' ? 'Add Content Type' : 'Edit Content Type'}
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-primary-500">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                    placeholder="twitter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <input
                    type="url"
                    required
                    value={formData.logo}
                    onChange={e => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    className="w-full p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                    placeholder="https://example.com/logo.svg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Strategy</label>
                  <input
                    type="text"
                    required
                    value={formData.strategy}
                    onChange={e => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                    className="w-full p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
                    placeholder="twitter"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : mode === 'create' ? 'Add' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 