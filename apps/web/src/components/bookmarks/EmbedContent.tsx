'use client'

import { useEffect, useState } from 'react'
import type { BookmarkWithContentType } from '../../lib/types'

interface EmbedContentProps {
  bookmark: BookmarkWithContentType
}

export function EmbedContent({ bookmark }: EmbedContentProps) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        switch (bookmark.contentType.strategy) {
          case 'twitter': {
            // Modern X/Twitter embed
            const tweetId = bookmark.url.split('/').pop()
            setContent(`
              <div>
                <a 
                  href="${bookmark.url}"
                  class="twitter-timeline-embedded"
                  data-tweet-id="${tweetId}"
                >
                  Loading tweet...
                </a>
              </div>
            `)
            
            // Let the script know there's new content to process
            if (typeof window !== 'undefined' && window.twttr) {
              setTimeout(() => {
                window.twttr?.widgets?.load()
              }, 0)
            }
            break
          }

          case 'reddit':
            setContent(`<iframe src="https://www.redditmedia.com/r/${bookmark.url}?ref_source=embed" height="400" width="100%" style="border: none;"></iframe>`)
            break

          case 'medium':
            setContent(`<div id="medium-embed"></div>`)
            break

          default:
            if (bookmark.preview) {
              setContent(`
                <div class="aspect-video rounded-lg overflow-hidden bg-primary-100 dark:bg-primary-800">
                  <img src="${bookmark.preview}" alt="${bookmark.title}" class="w-full h-full object-cover" />
                </div>
              `)
            }
        }
      } catch (err) {
        setError('Failed to load content')
        console.error(err)
      }
    }

    fetchContent()
  }, [bookmark])

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {error}
      </div>
    )
  }

  if (!content) {
    return (
      <div className="animate-pulse bg-primary-100 dark:bg-primary-800 rounded-lg aspect-video" />
    )
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content }}
      className="w-full rounded-lg overflow-hidden"
    />
  )
} 