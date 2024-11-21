'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import type { ContentType } from '@prisma/client'

export async function createContentType(data: {
  name: string
  logo: string
  strategy: string
}): Promise<ContentType> {
  const contentType = await prisma.contentType.create({
    data
  })

  revalidatePath('/admin/content-types')
  return contentType
}

export async function updateContentType(
  id: string,
  data: {
    name: string
    logo: string
    strategy: string
  }
): Promise<ContentType> {
  const contentType = await prisma.contentType.update({
    where: { id },
    data
  })

  revalidatePath('/admin/content-types')
  return contentType
}

export async function deleteContentType(id: string): Promise<ContentType> {
  const contentType = await prisma.contentType.delete({
    where: { id }
  })

  revalidatePath('/admin/content-types')
  return contentType
}

export async function toggleUserAdmin(id: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { superAdmin: true }
  })

  if (!user) throw new Error('User not found')

  await prisma.user.update({
    where: { id },
    data: { superAdmin: !user.superAdmin }
  })

  revalidatePath('/admin/users')
} 