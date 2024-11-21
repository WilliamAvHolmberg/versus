'use server'

import { prisma } from '../lib/db'

export async function getStats() {
  const users = await prisma.user.count()
  
  const totalBookmarks = await prisma.bookmark.count()
  
  const last24hBookmarks = await prisma.bookmark.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  })

  return {
    users,
    totalBookmarks,
    last24hBookmarks
  }
} 