'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from './auth'
import { validateUsername } from '../lib/validation'

interface UpdateUserInput {
  username: string
  name?: string | null
  email?: string | null
}

export async function updateUser(data: UpdateUserInput) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  // Validate username format
  const validation = validateUsername(data.username)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Check if username is taken by another user
  if (data.username !== session.user.username) {
    const [existingUser, existingRedirect] = await Promise.all([
      prisma.user.findUnique({ where: { username: data.username } }),
      prisma.usernameRedirect.findUnique({ where: { oldUsername: data.username } })
    ])

    if (existingUser || existingRedirect) {
      throw new Error('Username is already taken')
    }
  }

  // Update user and create redirect in a transaction
  const user = await prisma.$transaction(async (tx) => {
    // If username is changing, create redirect
    if (data.username !== session.user.username) {
      await tx.usernameRedirect.create({
        data: {
          oldUsername: session.user.username,
          userId: session.user.id
        }
      })
    }

    return tx.user.update({
      where: { id: session.user.id },
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
      }
    })
  })

  // Revalidate paths
  revalidatePath('/settings')
  revalidatePath(`/${user.username}`)
  revalidatePath('/admin/users')

  return user
}

export async function deleteAccount() {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  // Delete user (this will cascade delete all sessions and bookmarks)
  await prisma.user.delete({
    where: { id: session.user.id }
  })

  // No need to revalidate paths since user will be redirected to auth
} 