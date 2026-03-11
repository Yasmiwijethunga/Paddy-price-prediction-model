import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.me()
        .then(setUser)
        .catch(() => { localStorage.removeItem('token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password)
    localStorage.setItem('token', data.access_token)
    // Use the user object returned from the login response directly
    // (no extra /auth/me round-trip, and avoids the React state timing race)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (formData) => {
    return authService.register(formData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const isAdmin      = user?.role === 'admin'
  const isResearcher = user?.role === 'researcher' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isResearcher }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
