import { getSession } from '@/actions/auth'
import { AuthForm } from '../../src/components/auth/AuthForm'
import { redirect } from 'next/navigation'

export default async function AuthPage() {
  const session = await getSession()
  if (session) {
    redirect(`/${session.user.username}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[var(--color-darkest)]">
            Welcome back
          </h1>
          <p className="text-[var(--color-medium)] mt-2">
            Sign in with your phone number
          </p>
        </div>

        <AuthForm />
      </div>
    </main>
  )
} 