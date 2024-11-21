'use client'

import { Maximize2, Trash2, Check, Edit } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BookmarkWithContentType } from '../../lib/types'
import { formatDate } from '@/lib/utils'
import { incrementBookmarkClickCount } from '../../actions/bookmarks'

interface BookmarkCardProps {
  bookmark: BookmarkWithContentType
  onDelete: (id: string) => void
  onQuickView: (bookmark: BookmarkWithContentType) => void
  onArchive: () => void
  onEdit: (bookmark: BookmarkWithContentType) => void
}

export function BookmarkCard({ 
  bookmark, 
  onDelete, 
  onQuickView, 
  onArchive,
  onEdit
}: BookmarkCardProps) {
  const handleClick = () => {
    // Don't block the navigation - fire and forget
    incrementBookmarkClickCount(bookmark.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative group w-full"
    >
      <div className="flex items-center gap-4 p-4 hover:shadow-sm transition-all">
        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`${bookmark.status === 'unread' ? 'font-bold' : 'font-medium'} text-[var(--color-darkest)] truncate`}>
              {bookmark.title}
            </h3>
            {bookmark.clickCount > 0 && (
              <span className="text-xs text-[var(--color-medium)] whitespace-nowrap">
                {bookmark.clickCount} {bookmark.clickCount === 1 ? 'visit' : 'visits'}
              </span>
            )}
          </div>
          <a 
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer" 
            onClick={handleClick}
            className="text-sm text-[var(--color-medium)] hover:text-[var(--color-darkest)] truncate hover:underline block"
          >
            {bookmark.url}
          </a>
        </div>

        {/* Timestamp with transition */}
        <span 
          className="text-xs text-[var(--color-medium)] whitespace-nowrap transition-transform duration-300 group-hover:-translate-x-64"
        >
          {formatDate(bookmark.createdAt)}
        </span>

        {/* Actions - Fixed position with slide in */}
        <div 
          className="absolute right-4 flex items-center gap-2 transition-all duration-300 transform translate-x-[calc(100%+1rem)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        >
          {bookmark.status === 'unread' && (
            <button 
              onClick={onArchive} 
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg"
              title="Mark as read"
            >
              <Check size={20} className="text-[var(--color-dark)]" />
            </button>
          )}
          <button 
            onClick={() => onEdit(bookmark)} 
            className="p-2 hover:bg-[var(--color-hover)] rounded-lg"
            title="Edit"
          >
            <Edit size={20} className="text-[var(--color-dark)]" />
          </button>
          <button 
            onClick={() => onQuickView(bookmark)} 
            className="p-2 hover:bg-[var(--color-hover)] rounded-lg"
            title="Quick view"
          >
            <Maximize2 size={20} className="text-[var(--color-dark)]" />
          </button>
          <button 
            onClick={() => onDelete(bookmark.id)} 
            className="p-2 hover:bg-[var(--color-hover)] rounded-lg"
            title="Delete"
          >
            <Trash2 size={20} className="text-[var(--color-dark)]" />
          </button>
        </div>
      </div>
    </motion.div>
  )
} 