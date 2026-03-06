import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute() {
  const { user, loading } = useAuth()
  const hasToken = !!localStorage.getItem('token')

  // Show spinner while loading OR when a token exists but user state hasn't
  // been set yet (e.g. immediately after login before React re-renders)
  if (loading || (hasToken && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
