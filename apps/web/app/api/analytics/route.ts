import { track } from '@/lib/analytics'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const event = await request.json()

        await track({
            type: event.type,
            userId: event.userId,
            sessionId: event.sessionId,
            visitorId: event.visitorId,
            path: event.path,
            metadata: event.metadata || undefined,

        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to save analytics:', error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
} 