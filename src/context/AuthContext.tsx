/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import api from '../api'

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
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
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

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('tico-user', JSON.stringify(res.data.user));
      localStorage.setItem('tico-token', res.data.token);
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role: 'user' });
      setUser(res.data.user);
      localStorage.setItem('tico-user', JSON.stringify(res.data.user));
      localStorage.setItem('tico-token', res.data.token);
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tico-user');
    localStorage.removeItem('tico-token');
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
