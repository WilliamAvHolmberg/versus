'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { verifyCode } from '../../lib/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth'

interface VerificationFormProps {
  phone: string
}

export function VerificationForm({ phone }: VerificationFormProps) {
  const router = useRouter()
  const { setUser } = useAuth()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const user = await verifyCode(phone, code)
      setUser(user)
      setIsRedirecting(true)
      router.push(`/${user.username}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[var(--color-lightest)] rounded-lg p-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            required
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="1234"
            maxLength={4}
            className="w-full p-3 rounded-lg border border-[var(--color-light)] 
              bg-transparent text-[var(--color-darkest)]
              text-center text-2xl tracking-[0.5em] font-mono
              placeholder:text-[var(--color-medium)] placeholder:tracking-normal
              focus:outline-none focus:ring-1 focus:ring-[var(--color-dark)] 
              focus:border-[var(--color-dark)] transition-all"
          />
          <p className="mt-2 text-sm text-[var(--color-medium)]">
            Enter the 4-digit code sent to {phone}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || isRedirecting || code.length !== 4}
          className="w-full px-4 py-2.5 bg-[var(--color-dark)] text-[var(--color-lightest)] 
            rounded-lg hover:bg-[var(--color-darkest)] disabled:opacity-50 
            disabled:cursor-not-allowed transition-colors"
        >
          {isRedirecting ? 'Redirecting...' : isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </motion.div>
  )
} 