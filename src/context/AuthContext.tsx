/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, _password: string, role?: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  'admin@ticostay.cr': {
    id: '1',
    name: 'María Rodríguez',
    email: 'admin@ticostay.cr',
    role: 'admin',
  },
  'user@ticostay.cr': {
    id: '2',
    name: 'Carlos Mora',
    email: 'user@ticostay.cr',
    role: 'user',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('tico-user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, _password: string, role: UserRole = 'user') => {
    // Mock login — replace with real API call
    await new Promise(res => setTimeout(res, 800))
    const found = MOCK_USERS[email]
    const mockUser: User = found ?? {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
    }
    setUser(mockUser)
    localStorage.setItem('tico-user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tico-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
