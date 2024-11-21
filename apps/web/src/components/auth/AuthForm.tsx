'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { initiateAuth } from '../../lib/auth'
import { VerificationForm } from './VerificationForm'

// Matches any phone number starting with + followed by 1-3 digits country code and 8-12 digits
const PHONE_REGEX = /^\+[1-9]\d{0,2}[1-9]\d{7,11}$/

export function AuthForm() {
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showVerification, setShowVerification] = useState(false)

    const isValidPhone = PHONE_REGEX.test(phone)
    const getPhoneError = () => {
        if (!phone) return null
        if (!phone.startsWith('+')) return 'Must start with country code (e.g. +46, +1, +44)'
        if (phone.length < 10) return 'Phone number is too short'
        if (phone.length > 15) return 'Phone number is too long'
        if (!isValidPhone) return 'Invalid phone number format'
        return null
    }

    const phoneError = getPhoneError()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await initiateAuth(phone)
            setShowVerification(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send verification code')
        } finally {
            setIsLoading(false)
        }
    }

    if (showVerification) {
        return <VerificationForm phone={phone} />
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
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+46701234567"
                        className="w-full p-3 rounded-lg border border-[var(--color-light)] 
                            bg-transparent text-[var(--color-darkest)] 
                            placeholder:text-[var(--color-medium)]
                            focus:outline-none focus:ring-1 focus:ring-[var(--color-dark)] 
                            focus:border-[var(--color-dark)] transition-all"
                    />
                    <p className={`mt-2 text-sm ${
                        phoneError 
                            ? 'text-red-500' 
                            : 'text-[var(--color-medium)]'
                    }`}>
                        {phoneError || 'We will send you a verification code via SMS'}
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !isValidPhone}
                    className="w-full px-4 py-2.5 bg-[var(--color-dark)] text-[var(--color-lightest)] 
                        rounded-lg hover:bg-[var(--color-darkest)] disabled:opacity-50 
                        disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Sending...' : 'Continue'}
                </button>
            </form>
        </motion.div>
    )
} 