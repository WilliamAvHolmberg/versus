'use client'

import { createContext, useContext, useState } from 'react'
import { logout } from '../actions/auth'
import type { User } from '@prisma/client'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: async () => {},
})

interface AuthProviderProps {
  children: React.ReactNode
  initialUser: User | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setUser(null)
    } catch (err) {
      console.error('Failed to logout:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 