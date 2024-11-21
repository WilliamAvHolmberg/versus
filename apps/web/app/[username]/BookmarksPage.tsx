'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { SearchBar } from '@/components/ui/SearchBar'
import { BookmarkGrid } from '@/components/bookmarks/BookmarkGrid'
import { BookmarkForm } from '@/components/bookmarks/BookmarkForm'
import { BookmarkQuickView } from '@/components/bookmarks/BookmarkQuickView'
import { BookmarkSidebar } from '@/components/bookmarks/BookmarkSidebar'
import { deleteBookmark, updateBookmarkStatus, updateBookmarkCategory } from '../../src/actions/bookmarks'
import { BookmarkWithContentType } from '@/lib/types'
import type { CategoryWithChildren } from '@/actions/categories'
import { DragTypes } from '@/lib/constants'


interface BookmarksPageProps {
    username: string
    bookmarks: BookmarkWithContentType[]
    tags: string[]
    categories: CategoryWithChildren[]
}

export function BookmarksPage({
    username,
    bookmarks: initialBookmarks,
    tags: initialTags,
    categories: initialCategories,
}: BookmarksPageProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [bookmarks, setBookmarks] = useState(initialBookmarks)
    const [tags, setTags] = useState(initialTags)
    const [search, setSearch] = useState('')
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkWithContentType | null>(null)
    const [view, setView] = useState<'inbox' | 'archived'>('inbox')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [bookmarkToEdit, setBookmarkToEdit] = useState<BookmarkWithContentType | null>(null)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const unreadCount = useMemo(() =>
        bookmarks.filter(b => b.status === 'unread' && !b.categoryId).length,
        [bookmarks]
    )

    const filteredBookmarks = useMemo(() => {
        return bookmarks.filter(bookmark => {
            if (selectedCategoryId) {
                return bookmark.categoryId === selectedCategoryId
            }

            const isUncategorized = !bookmark.categoryId

            const matchesView = view === 'inbox'
                ? bookmark.status === 'unread' && isUncategorized
                : bookmark.status === 'archived' && isUncategorized

            const matchesSearch = search === '' ||
                bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
                bookmark.url.toLowerCase().includes(search.toLowerCase()) ||
                bookmark.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

            return matchesView && matchesSearch
        })
    }, [bookmarks, view, search, selectedCategoryId])

    const handleDelete = async (id: string, categoryId: string | null) => {
        await deleteBookmark(id, username)
        setBookmarks(bookmarks.filter(b => b.id !== id))
        if (categoryId) {
            setCategories(categories.map(c => c.id === categoryId ? { ...c, bookmarkCount: c.bookmarkCount - 1 } : c))
        }
    }

    const handleArchive = async (id: string) => {
        await updateBookmarkStatus(id, 'archived', username)
        setBookmarks(bookmarks.map(b => b.id === id ? { ...b, status: 'archived' } : b))
    }

    const handleNewBookmark = (bookmark: BookmarkWithContentType) => {
        setBookmarks(prev => [bookmark, ...prev])
        const newTags = new Set(tags)
        bookmark.tags.forEach(tag => newTags.add(tag))
        setTags(Array.from(newTags))
        setIsFormOpen(false)
    }

    const handleBookmarkCategoryChange = async (bookmarkId: string, categoryId: string, oldCategoryId: string | null) => {
        const bookmark = await updateBookmarkCategory(bookmarkId, categoryId, username)
        console.log(categoryId, oldCategoryId)
        setCategories(prev => prev.map(cat => {
            if (cat.id === oldCategoryId) {
                return {
                    ...cat,
                    bookmarkCount: cat.bookmarkCount - 1
                }
            }
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    bookmarkCount: cat.bookmarkCount + 1
                }
            }
            return cat
        }))
        setBookmarks(prev => prev.map(b =>
            b.id === bookmarkId ? bookmark : b
        ))
    }

    const handleDragStart = () => {
        setIsMobileOpen(true)
    }

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            setIsMobileOpen(false)
            return
        }

        if (result.type === DragTypes.BOOKMARK && result.destination.droppableId !== 'bookmarks') {
            const oldCategoryId = bookmarks.find(b => b.id === result.draggableId)?.categoryId
            await handleBookmarkCategoryChange(result.draggableId, result.destination.droppableId, oldCategoryId ?? null)
        }
        
        setIsMobileOpen(false)
    }

    const handleCreateCategory = (newCategory: CategoryWithChildren) => {
        setCategories(prev => {
            return [...prev, newCategory]
        })
    }

    const handleBookmarkUpdate = (updated: BookmarkWithContentType) => {
        setBookmarks(prev => prev.map(b => b.id === updated.id ? updated : b))
        setBookmarkToEdit(null)
    }

    return (
        <DragDropContext 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-6">
                <div className="mb-8 w-full">
                    <p className="text-sm text-[#666] mb-4">
                        Pro tip: Text any URL to +46766866754 to save it instantly!
                    </p>
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                    />
                </div>

                <div className="flex flex-col lg:flex-row min-h-[calc(100vh-12rem)]">
                    <BookmarkSidebar
                        view={view}
                        onViewChange={setView}
                        unreadCount={unreadCount}
                        categories={categories}
                        setCategories={setCategories}
                        handleCreateCategory={handleCreateCategory}
                        selectedCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId}
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                    />

                    <div className="flex-1 lg:pl-6">
                        <BookmarkGrid
                            bookmarks={filteredBookmarks}
                            onDelete={handleDelete}
                            onEdit={setBookmarkToEdit}
                            onQuickView={() => console.log('quick view')}
                            onArchive={handleArchive}
                            view={view}
                            onNewBookmark={() => setIsFormOpen(true)}
                            selectedCategory={selectedCategoryId
                                ? categories.find(c => c.id === selectedCategoryId) || null
                                : null
                            }
                        />
                    </div>
                </div>

                {(isFormOpen || bookmarkToEdit) && (
                    <BookmarkForm
                        bookmark={bookmarkToEdit}
                        onBookmarkCreated={handleNewBookmark}
                        onBookmarkUpdated={handleBookmarkUpdate}
                        onClose={() => {
                            setIsFormOpen(false)
                            setBookmarkToEdit(null)
                        }}
                        categories={categories}
                    />
                )}

                <BookmarkQuickView
                    bookmark={selectedBookmark}
                    onClose={() => setSelectedBookmark(null)}
                />
            </div>
        </DragDropContext>
    )
} 