'use client'

import { useState } from 'react'
import { updateFeedbackStatus } from '../../actions/feedback'
import type { Feedback, FeedbackStatus, FeedbackType } from '@prisma/client'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

type FeedbackWithUser = Feedback & {
  user: { username: string; name: string | null; phone: string } | null
}

interface FeedbackListProps {
  initialFeedback: FeedbackWithUser[]
}

const STATUS_ICONS = {
  NEW: Clock,
  IN_PROGRESS: AlertCircle,
  COMPLETED: CheckCircle,
  DECLINED: XCircle,
}

const STATUS_COLORS = {
  NEW: 'text-[var(--color-medium)]',
  IN_PROGRESS: 'text-[var(--color-light)]',
  COMPLETED: 'text-[var(--color-dark)]',
  DECLINED: 'text-[var(--color-darkest)]',
}

export function FeedbackList({ initialFeedback }: FeedbackListProps) {
  const [feedback, setFeedback] = useState(initialFeedback)
  const [filter, setFilter] = useState({
    type: '' as FeedbackType | '',
    status: '' as FeedbackStatus | ''
  })

  const filteredFeedback = feedback.filter(item => {
    if (filter.type && item.type !== filter.type) return false
    if (filter.status && item.status !== filter.status) return false
    return true
  })

  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    const updated = await updateFeedbackStatus(id, status)
    setFeedback(prev => prev.map(item => 
      item.id === id ? { ...item, status: updated.status } : item
    ))
  }

  return (
    <div>
      <div className="p-4 border-b border-[var(--color-hover)] flex gap-4">
        <select
          value={filter.type}
          onChange={e => setFilter(prev => ({ ...prev, type: e.target.value as FeedbackType | '' }))}
          className="px-3 py-1 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        >
          <option value="">All Types</option>
          <option value="FEATURE_REQUEST">Feature Requests</option>
          <option value="BUG_REPORT">Bug Reports</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={filter.status}
          onChange={e => setFilter(prev => ({ ...prev, status: e.target.value as FeedbackStatus | '' }))}
          className="px-3 py-1 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        >
          <option value="">All Status</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="DECLINED">Declined</option>
        </select>
      </div>

      <div className="divide-y divide-[var(--color-hover)]">
        {filteredFeedback.map(item => {
          const StatusIcon = STATUS_ICONS[item.status]
          return (
            <div key={item.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-[var(--color-dark)]">
                    {item.user ? (
                      <>
                        By {item.user.name || item.user.username} • {item.user.phone}
                      </>
                    ) : item.phoneNumber ? (
                      <>Anonymous • {item.phoneNumber}</>
                    ) : (
                      'Anonymous'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 ${STATUS_COLORS[item.status]}`} />
                  <select
                    value={item.status}
                    onChange={e => handleStatusChange(item.id, e.target.value as FeedbackStatus)}
                    className="px-2 py-1 text-sm rounded border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
                      focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>
              </div>
              <div className="text-sm bg-[var(--color-stripe-odd)] rounded-lg p-3">
                {item.description}
              </div>
              <div className="mt-2 text-xs text-[var(--color-medium)]">
                {new Date(item.createdAt).toLocaleDateString()} • {item.type.replace('_', ' ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 