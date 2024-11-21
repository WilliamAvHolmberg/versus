import { trackEdge } from '@/lib/analytics'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ipAddress, geolocation } from '@vercel/functions'

const PUBLIC_PATHS = ['/auth', '/api']
const AUTH_COOKIE = 'pagepin_auth'
const VISITOR_COOKIE = 'pagepin_vid'
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function getVisitorId(request: NextRequest): string {
  // Try to get existing visitor ID
  const existingId = request.cookies.get(VISITOR_COOKIE)?.value
  if (existingId) return existingId

  // Generate new visitor ID using IP and user agent
  // Generate new visitor ID using IP and user agent
  const ip = ipAddress(request) || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const newId = btoa(`${ip}:${userAgent}`).slice(0, 32)

  // Set cookie in response
  const response = NextResponse.next()
  response.cookies.set(VISITOR_COOKIE, newId, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  return newId
}

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get(AUTH_COOKIE)?.value
  const visitorId = getVisitorId(request)
  const { pathname } = request.nextUrl

  // Get geolocation data
  const geo = geolocation(request)

  // Track pageview with visitorId
  if (!pathname.startsWith('/api')) {
    void trackEdge({
      type: 'pageview',
      sessionId,
      visitorId, // Add visitor ID to analytics
      path: pathname,
      geo: {
        city: geo?.city,
        country: geo?.country,
        region: geo?.region
      },
      metadata: {
        referrer: request.headers.get('referer')
      }
    })
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path)) || pathname === '/') {
    return NextResponse.next()
  }

  // Admin routes require superAdmin
  if (pathname.startsWith('/admin')) {
    // First check if user is authenticated
    if (!sessionId) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Check admin status via API route
    try {
      const response = await fetch(`${API_URL}/api/auth/check-admin`, {
        headers: {
          Cookie: `${AUTH_COOKIE}=${sessionId}`
        }
      })

      console.log("Your response", response)

      if (!response.ok) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // All other routes require authentication
  if (!sessionId) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }


  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 