'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, BookmarkIcon, Settings, MessageSquare } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const links = [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/content-types', label: 'Content Types', icon: BookmarkIcon },
    { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-white dark:bg-primary-900 border-r border-primary-100 dark:border-primary-800">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary-900 dark:text-primary-100">
            Admin Panel
          </h1>
        </div>
        <ul className="space-y-2 p-4">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${pathname === link.href
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100'
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/50'
                  }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 bg-primary-50 dark:bg-primary-950">
        {children}
      </main>
    </div>
  )
} 