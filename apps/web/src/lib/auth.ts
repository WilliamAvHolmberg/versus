'use server'

import { cookies } from 'next/headers'
import { prisma } from './db'
import { generateCode, hashCode } from './utils'
import { ElksService } from '../services/elks'

const AUTH_COOKIE = 'pagepin_auth'
const CODE_EXPIRY = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 5

const SMS_WELCOME = `📱 Pagepin Bookmarks

Save links by sending them to:
+46766866754

Any URL you send will be saved to your Pagepin library.`

export async function initiateAuth(phone: string) {
    // Generate a 4 digit code
    const code = generateCode(4)
    const hashedCode = await hashCode(code)

    // Create or update session
    await prisma.session.create({
        data: {
            code: hashedCode,
            expiresAt: new Date(Date.now() + CODE_EXPIRY),
            user: {
                connectOrCreate: {
                    where: { phone },
                    create: {
                        phone,
                        username: `user_${Date.now()}`, // Temporary username
                    }
                }
            }
        }
    })

    // Send SMS
    const response = await ElksService.sendSMS(
        phone,
        `Your Pagepin verification code is: ${code}. Valid for 5 minutes.`
    )

    if (!response.success) {
        throw new Error('Failed to send verification code')
    }

    return true
}

export async function verifyCode(phone: string, code: string) {
    // Find active session
    const session = await prisma.session.findFirst({
        where: {
            user: { phone },
            code: { not: null },
            expiresAt: { gt: new Date() }
        },
        include: {
            user: {
                include: {
                    bookmarks: {
                        select: { id: true },
                        take: 1
                    }
                }
            }
        }
    })

    if (!session) {
        throw new Error('No verification session found')
    }

    // Check attempts
    if (session.attempts >= MAX_ATTEMPTS) {
        await prisma.session.delete({
            where: { id: session.id }
        })
        throw new Error('Too many attempts')
    }

    // Verify code
    const hashedInput = await hashCode(code)
    if (hashedInput !== session.code) {
        await prisma.session.update({
            where: { id: session.id },
            data: { attempts: { increment: 1 } }
        })
        throw new Error('Invalid code')
    }

    // Send welcome SMS only if user has no bookmarks
    if (session.user.bookmarks.length === 0) {
        await ElksService.sendSMS(phone, SMS_WELCOME)
    }

    const newSession = await prisma.session.create({
        data: {
            userId: session.user.id,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
        include: {
            user: true
        }
    })

    // Invalidate verification session
    await prisma.session.delete({
        where: { id: session.id }
    })

    // Set auth cookie using Next.js cookies API
    const cookieStore = await cookies()
    cookieStore.set({
        name: AUTH_COOKIE,
        value: newSession.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newSession.expiresAt
    })

    return newSession.user
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(AUTH_COOKIE)?.value

    if (!sessionId) {
        return null
    }

    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
            expiresAt: { gt: new Date() }
        },
        include: { user: true }
    })

    if (!session) {
        cookieStore.delete(AUTH_COOKIE)
        return null
    }

    return session.user
}

export async function logout() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(AUTH_COOKIE)?.value

    if (sessionId) {
        await prisma.session.delete({
            where: { id: sessionId }
        })
        cookieStore.delete(AUTH_COOKIE)
    }
}

// Extension-specific auth functions
export async function initiateExtensionAuth(phone: string) {
    // Reuse the code generation and SMS logic
    return initiateAuth(phone)
}

export async function verifyExtensionCode(phone: string, code: string) {
    // Find active session
    const session = await prisma.session.findFirst({
        where: {
            user: { phone },
            code: { not: null },
            expiresAt: { gt: new Date() }
        },
        include: {
            user: true
        }
    })

    if (!session) {
        throw new Error('No verification session found')
    }

    // Check attempts
    if (session.attempts >= MAX_ATTEMPTS) {
        await prisma.session.delete({
            where: { id: session.id }
        })
        throw new Error('Too many attempts')
    }

    // Verify code
    const hashedInput = await hashCode(code)
    if (hashedInput !== session.code) {
        await prisma.session.update({
            where: { id: session.id },
            data: { attempts: { increment: 1 } }
        })
        throw new Error('Invalid code')
    }

    // Create new session
    const newSession = await prisma.session.create({
        data: {
            userId: session.user.id,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
        include: {
            user: true
        }
    })

    // Invalidate verification session
    await prisma.session.delete({
        where: { id: session.id }
    })

    // Set auth cookie with specific settings for chrome extension
    const cookieStore = await cookies()
    cookieStore.set({
        name: AUTH_COOKIE,
        value: newSession.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', // Allow cross-site access for extension
        expires: newSession.expiresAt,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? 'pagepin.vercel.app' : undefined
    })

    return newSession.user
} 