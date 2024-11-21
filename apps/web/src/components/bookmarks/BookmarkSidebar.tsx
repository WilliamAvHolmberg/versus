'use client'

import * as React from 'react'
import { Plus, Inbox, Archive, MoreVertical, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryTree } from './CategoryTree'
import { CategoryWithChildren, updateCategoryOrder, deleteCategory } from '@/actions/categories'
import { CategoryCreateDialog } from './CategoryCreateDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface BookmarkSidebarProps {
  view: 'inbox' | 'archived'
  onViewChange: (view: 'inbox' | 'archived') => void
  unreadCount: number
  categories: CategoryWithChildren[]
  setCategories: React.Dispatch<React.SetStateAction<CategoryWithChildren[]>>
  onBookmarkDrop?: (bookmarkId: string, categoryId: string) => void
  selectedCategoryId?: string | null
  onCategorySelect?: (categoryId: string | null) => void
  handleCreateCategory: (newCategory: CategoryWithChildren) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function BookmarkSidebar({
  view,
  onViewChange,
  unreadCount,
  categories,
  setCategories,
  selectedCategoryId,
  onCategorySelect,
  handleCreateCategory,
  isMobileOpen,
  setIsMobileOpen,
}: BookmarkSidebarProps) {
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = React.useState(false)
  const [sidebarWidth, setSidebarWidth] = React.useState(272) // Default width
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedParentId, setSelectedParentId] = React.useState<string | undefined>()

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const stopResizing = React.useCallback(() => {
    setIsResizing(false)
  }, [])

  console.log(sidebarWidth)

  const resize = React.useCallback((e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left
      console.log(newWidth)
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing])

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const handleViewChange = (newView: 'inbox' | 'archived') => {
    onViewChange(newView)
    // Deselect category when changing view
    onCategorySelect?.(null)
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === id)
    if (currentIndex === -1) return

    const newCategories = [...categories]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    // Swap items
    const temp = newCategories[currentIndex]
    newCategories[currentIndex] = newCategories[newIndex]
    newCategories[newIndex] = temp

    // Update order numbers
    const updates = newCategories.map((cat, index) => ({
      id: cat.id,
      order: index
    }))

    // Optimistically update UI
    setCategories(newCategories)

    // Update in database
    try {
      await updateCategoryOrder(updates)
    } catch (error) {
      console.error('Failed to update category order:', error)
      // Revert on error
      setCategories(categories)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      // Remove from local state
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      // Deselect if it was selected
      if (selectedCategoryId === categoryId) {
        onCategorySelect?.(null)
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      // You might want to show an error toast here
    }
  }

  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen])

  return (
    <>
      {/* Mobile toggle button - made larger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 p-4 rounded-full bg-[var(--color-dark)] text-[var(--color-lightest)] shadow-lg"
      >
        <Menu className="w-7 h-7" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:relative lg:z-0",
          "transition-transform duration-300",
          !isMobileOpen && "invisible",
          isMobileOpen && "visible",
          "lg:visible"
        )}
      >
        {/* Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar - updated for mobile */}
        <div
          ref={sidebarRef}
          className={cn(
            `relative flex-shrink-0 border-r border-[var(--color-darkest)] min-w-[${sidebarWidth}px]`,
            isMobileOpen ? "h-full block w-auto w-[95%] max-w-[400px] shadow-xl bg-[var(--color-lightest)] p-4 " : "",
            'lg:p-0 lg:shadow-none lg:min-w-0 lg:h:auto lg:relative'
          )}
          style={{ width: !isMobileOpen ? sidebarWidth : undefined, minWidth: `${sidebarWidth}px` }}
        >
          {/* Close button - made larger */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute right-3 top-3 p-3 hover:bg-[var(--color-hover)] rounded-lg"
          >
            <X className="w-6 h-6 text-[var(--color-dark)]" />
          </button>

          {/* Content wrapper - adjusted padding */}
          <div className={cn(
            "h-full overflow-auto",
            "pt-16",
            "lg:pt-0",
            "lg:px-4",
          )}>
            {/* Main sections - increased spacing and touch targets */}
            <div className="space-y-1 mb-8"> {/* Increased spacing */}
              <button
                onClick={() => handleViewChange('inbox')}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-sm",
                  view === 'inbox' && !selectedCategoryId
                    ? 'bg-[var(--color-dark)] text-[var(--color-lightest)]'
                    : 'hover:bg-[var(--color-hover)]',
                  "transition-colors duration-150"
                )}
              >
                <div className="flex items-center gap-2"> {/* Increased gap */}
                  <Inbox className={cn(
                    "w-4 h-4", // Larger icon
                    view === 'inbox' && !selectedCategoryId
                      ? "text-[var(--color-lightest)]"
                      : "text-[var(--color-dark)]"
                  )} />
                  <span>Unread</span>
                </div>
                {unreadCount > 0 && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    view === 'inbox' && !selectedCategoryId
                      ? 'bg-[var(--color-lightest)] text-[var(--color-darkest)]'
                      : 'bg-[var(--color-dark)] text-[var(--color-lightest)]'
                  )}>
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleViewChange('archived')}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg text-sm",
                  view === 'archived' && !selectedCategoryId
                    ? 'bg-[var(--color-dark)] text-[var(--color-lightest)]'
                    : 'hover:bg-[var(--color-hover)]',
                  "transition-colors duration-150"
                )}
              >
                <div className="flex items-center gap-2"> {/* Increased gap */}
                  <Archive className={cn(
                    "w-4 h-4", // Larger icon
                    view === 'archived' && !selectedCategoryId
                      ? "text-[var(--color-lightest)]"
                      : "text-[var(--color-dark)]"
                  )} />
                  <span>Archive</span>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 group">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-[var(--color-darkest)]">Categories</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-[var(--color-hover)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-[var(--color-dark)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {selectedCategoryId && (
                      <DropdownMenuItem
                        onSelect={() => {
                          if (window.confirm('Are you sure you want to delete this category?')) {
                            handleDeleteCategory(selectedCategoryId)
                          }
                        }}
                        className="text-red-600"
                      >
                        Delete Selected Category
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button
                onClick={() => {
                  setSelectedParentId(undefined)
                  setIsCreateDialogOpen(true)
                }}
                className="p-1 hover:bg-[var(--color-hover)] rounded-lg"
              >
                <Plus className="w-4 h-4 text-[var(--color-dark)]" />
              </button>
            </div>

            <CategoryTree
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={onCategorySelect}
              onReorder={handleReorder}
            />

            <CategoryCreateDialog
              isOpen={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              onSuccess={handleCreateCategory}
              parentId={selectedParentId}
            />
          </div>

          <div
            className={cn(
              "absolute top-0 right-0 w-1 h-full cursor-col-resize",
              "hover:bg-[var(--color-hover)]",
              isResizing && "bg-[var(--color-active)]"
            )}
            onMouseDown={startResizing}
          />
        </div>
      </div>
    </>
  )
} 