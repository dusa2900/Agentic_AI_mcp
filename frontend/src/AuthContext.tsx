import React, { createContext, useContext, useState, useEffect } from 'react'
import api from './api/axios'

interface User {
  id: number
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) {
      setToken(stored)
      // decode or fetch user info if needed
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password })
    setUser(res.data.user)
    setToken(res.data.token)
  }

  const signup = async (email: string, password: string, name?: string) => {
    const res = await api.post('/api/auth/signup', { email, password, name })
    setUser(res.data.user)
    setToken(res.data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return <AuthContext.Provider value={{ user, token, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
