'use server'

import { prisma } from '../lib/db'

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  })
}

export async function createUser(data: {
  username: string
  name?: string
  phone: string
  email?: string
}) {
  return prisma.user.create({
    data,
  })
}

export async function getUserByUsernameOrRedirect(username: string) {
  // Try direct username lookup first
  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (user) return { user, redirect: null }

  // Check redirects
  const redirect = await prisma.usernameRedirect.findUnique({
    where: { oldUsername: username },
    include: { user: true }
  })

  if (redirect) {
    return { user: null, redirect: redirect.user.username }
  }

  return { user: null, redirect: null }
} 