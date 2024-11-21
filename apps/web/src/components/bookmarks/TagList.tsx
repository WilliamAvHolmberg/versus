'use client'

import { Tag } from 'lucide-react'

interface TagListProps {
  tags: string[]
  activeTag: string | null
  onTagClick: (tag: string | null) => void
}

export function TagList({ tags, activeTag, onTagClick }: TagListProps) {
  return (
    <div className="mb-8 p-4 flex flex-wrap items-center gap-2 bg-[var(--color-lightest)]">
      <Tag className="text-[var(--color-dark)]" size={20} />
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick(activeTag === tag ? null : tag)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 rounded-lg
            ${activeTag === tag 
              ? 'bg-[var(--color-dark)] text-[var(--color-lightest)]' 
              : 'bg-[var(--color-lightest)] text-[var(--color-darkest)] hover:bg-[var(--color-hover)]'
            }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  )
} 