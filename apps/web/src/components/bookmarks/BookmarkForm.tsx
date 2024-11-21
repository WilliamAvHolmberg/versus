'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, } from 'framer-motion'
import { createBookmark, updateBookmark } from '../../actions/bookmarks'
import { getContentTypes } from '../../actions/content-types'
import type { ContentType } from '@prisma/client'
import type { BookmarkWithContentType } from '../../lib/types'
import type { CategoryWithChildren } from '@/actions/categories'

interface BookmarkFormProps {
  onBookmarkCreated?: (bookmark: BookmarkWithContentType) => void
  onBookmarkUpdated?: (bookmark: BookmarkWithContentType) => void
  onClose: () => void
  categories: CategoryWithChildren[]
  bookmark: BookmarkWithContentType | null
}

export function BookmarkForm({
  onBookmarkCreated,
  onBookmarkUpdated,
  onClose,
  categories,
  bookmark
}: BookmarkFormProps) {
  const [url, setUrl] = useState(bookmark?.url || '')
  const [title, setTitle] = useState(bookmark?.title || '')
  const [tags, setTags] = useState<string[]>(bookmark?.tags || [])
  const [categoryId, setCategoryId] = useState<string | null>(bookmark?.categoryId || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  useEffect(() => {
    const loadContentTypes = async () => {
      if (contentTypes.length === 0) {
        const types = await getContentTypes()
        setContentTypes(types)
      }
    }
    loadContentTypes()
  }, [contentTypes.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (bookmark) {
        const updated = await updateBookmark({
          id: bookmark.id,
          title,
          tags,
          categoryId,
        })
        onBookmarkUpdated?.(updated)
      } else {
        const newBookmark = await createBookmark({
          url,
          title,
          tags,
          contentTypeId: contentTypes[0]?.id || '',
          categoryId
        })
        onBookmarkCreated?.(newBookmark)
      }
    } catch (error) {
      console.error('Failed to save bookmark:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
        className="w-full max-w-lg bg-[var(--color-lightest)]"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--color-darkest)]">{bookmark ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
            <button onClick={onClose} className="hover:bg-[var(--color-hover)] p-2 rounded-lg">
              <X size={24} className="text-[var(--color-dark)]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!bookmark && (
              <div>
                <label className="block text-sm font-medium mb-1 text-[#000]">URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full p-2 border border-[#000] rounded-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-[#000]">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border border-[#000] rounded-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#000]">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags.join(',')}
                onChange={e => setTags(e.target.value.split(','))}
                className="w-full p-2 border border-[#000] rounded-full"
                placeholder="tech, article, tutorial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category (optional)
              </label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value || null)}
                className="w-full p-2 rounded-lg border border-[var(--color-medium)]"
              >
                <option value="">No category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--color-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-[var(--color-dark)] text-[var(--color-lightest)] rounded-lg 
                  hover:bg-[var(--color-darkest)] disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : bookmark ? 'Update' : 'Add Bookmark'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
} 