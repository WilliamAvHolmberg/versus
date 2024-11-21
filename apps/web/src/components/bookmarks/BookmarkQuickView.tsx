'use client'

import { X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmbedContent } from './EmbedContent'
import type { BookmarkWithContentType } from '../../lib/types'

interface BookmarkQuickViewProps {
  bookmark: BookmarkWithContentType | null
  onClose: () => void
}

export function BookmarkQuickView({ bookmark, onClose }: BookmarkQuickViewProps) {
  if (!bookmark) return null

  return (
    <AnimatePresence>
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
          className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-[var(--color-lightest)]"
        >
          <div className="p-4 border-b border-[var(--color-darkest)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={bookmark.contentType.logo}
                alt={bookmark.contentType.name}
                className="w-6 h-6"
              />
              <h2 className="font-medium text-[var(--color-darkest)]">{bookmark.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <ExternalLink size={20} className="text-[var(--color-dark)]" />
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <X size={20} className="text-[var(--color-dark)]" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
            <EmbedContent bookmark={bookmark} />

            <div className="mt-4 flex flex-wrap gap-2">
              {bookmark.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-[var(--color-dark)] text-[var(--color-lightest)] rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 