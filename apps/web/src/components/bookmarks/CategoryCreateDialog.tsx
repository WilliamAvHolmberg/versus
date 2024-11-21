'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { createCategory } from '@/actions/categories'
import type { CategoryWithChildren } from '@/actions/categories'

interface CategoryCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (category: CategoryWithChildren) => void
  parentId?: string
}

export function CategoryCreateDialog({ 
  isOpen, 
  onClose,
  onSuccess,
  parentId 
}: CategoryCreateDialogProps) {
  const [name, setName] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const category = await createCategory({ 
        name,
        parentId: parentId || null
      })
      
      // Transform to match CategoryWithChildren type
      onSuccess({
        id: category.id,
        name: category.name,
        order: category.order,
        bookmarkCount: 0
      })
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-[var(--color-dark)]"
            >
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[var(--color-medium)] 
                px-3 py-2 text-sm focus:outline-none focus:ring-2 
                focus:ring-[var(--color-dark)] focus:border-transparent"
              placeholder="Enter category name"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--color-hover)]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-[var(--color-dark)] text-[var(--color-lightest)] 
                rounded-lg hover:bg-[var(--color-darkest)] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 