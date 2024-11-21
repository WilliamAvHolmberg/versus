'use client'

import { Droppable, Draggable, DraggableProvided } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { BookmarkCard } from './BookmarkCard'
import type { BookmarkWithContentType } from '@/lib/types'
import type { CategoryWithChildren } from '@/actions/categories'
import { DragTypes } from '@/lib/constants'

interface BookmarkGridProps {
  bookmarks: BookmarkWithContentType[]
  onDelete: (id: string, categoryId: string | null) => void
  onEdit: (bookmark: BookmarkWithContentType) => void
  onQuickView: (bookmark: BookmarkWithContentType) => void
  onArchive: (id: string) => void
  view: 'inbox' | 'archived'
  onNewBookmark: () => void
  selectedCategory?: CategoryWithChildren | null
}

export function BookmarkGrid({
  bookmarks,
  onDelete,
  onEdit,
  onQuickView,
  onArchive,
  view,
  onNewBookmark,
  selectedCategory
}: BookmarkGridProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-shrink-0">
        <div
          className="flex items-center justify-between mb-2 p-3 rounded-lg text-[var(--color-lightest)]"
          style={{
            background: 'var(--gradient-primary)'
          }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              {selectedCategory
                ? selectedCategory.name
                : view === 'inbox'
                  ? 'Unread'
                  : 'Archive'
              }
            </h2>
            {selectedCategory && (
              <span className="text-sm opacity-75">
                ({bookmarks.length} bookmarks)
              </span>
            )}
          </div>
          <button
            onClick={onNewBookmark}
            className="p-1 bg-[var(--color-lightest)] text-[var(--color-darkest)] 
              hover:bg-[var(--color-light)] hover:text-[var(--color-lightest)] 
              rounded-full transition-colors backdrop-blur-sm"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <Droppable droppableId="bookmarks" type={DragTypes.BOOKMARK} isDropDisabled>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="space-y-0">
              {bookmarks.map((bookmark, index) => (
                <Draggable
                  key={bookmark.id}
                  draggableId={bookmark.id}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${index % 2 === 0
                          ? 'bg-[var(--color-stripe-even)]'
                          : 'bg-[var(--color-stripe-odd)]'
                        }`}
                    >
                      <BookmarkCard
                        bookmark={bookmark}
                        onDelete={() => onDelete(bookmark.id, bookmark.categoryId)}
                        onQuickView={() => onQuickView(bookmark)}
                        onArchive={() => onArchive(bookmark.id)}
                        onEdit={() => onEdit(bookmark)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  )
} 