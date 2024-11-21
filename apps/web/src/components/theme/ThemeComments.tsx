'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Trash2, ThumbsUp } from 'lucide-react'
import { addComment, deleteComment, likeComment } from '../../actions/theme'
import type { Theme, ThemeComment, User } from '@prisma/client'

type CommentWithUser = ThemeComment & {
  user: Pick<User, 'username' | 'name'>
  isLiked?: boolean
}

interface ThemeCommentsProps {
  theme: Theme
  comments: CommentWithUser[]
  currentUser: User | null
}

export function ThemeComments({ theme, comments: initialComments, currentUser }: ThemeCommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const comment = await addComment(theme.id, newComment)
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  const handleLike = async (commentId: string) => {
    try {
      const isLiked = await likeComment(commentId)
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes + (isLiked ? 1 : -1),
            isLiked
          }
        }
        return comment
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like comment')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} />
        <h3 className="text-lg font-medium">Comments</h3>
        <span className="text-sm text-primary-500">({comments.length})</span>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 rounded-lg border bg-white/50 dark:bg-primary-800/50"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="p-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {comments.map(comment => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-white/50 dark:bg-primary-800/50"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">
                    {comment.user.name || comment.user.username}
                  </span>
                  <span className="text-sm text-primary-500 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors
                      ${comment.isLiked
                        ? 'text-accent-500 bg-accent-50 dark:bg-accent-900/20'
                        : 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-800/50'
                      }`}
                  >
                    <ThumbsUp size={16} className={comment.isLiked ? 'fill-accent-500' : ''} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>

                  {currentUser?.id === comment.userId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 