'use client'

import { useState, useEffect } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { FeedbackForm } from './FeedbackForm'
import { trackEvent } from '@/lib/analytics-client'

interface FeedbackData {
  title: string
  description: string
  type: 'FEATURE_REQUEST' | 'BUG_REPORT' | 'OTHER'
}

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<FeedbackData | null>(null)

  useEffect(() => {
    const handleFeedbackEvent = (event: CustomEvent<FeedbackData>) => {
      void trackEvent({
        type: 'feedback_button_click',
        metadata: {
          location: window.location.pathname
        }
      })
      setFormData(event.detail)
      setIsOpen(true)
    }

    // Add event listener
    window.addEventListener('openFeedback', handleFeedbackEvent as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('openFeedback', handleFeedbackEvent as EventListener)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => {
        void trackEvent({
          type: 'feedback_button_click',
          metadata: {
            location: window.location.pathname
          }
        })
      }}>
        <button
          className="fixed bottom-4 left-4 md:right-4 md:left-auto p-2 bg-[var(--color-medium)] 
            text-[var(--color-lightest)] rounded-lg shadow-lg hover:bg-[var(--color-dark)] 
            transition-all duration-200 hover:scale-105 flex items-center gap-2 text-sm"
          aria-label="Submit Feedback"
        >
          <MessageSquarePlus size={18} />
          <span>Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        <FeedbackForm 
          key={formData?.title} // Force re-render with new data
          defaultType={formData?.type}
          defaultTitle={formData?.title}
          defaultDescription={formData?.description}
          onSuccess={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
} 