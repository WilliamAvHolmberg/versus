'use server'

import { prisma } from '../lib/db'

export async function getContentTypes() {
  return prisma.contentType.findMany()
}

export async function getContentType(id: string) {
  return prisma.contentType.findUnique({
    where: { id },
  })
} 