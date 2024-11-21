'use client'

import { useAuth } from '../../contexts/auth'
import { LogOut, Settings, Shield } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  username?: string
  name?: string | null
}

export function Header({ username, name }: HeaderProps) {
  const { user, logout, isLoading } = useAuth()

  return (
    <div className="flex justify-between items-center mb-8 p-4 rounded-lg">
      <div>
        <Link href="/" className="text-4xl font-bold">
          <span 
            className="p-2 rounded-lg text-[var(--color-lightest)] shadow-lg"
            style={{
              background: 'var(--gradient-primary)'
            }}
          >
            Pagepin
          </span>
        </Link>
        {name && (
          <p className="mt-2 text-[var(--color-medium)]">
            @{username}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href={`/${user.username}`}
              className="text-[var(--color-darkest)] hover:text-[var(--color-medium)] transition-colors"
            >
              {user.name || user.username}
            </Link>

            {user.superAdmin && (
              <Link
                href="/admin"
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <Shield size={20} className="text-[var(--color-dark)]" />
              </Link>
            )}

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('toggleSettings'))
              }}
              className="p-2 text-[var(--color-darkest)] hover:text-[var(--color-lightest)] hover:bg-[var(--color-dark)] rounded-full transition-all"
            >
              <Settings size={24} />
            </button>

            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="p-2 text-red-500 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 text-[var(--color-lightest)] rounded-lg shadow-lg hover:shadow-xl transition-all"
            style={{
              background: 'var(--gradient-primary)'
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
} 