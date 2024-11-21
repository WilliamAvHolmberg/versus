'use server'

import { cookies } from 'next/headers'
import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const AUTH_COOKIE = 'pagepin_auth'

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(AUTH_COOKIE)?.value

  if (sessionId) {
    await prisma.session.delete({
      where: { id: sessionId }
    })
    cookieStore.delete(AUTH_COOKIE)
  }

  revalidatePath('/')
  redirect('/auth')
}

export async function getSession() {
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

  return session
} 