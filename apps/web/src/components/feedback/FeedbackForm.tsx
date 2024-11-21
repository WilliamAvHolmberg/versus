'use client'

import { useState } from 'react'
import { createFeedback } from '../../actions/feedback'
import type { FeedbackType } from '@prisma/client'
import { useAuth } from '../../contexts/auth'

interface FeedbackFormProps {
  onSuccess?: () => void
  defaultType?: FeedbackType
  defaultTitle?: string
  defaultDescription?: string
}

export function FeedbackForm({ 
  onSuccess, 
  defaultType = 'FEATURE_REQUEST',
  defaultTitle = '',
  defaultDescription = ''
}: FeedbackFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    type: defaultType,
    title: defaultTitle,
    description: defaultDescription,
    phoneNumber: user?.phone || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createFeedback(formData)
      onSuccess?.()
      // Reset form
      setFormData({
        type: defaultType,
        title: defaultTitle,
        description: defaultDescription,
        phoneNumber: user?.phone || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={formData.type}
          onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as FeedbackType }))}
          className="w-full p-2 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        >
          <option value="FEATURE_REQUEST">Feature Request</option>
          <option value="BUG_REPORT">Bug Report</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief summary of your feedback"
          className="w-full p-2 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detailed description..."
          rows={4}
          className="w-full p-2 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Phone Number (optional)
          {user?.phone && " - We'll use this to follow up if needed"}
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          placeholder="+46701234567"
          className="w-full p-2 rounded-lg border bg-[var(--color-stripe-even)] hover:bg-[var(--color-hover)]
            focus:ring-2 focus:ring-[var(--color-medium)] transition-colors"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-[var(--color-medium)] text-[var(--color-lightest)] rounded-lg 
          hover:bg-[var(--color-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
} 