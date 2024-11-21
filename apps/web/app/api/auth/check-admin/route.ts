import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../src/lib/db'

const AUTH_COOKIE = 'pagepin_auth'

export async function GET() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(AUTH_COOKIE)?.value

    if (!sessionId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
            expiresAt: { gt: new Date() }
        },
        include: { user: true }
    })

    if (!session?.user.superAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true })
} 