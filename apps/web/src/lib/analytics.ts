'use server'

import { prisma } from './db'
import { cache } from 'react'

interface GeoData {
    city?: string
    country?: string
    region?: string
}

interface TrackEvent {
    type: 'pageview' | 'login' | 'bookmark_create' | 'bookmark_click' | 'category_create' |
    'feedback_button_click' | 'feedback_submit'
    userId?: string
    sessionId?: string
    visitorId?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>
    path?: string
    geo?: GeoData
}

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Use React cache to minimize DB writes for pageviews
const getRecentPageview = cache(async (visitorId: string, path: string) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    return prisma.analytics.findFirst({
        where: {
            visitorId,
            type: 'pageview',
            path,
            timestamp: { gte: fiveMinutesAgo }
        }
    })
})

export async function trackEdge(event: TrackEvent) {
    return fetch(API_URL + '/api/analytics', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(event),
    }).catch(error => {
        console.error('Analytics error:', error)
    })
}

export async function track(event: TrackEvent) {
    if (event.type === 'pageview' && event.visitorId && event.path) {
        const recent = await getRecentPageview(event.visitorId, event.path)
        if (recent) return
    }

    try {
        await prisma.analytics.create({
            data: {
                type: event.type,
                userId: event.userId,
                sessionId: event.sessionId,
                visitorId: event.visitorId,
                path: event.path,
                metadata: {
                    ...(event.metadata || {}),
                    geo: event.geo ? JSON.stringify(event.geo) : undefined
                }
            }
        })
    } catch (error) {
        console.error('Analytics error:', error)
    }
} 