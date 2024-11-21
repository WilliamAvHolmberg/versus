declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void
      }
    }
  }
}

import type { Bookmark, ContentType, User } from '@prisma/client'

export type BookmarkWithContentType = Bookmark & {
  contentType: ContentType
  user: User
}

export type UserWithBookmarks = User & {
  bookmarks: BookmarkWithContentType[]
}

export type CreateBookmarkInput = {
  title: string
  url: string
  tags: string[]
  contentTypeId: string
  preview?: string | null
  categoryId?: string | null
  source?: 'web' | 'extension' | 'sms'
}

export const serviceLogos = {
  twitter: '/twitter-logo.svg',
  reddit: '/reddit-logo.svg',
  medium: '/medium-logo.svg',
  other: '/link-icon.svg',
} as const 