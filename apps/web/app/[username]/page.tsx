import { getUserByUsernameOrRedirect } from '../../src/actions/users'
import { getBookmarks } from '../../src/actions/bookmarks'
import { getCategories } from '@/actions/categories'
import { Header } from '../../src/components/layout/Header'
import { BookmarksPage } from './BookmarksPage'
import { redirect } from 'next/navigation'
import type { BookmarkWithContentType } from '../../src/lib/types'

interface PageProps {
    params: Promise<{
        username: string
    }>
}

export default async function UserPage({ params }: PageProps) {
    const { username } = await params
    const { user, redirect: redirectTo } = await getUserByUsernameOrRedirect(username)

    // Handle redirect if found
    if (redirectTo) {
        redirect(`/${redirectTo}`)
    }

    // Handle not found
    if (!user) {
        return <h1>User not found</h1>
    }

    const [bookmarks, categories] = await Promise.all([
        getBookmarks(username),
        getCategories()
    ])
    
    const tags = Array.from(new Set(bookmarks.flatMap((b: BookmarkWithContentType) => b.tags)))

    return (
        <main className="min-h-screen bg-white text-[#000] font-geist">
            <div className="container mx-auto px-4 py-8">
                <Header username={user.username} name={user.name} />
                <BookmarksPage
                    username={user.username}
                    bookmarks={bookmarks}
                    tags={tags}
                    categories={categories}
                />
            </div>
        </main>
    )
} 