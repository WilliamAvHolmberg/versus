'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from './auth'
import type { Theme } from '@prisma/client'

export async function getTheme(userId: string) {
  return prisma.theme.findUnique({
    where: { userId }
  })
}

export async function updateTheme(data: Partial<Theme>) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const theme = await prisma.theme.upsert({
    where: {
      userId: session.user.id
    },
    create: {
      ...data,
      userId: session.user.id
    },
    update: data
  })

  revalidatePath('/settings')
  revalidatePath(`/${session.user.username}`)

  return theme
}

export async function shareTheme(themeId: string, isPublic: boolean) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const theme = await prisma.theme.update({
    where: {
      id: themeId,
      userId: session.user.id
    },
    data: {
      isPublic
    }
  })

  revalidatePath('/settings')
  return theme
}

export async function cloneTheme(themeId: string) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const sourceTheme = await prisma.theme.findUnique({
    where: {
      id: themeId,
      isPublic: true
    }
  })

  if (!sourceTheme) {
    throw new Error('Theme not found or not public')
  }

  const newTheme = await prisma.theme.upsert({
    where: {
      userId: session.user.id
    },
    create: {
      userId: session.user.id,
      name: `Clone of ${sourceTheme.name}`,
      primaryColor: sourceTheme.primaryColor,
      accentColor: sourceTheme.accentColor,
      backgroundColor: sourceTheme.backgroundColor,
      textColor: sourceTheme.textColor,
      fontFamily: sourceTheme.fontFamily,
      customCss: sourceTheme.customCss,
      cardStyle: sourceTheme.cardStyle,
      animation: sourceTheme.animation,
      borderRadius: sourceTheme.borderRadius,
      shadows: sourceTheme.shadows,
      glassmorphism: sourceTheme.glassmorphism,
      pattern: sourceTheme.pattern,
      backgroundImage: sourceTheme.backgroundImage,
      backgroundBlur: sourceTheme.backgroundBlur,
      backgroundOverlay: sourceTheme.backgroundOverlay,
    },
    update: {
      name: `Clone of ${sourceTheme.name}`,
      primaryColor: sourceTheme.primaryColor,
      accentColor: sourceTheme.accentColor,
      backgroundColor: sourceTheme.backgroundColor,
      textColor: sourceTheme.textColor,
      fontFamily: sourceTheme.fontFamily,
      customCss: sourceTheme.customCss,
      cardStyle: sourceTheme.cardStyle,
      animation: sourceTheme.animation,
      borderRadius: sourceTheme.borderRadius,
      shadows: sourceTheme.shadows,
      glassmorphism: sourceTheme.glassmorphism,
      pattern: sourceTheme.pattern,
      backgroundImage: sourceTheme.backgroundImage,
      backgroundBlur: sourceTheme.backgroundBlur,
      backgroundOverlay: sourceTheme.backgroundOverlay,
    }
  })

  revalidatePath('/settings')
  return newTheme
}

export async function getPublicThemes(sortBy: 'recent' | 'popular' = 'recent') {
  return prisma.theme.findMany({
    where: {
      isPublic: true
    },
    include: {
      user: {
        select: {
          username: true,
          name: true
        }
      },
      _count: {
        select: {
          ratings: true
        }
      }
    },
    orderBy: sortBy === 'popular' 
      ? { likeCount: 'desc' }
      : { createdAt: 'desc' }
  })
}

export async function searchThemes(query: string) {
  return prisma.theme.findMany({
    where: {
      isPublic: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { searchText: { contains: query, mode: 'insensitive' } },
        { tags: { has: query.toLowerCase() } },
        { user: { 
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } }
          ]
        }}
      ]
    },
    include: {
      user: {
        select: {
          username: true,
          name: true
        }
      },
      _count: {
        select: {
          ratings: true
        }
      }
    },
    orderBy: {
      likeCount: 'desc'
    }
  })
}

export async function rateTheme(themeId: string) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const existingRating = await prisma.themeRating.findUnique({
    where: {
      themeId_userId: {
        themeId,
        userId: session.user.id
      }
    }
  })

  if (existingRating) {
    await prisma.$transaction([
      prisma.themeRating.delete({
        where: { id: existingRating.id }
      }),
      prisma.theme.update({
        where: { id: themeId },
        data: { likeCount: { decrement: 1 } }
      })
    ])
  } else {
    await prisma.$transaction([
      prisma.themeRating.create({
        data: {
          themeId,
          userId: session.user.id,
          rating: 1
        }
      }),
      prisma.theme.update({
        where: { id: themeId },
        data: { likeCount: { increment: 1 } }
      })
    ])
  }

  revalidatePath('/settings')
  return !existingRating
}

export async function getUserRating(themeId: string) {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  const rating = await prisma.themeRating.findUnique({
    where: {
      themeId_userId: {
        themeId,
        userId: session.user.id
      }
    }
  })

  return rating !== null
}

export async function addComment(themeId: string, content: string) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const comment = await prisma.themeComment.create({
    data: {
      content,
      themeId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
        }
      }
    }
  })

  revalidatePath('/settings')
  return comment
}

export async function deleteComment(commentId: string) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const comment = await prisma.themeComment.delete({
    where: {
      id: commentId,
      userId: session.user.id
    }
  })

  revalidatePath('/settings')
  return comment
}

export async function likeComment(commentId: string) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const comment = await prisma.themeComment.findUnique({
    where: { id: commentId }
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  await prisma.themeComment.update({
    where: { id: commentId },
    data: {
      likes: comment.likes + 1
    }
  })

  revalidatePath('/settings')
  return true
}