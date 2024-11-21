'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import type { BookmarkWithContentType, CreateBookmarkInput } from '../lib/types'
import { getSession } from './auth'
import { track } from '../lib/analytics'

export async function createBookmark(data: CreateBookmarkInput): Promise<BookmarkWithContentType> {
    const session = await getSession()
    if (!session) {
        throw new Error('Not authenticated')
    }

    const bookmark = await prisma.bookmark.create({
        data: {
            ...data,
            userId: session.user.id,
            source: data.source || 'web'
        },
        include: {
            contentType: true,
            user: true,
        },
    })

    revalidatePath(`/${session.user.username}`)

    await track({
        type: 'bookmark_create',
        userId: session.user.id,
        metadata: {
            source: data.source,
            contentType: bookmark.contentType.name
        }
    })

    return bookmark
}

export async function deleteBookmark(id: string, username: string) {
    const session = await getSession()
    if (!session) {
        throw new Error('Not authenticated')
    }

    const bookmark = await prisma.bookmark.delete({
        where: {
            id,
            userId: session.user.id // Only allow deleting own bookmarks
        },
    })

    revalidatePath(`/${username}`)
    return bookmark
}

export async function getBookmarks(username: string): Promise<BookmarkWithContentType[]> {
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            user: {
                username,
            },
        },
        include: {
            contentType: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return bookmarks
}

export async function getBookmarksByTag(username: string, tag: string): Promise<BookmarkWithContentType[]> {
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            user: {
                username,
            },
            tags: {
                has: tag,
            },
        },
        include: {
            contentType: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return bookmarks
}

export async function updateBookmarkStatus(
    id: string,
    status: 'unread' | 'read' | 'archived',
    username: string
) {
    const session = await getSession()
    if (!session) throw new Error('Not authenticated')

    const bookmark = await prisma.bookmark.update({
        where: {
            id,
            userId: session.user.id
        },
        data: {
            status,
            readAt: status === 'read' ? new Date() : null
        }
    })

    revalidatePath(`/${username}`)
    return bookmark
}

export async function updateBookmarkCategory(
  id: string,
  categoryId: string | null,
  username: string
) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const bookmark = await prisma.bookmark.update({
    where: {
      id,
      userId: session.user.id
    },
    data: {
      categoryId
    },
    include: {
      contentType: true,
      user: true,
    }
  })

  revalidatePath(`/${username}`)
  return bookmark
}

type UpdateBookmarkInput = {
  id: string
  title: string
  tags: string[]
  categoryId: string | null
}

export async function updateBookmark(data: UpdateBookmarkInput): Promise<BookmarkWithContentType> {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const bookmark = await prisma.bookmark.update({
    where: {
      id: data.id,
      userId: session.user.id
    },
    data: {
      title: data.title,
      tags: data.tags,
      categoryId: data.categoryId
    },
    include: {
      contentType: true,
      user: true,
    }
  })

  revalidatePath(`/${session.user.username}`)
  return bookmark
}

export async function incrementBookmarkClickCount(id: string): Promise<void> {
  // No session check - anyone can increment clicks for shared bookmarks
  await prisma.bookmark.update({
    where: {
      id,
    },
    data: {
      clickCount: {
        increment: 1
      }
    }
  })
}