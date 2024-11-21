'use server'

import { prisma } from '../lib/db'
import { revalidatePath } from 'next/cache'
import { getSession } from './auth'
import { track } from '../lib/analytics'
import type { Feedback, FeedbackType, FeedbackStatus } from '@prisma/client'

export async function createFeedback(data: {
  type: FeedbackType
  title: string
  description: string
  phoneNumber?: string
}): Promise<Feedback> {
  const session = await getSession()
  
  const feedback = await prisma.feedback.create({
    data: {
      ...data,
      userId: session?.user?.id
    }
  })

  // Track feedback submission
  await track({
    type: 'feedback_submit',
    userId: session?.user?.id,
    metadata: {
      feedbackType: data.type,
      feedbackId: feedback.id
    }
  })

  revalidatePath('/admin/feedback')
  return feedback
}

export async function updateFeedbackStatus(
  id: string, 
  status: FeedbackStatus
): Promise<Feedback> {
  const feedback = await prisma.feedback.update({
    where: { id },
    data: { status }
  })

  revalidatePath('/admin/feedback')
  return feedback
}

export async function getFeedback(options?: {
  status?: FeedbackStatus
  type?: FeedbackType
}) {
  return prisma.feedback.findMany({
    where: {
      status: options?.status,
      type: options?.type
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
} 