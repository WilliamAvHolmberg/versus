'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateUser, deleteAccount } from '../../actions/settings'
import { validateUsername } from '../../lib/validation'
import type { User } from '@prisma/client'

interface SettingsFormProps {
  user: User
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name || '',
    email: user.email || ''
  })
  const [error, setError] = useState<string>()
  const [usernameError, setUsernameError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Validate username as user types
  useEffect(() => {
    const validation = validateUsername(formData.username)
    setUsernameError(validation.error)
  }, [formData.username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't submit if there are validation errors
    if (usernameError) {
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      await updateUser(formData)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      await deleteAccount()
      router.push('/auth')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData(prev => ({ 
            ...prev, 
            username: e.target.value.toLowerCase() 
          }))}
          className={`w-full p-2 border rounded-lg ${
            usernameError ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-1">{usernameError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="submit"
          disabled={isLoading || !!usernameError}
          className={`px-4 py-2 rounded-lg ${
            isLoading || usernameError 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg ${
            showDeleteConfirm 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-red-100 hover:bg-red-200'
          } text-red-700 hover:text-red-800`}
        >
          {showDeleteConfirm ? 'Click again to confirm' : 'Delete Account'}
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </form>
  )
} 