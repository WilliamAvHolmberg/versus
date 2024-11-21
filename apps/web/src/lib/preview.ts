import { load } from 'cheerio'

interface MetadataResult {
  title: string
  description: string | null
  image: string | null
  favicon: string | null
  author: string | null
  siteName: string | null
  type: string | null
  url: string
  tags: string[]
  publishedAt: string | null
}

export async function getUrlMetadata(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = load(html)

    // Helper to get meta content
    const getMeta = (selectors: string[]): string | null => {
      for (const selector of selectors) {
        const content = $(`meta[${selector}]`).attr('content')
        if (content) return content
      }
      return null
    }

    console.log('html', html)

    // Get title from various sources
    const title = 
      getMeta(['property="og:title"', 'name="twitter:title"']) ||
      $('title').text() ||
      $('h1').first().text() ||
      url

    // Get description
    const description = 
      getMeta([
        'property="og:description"',
        'name="twitter:description"',
        'name="description"'
      ])

    // Get main image
    const image = 
      getMeta([
        'property="og:image"',
        'name="twitter:image"',
        'property="og:image:url"'
      ]) ||
      $('link[rel="image_src"]').attr('href') ||
      $('img[itemprop="image"]').attr('src')

    // Get favicon
    const favicon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      `${new URL(url).origin}/favicon.ico`

    // Get author
    const author = 
      getMeta([
        'name="author"',
        'property="article:author"',
        'name="twitter:creator"'
      ]) ||
      $('[itemprop="author"]').text()

    // Get site name
    const siteName = 
      getMeta(['property="og:site_name"']) ||
      new URL(url).hostname

    // Get content type
    const type = getMeta(['property="og:type"', 'name="twitter:card"'])

    // Get published date
    const publishedAt = 
      getMeta([
        'property="article:published_time"',
        'name="date"',
        'property="og:published_time"'
      ]) ||
      $('[itemprop="datePublished"]').attr('content')

    // Extract keywords/tags
    const tags = new Set<string>()
    
    // From meta keywords
    const keywords = getMeta(['name="keywords"'])
    if (keywords) {
      keywords.split(',').map(k => k.trim()).forEach(tag => tags.add(tag))
    }

    // From article tags
    $('[property="article:tag"]').each((_, el) => {
      tags.add($(el).attr('content') || '')
    })

    // From hashtags in content
    const hashtags = $('body').text().match(/#[a-zA-Z0-9_]+/g)
    if (hashtags) {
      hashtags.map(tag => tag.slice(1)).forEach(tag => tags.add(tag))
    }

    // Try to detect content type from URL
    let detectedType = 'other'
    if (url.includes('twitter.com')) detectedType = 'twitter'
    else if (url.includes('reddit.com')) detectedType = 'reddit'
    else if (url.includes('medium.com')) detectedType = 'medium'

    return {
      title: title.trim(),
      description: description?.trim() || null,
      image: image ? new URL(image, url).toString() : null,
      favicon: favicon ? new URL(favicon, url).toString() : null,
      author: author?.trim() || null,
      siteName: siteName?.trim() || null,
      type: type?.trim() || detectedType,
      url,
      tags: Array.from(tags),
      publishedAt: publishedAt || null
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
    return {
      title: url,
      description: null,
      image: null,
      favicon: null,
      author: null,
      siteName: null,
      type: 'other',
      url,
      tags: [],
      publishedAt: null
    }
  }
} 