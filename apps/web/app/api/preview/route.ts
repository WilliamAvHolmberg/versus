import { getUrlMetadata } from '../../../src/lib/preview'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { status: 400 }
      )
    }

    const metadata = await getUrlMetadata(url)

    return new Response(
      JSON.stringify(metadata),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Preview error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch preview' 
      }),
      { status: 500 }
    )
  }
} 