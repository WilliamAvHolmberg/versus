import { getFeedback } from '../../../src/actions/feedback'
import { AdminLayout } from '../../../src/components/layout/AdminLayout'
import { FeedbackList } from '../../../src/components/admin/FeedbackList'

export default async function AdminFeedbackPage() {
  const feedback = await getFeedback()

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feedback</h1>
        </div>

        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg overflow-hidden">
          <FeedbackList initialFeedback={feedback} />
        </div>
      </div>
    </AdminLayout>
  )
} 