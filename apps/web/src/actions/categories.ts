'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from './auth'

export type CategoryWithChildren = {
  id: string
  name: string
  order: number
  bookmarkCount: number
}

export type CreateCategoryInput = {
  name: string
  parentId?: string | null
  order?: number
}

export type UpdateCategoryOrderInput = {
  id: string
  parentId?: string | null
  order: number
}

export async function getCategories(): Promise<CategoryWithChildren[]> {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
      parentId: null // Get root categories
    },
    include: {
      children: {
        include: {
          children: true,
          _count: {
            select: { bookmarks: true }
          }
        }
      },
      _count: {
        select: { bookmarks: true }
      }
    },
    orderBy: { order: 'asc' }
  })

  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    order: cat.order,
    bookmarkCount: cat._count.bookmarks,
    children: cat.children.map(child => ({
      id: child.id,
      name: child.name,
      order: child.order,
      bookmarkCount: child._count.bookmarks,
      children: child.children.map(grandChild => ({
        id: grandChild.id,
        name: grandChild.name,
        order: grandChild.order,
        bookmarkCount: 0,
        children: []
      }))
    }))
  }))
}

export async function createCategory(data: CreateCategoryInput) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const category = await prisma.category.create({
    data: {
      ...data,
      userId: session.user.id
    }
  })

  revalidatePath(`/${session.user.username}`)
  return category
}

export async function updateCategoryOrder(updates: UpdateCategoryOrderInput[]) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  await prisma.$transaction(
    updates.map(({ id, parentId, order }) =>
      prisma.category.update({
        where: { id },
        data: { parentId, order }
      })
    )
  )

  revalidatePath(`/${session.user.username}`)
}

export async function deleteCategory(id: string) {
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  await prisma.$transaction(async (tx) => {
    await tx.bookmark.updateMany({
      where: {
        categoryId: id,
        userId: session.user.id
      },
      data: {
        categoryId: null
      }
    })

    await tx.category.delete({
      where: {
        id,
        userId: session.user.id
      }
    })
  })

  revalidatePath(`/${session.user.username}`)
} 