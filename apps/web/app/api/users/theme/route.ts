import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/db'
import { getSession } from '../../../../src/actions/auth'

export async function GET() {
    const session = await getSession()

    if (!session || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const theme = await prisma.theme.findUnique({
        where: { userId: session.user.id }
    })

    return NextResponse.json(theme)
} 