'use client'

import * as React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Folder, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryWithChildren } from '@/actions/categories'
import { DragTypes } from '@/lib/constants'

interface CategoryTreeProps {
  categories: CategoryWithChildren[]
  selectedCategoryId?: string | null
  onCategorySelect?: (categoryId: string | null) => void
  onReorder?: (id: string, direction: 'up' | 'down') => void
}

export function CategoryTree({ 
  categories, 
  selectedCategoryId,
  onCategorySelect,
  onReorder
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {categories.map((category, index) => (
        <Droppable key={category.id} droppableId={category.id} type={DragTypes.BOOKMARK}>
          {(provided, snapshot) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className={cn(
                "relative rounded-lg transition-colors duration-150",
                snapshot.isDraggingOver && "bg-[var(--color-hover)]",
                "min-h-[40px]" // Ensure minimum height for empty categories
              )}
            >
              <div className="group relative flex">
                {/* Order buttons - only visible on hover, positioned to the left */}
                <div className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center">
                  {index > 0 && (
                    <button
                      onClick={() => onReorder?.(category.id, 'up')}
                      className="h-6 w-6 flex items-center justify-center hover:bg-[var(--color-hover)] rounded"
                    >
                      <ChevronUp className="w-4 h-4 text-[var(--color-medium)]" />
                    </button>
                  )}
                  {index < categories.length - 1 && (
                    <button
                      onClick={() => onReorder?.(category.id, 'down')}
                      className="h-6 w-6 flex items-center justify-center hover:bg-[var(--color-hover)] rounded"
                    >
                      <ChevronDown className="w-4 h-4 text-[var(--color-medium)]" />
                    </button>
                  )}
                </div>

                {/* Category button with indent */}
                <button
                  onClick={() => {
                    if (selectedCategoryId === category.id) {
                      onCategorySelect?.(null)
                    } else {
                      onCategorySelect?.(category.id)
                    }
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-between p-2 rounded-lg text-sm ml-6",
                    selectedCategoryId === category.id 
                      ? 'bg-[var(--color-dark)] text-[var(--color-lightest)]' 
                      : 'hover:bg-[var(--color-hover)]',
                    "transition-colors duration-150",
                    "relative z-10" // Ensure button stays above drop indicator
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={cn(
                      "w-4 h-4",
                      selectedCategoryId === category.id 
                        ? "text-[var(--color-lightest)]" 
                        : "text-[var(--color-dark)]"
                    )} />
                    <span className={cn(
                      selectedCategoryId === category.id 
                        ? "text-[var(--color-lightest)]" 
                        : "text-[var(--color-darkest)]"
                    )}>
                      {category.name}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs",
                    selectedCategoryId === category.id 
                      ? "text-[var(--color-lightest)]" 
                      : "text-[var(--color-medium)]"
                  )}>
                    {category.bookmarkCount}
                  </span>
                </button>

                {/* Drop indicator - full width/height absolute positioned element */}
                {snapshot.isDraggingOver && (
                  <div className="absolute inset-0 border-2 border-dashed border-[var(--color-dark)] rounded-lg pointer-events-none" />
                )}

                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  )
} 